document.addEventListener('DOMContentLoaded', () => {

    // 1. Scroll Progress Bar
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const progressBar = document.querySelector('.scroll-progress-bar');
        if (progressBar) {
            progressBar.style.width = scrolled + "%";
        }

        // Sticky Header Logic reused here
        const header = document.getElementById('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Stats Count-up Animation
    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseFloat(entry.target.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const start = 0;
                const startTime = performance.now();

                const suffix = entry.target.getAttribute('data-suffix') || '';

                const animate = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    // Ease out quart
                    const ease = 1 - Math.pow(1 - progress, 4);

                    const current = start + (target - start) * ease;

                    let formattedNumber;
                    if (Number.isInteger(target)) {
                        formattedNumber = Math.floor(current);
                        // Handle comma for thousands
                        if (formattedNumber >= 1000) {
                            formattedNumber = formattedNumber.toLocaleString();
                        }
                    } else {
                        formattedNumber = current.toFixed(1);
                    }

                    entry.target.innerText = formattedNumber + suffix;

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        // Ensure final value matches target with formatting
                        let finalNumber = target;
                        if (Number.isInteger(target) && target >= 1000) {
                            finalNumber = target.toLocaleString();
                        }
                        entry.target.innerText = finalNumber + suffix;
                    }
                };

                requestAnimationFrame(animate);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.stat-number').forEach(stat => {
        statsObserver.observe(stat);
    });

    // 3. Curriculum Filter & Load More
    const filterBtns = document.querySelectorAll('.filter-btn');
    const curriculumItems = document.querySelectorAll('.curri-card');
    const loadMoreBtn = document.getElementById('load-more-btn');
    let currentFilter = 'all';
    let isExpanded = false;
    const INITIAL_COUNT = 6;

    function renderCurriculum() {
        let visibleCount = 0;

        curriculumItems.forEach(item => {
            const category = item.getAttribute('data-category');
            const matchesFilter = currentFilter === 'all' || category === currentFilter;

            if (matchesFilter) {
                // Determine if it should be hidden based on expansion state (only for 'all' filter)
                if (currentFilter === 'all' && !isExpanded && visibleCount >= INITIAL_COUNT) {
                    item.style.display = 'none';
                } else {
                    item.style.display = 'flex'; // Restore flex display
                }
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        // Toggle Load More Button
        if (currentFilter === 'all' && !isExpanded && visibleCount > INITIAL_COUNT) {
            // Wait, visibleCount counts ALL matches. If total matches > 6, we show button?
            // Yes. In 'all' mode, total items is 14. visibleCount=14.
            // But we hid some.
            // Logic check: visibleCount is incremented for ALL matches regardless of hiding.
            if (loadMoreBtn) loadMoreBtn.style.display = 'inline-flex';
        } else {
            if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        }
    }

    // Initial Render
    renderCurriculum();

    // Event Listeners for Filters
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // UI Update
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Logic Update
            currentFilter = btn.getAttribute('data-filter');
            // Reset expansion when switching filters? Usually yes.
            // Or keep it? Let's reset for 'all' to feel fresh, or keep logic simple.
            // If I switch to 'teacher' (show all teachers), then back to 'all', should it be collapsed? Yes.
            if (currentFilter === 'all') isExpanded = false;

            renderCurriculum();
        });
    });

    // Event Listener for Load More
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            isExpanded = true;
            renderCurriculum();
        });
    }

    // 4. FAQ Accordion (Enhanced)
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Toggle active class
            const isActive = item.classList.contains('active');

            // Close others? (Optional, implies "Accordion" behavior usually)
            faqItems.forEach(other => other.classList.remove('active'));

            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // 5. Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href === "#") return;
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 6. Mobile Menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // 7. Contact Form Submission (Google Sheets)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Button Loading State
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '전송 중... <i class="fas fa-spinner fa-spin"></i>';

            // Collect Data
            const name = document.getElementById('form-name').value;
            const phone = document.getElementById('form-phone').value;
            const email = document.getElementById('form-email').value;
            const message = document.getElementById('form-message').value;

            // Basic Phone Validation (010-xxxx-xxxx or 02-xxx-xxxx)
            // Allows: 010-1234-5678, 02-123-4567, 031-123-4567
            const phoneRegex = /^0\d{1,2}-\d{3,4}-\d{4}$/;
            if (!phoneRegex.test(phone)) {
                alert('연락처 형식이 올바르지 않습니다.\n하이픈(-)을 포함하여 입력해주세요.\n(예: 010-1234-5678)');
                const phoneInput = document.getElementById('form-phone');
                phoneInput.focus();
                // Restore button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                return;
            }

            const formData = {
                name: name,
                phone: phone,
                email: email,
                message: message
            };

            // Google Apps Script Web App URL
            const scriptURL = 'https://script.google.com/macros/s/AKfycbz7j-ks94iygdojnNtZidvApaOV0hWdGLkMhNDNotKbACP9dO1lwfxb5dyDiFppQW136g/exec';

            fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    // 'application/json' triggers a CORS preflight options check which GAS doesn't handle.
                    // 'text/plain' allows a simple POST without preflight.
                    'Content-Type': 'text/plain'
                },
                body: JSON.stringify(formData)
            })
                .then(response => {
                    // With no-cors, we can't fully check response.ok, but if we get here, it usually means sent.
                    alert('문의가 접수되었습니다. 담당자가 확인 후 빠르게 연락드리겠습니다.');
                    contactForm.reset();
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
                })
                .finally(() => {
                    // Restore Button
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                });
        });
    }
    // 8. Auto-format Phone Number
    const phoneInput = document.getElementById('form-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function (e) {
            let number = e.target.value.replace(/[^0-9]/g, '');
            let tel = '';

            // Seoul Case (02)
            if (number.substring(0, 2) === '02') {
                if (number.length < 3) {
                    return e.target.value = number;
                } else if (number.length < 6) {
                    tel += number.substr(0, 2);
                    tel += '-';
                    tel += number.substr(2);
                } else if (number.length < 10) {
                    tel += number.substr(0, 2);
                    tel += '-';
                    tel += number.substr(2, 3);
                    tel += '-';
                    tel += number.substr(5);
                } else {
                    tel += number.substr(0, 2);
                    tel += '-';
                    tel += number.substr(2, 4);
                    tel += '-';
                    tel += number.substr(6);
                }
            } else {
                // Others (010, 031, etc.)
                if (number.length < 4) {
                    return e.target.value = number;
                } else if (number.length < 7) {
                    tel += number.substr(0, 3);
                    tel += '-';
                    tel += number.substr(3);
                } else if (number.length < 11) {
                    tel += number.substr(0, 3);
                    tel += '-';
                    tel += number.substr(3, 3);
                    tel += '-';
                    tel += number.substr(6);
                } else {
                    tel += number.substr(0, 3);
                    tel += '-';
                    tel += number.substr(3, 4);
                    tel += '-';
                    tel += number.substr(7);
                }
            }
            e.target.value = tel;
        });
    }

});
