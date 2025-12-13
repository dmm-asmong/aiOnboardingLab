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
});
