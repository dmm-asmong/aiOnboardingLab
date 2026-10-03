document.addEventListener('DOMContentLoaded', () => {

    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    // 3. Curriculum Filter & Load More
    const filterBtns = document.querySelectorAll('.filter-btn');
    const curriculumItems = document.querySelectorAll('.curri-card');
    const loadMoreBtn = document.getElementById('load-more-btn');
    let currentFilter = 'all';
    let isExpanded = false;
    const INITIAL_COUNT = 6;

    function renderCurriculum() {
        const matching = [...curriculumItems].filter(item => currentFilter === 'all' || item.dataset.category === currentFilter);
        const limit = currentFilter === 'all' && !isExpanded ? INITIAL_COUNT : matching.length;
        curriculumItems.forEach(item => { item.style.display = 'none'; });
        matching.slice(0, limit).forEach(item => { item.style.display = 'flex'; });
        loadMoreBtn.style.display = matching.length > limit ? 'inline-flex' : 'none';
        const category = [...filterBtns].find(btn => btn.dataset.filter === currentFilter).textContent;
        document.getElementById('curriculum-status').textContent = `${category} 과정 ${matching.length}개 중 ${Math.min(limit, matching.length)}개 표시`;
    }

    filterBtns.forEach(btn => btn.setAttribute('aria-pressed', String(btn.classList.contains('active'))));
    renderCurriculum();

    // Event Listeners for Filters
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // UI Update
            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');

            // Logic Update
            currentFilter = btn.getAttribute('data-filter');
            if (currentFilter === 'all') isExpanded = false;

            renderCurriculum();
        });
    });

    // Event Listener for Load More
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            isExpanded = true;
            renderCurriculum();
            const firstNewTitle = curriculumItems[INITIAL_COUNT].querySelector('.curri-title');
            firstNewTitle.tabIndex = -1;
            firstNewTitle.focus({ preventScroll: true });
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
            faqItems.forEach(other => {
                other.classList.remove('active');
                other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    function closeMenu() {
        navLinks.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.setAttribute('aria-label', '메뉴 열기');
    }
    mobileMenuBtn.addEventListener('click', () => {
        const open = navLinks.classList.toggle('active');
        mobileMenuBtn.setAttribute('aria-expanded', String(open));
        mobileMenuBtn.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    });
    navLinks.addEventListener('click', event => {
        if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMenu();
            mobileMenuBtn.focus();
        }
    });

    const courseInput = document.getElementById('form-course');
    const initialCourse = new URLSearchParams(location.search).get('course');
    if (initialCourse) courseInput.value = initialCourse;
    document.addEventListener('click', event => {
        const inquiry = event.target.closest('.course-btn.primary, .track-btn.primary, .curri-btn');
        if (!inquiry) return;
        const card = inquiry.closest('.course-card, .track-card-course-style, .curri-card');
        courseInput.value = card.querySelector('h3').innerText.replace(/\s+/g, ' ').trim();
        courseInput.focus({ preventScroll: true });
    });

    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    function showFormStatus(message, state) {
        formStatus.textContent = message;
        formStatus.dataset.state = state;
    }
    function validatePhone() {
        const input = document.getElementById('form-phone');
        const digits = input.value.replace(/-/g, '');
        // Domestic mobile, geographic landline, and 070 internet telephone formats.
        const valid = /^(?:010\d{8}|01[16789]\d{7,8}|02[1-9]\d{6,7}|0(?:3[1-3]|[46][1-4]|5[1-5])[1-9]\d{6,7}|070\d{8})$/.test(digits);
        document.getElementById('phone-error').textContent = valid ? '' : '휴대폰 또는 지역번호를 포함한 일반전화 번호를 확인해주세요. 예: 010-1234-5678, 02-123-4567, 031-123-4567';
        input.setAttribute('aria-invalid', String(!valid));
        return valid;
    }
    document.getElementById('form-phone').addEventListener('blur', validatePhone);
    const emailInput = document.getElementById('form-email');
    function validateEmail() {
        const valid = emailInput.validity.valid;
        document.getElementById('email-error').textContent = valid ? '' : '이메일 주소 형식을 확인해주세요. 예: name@example.com';
        emailInput.setAttribute('aria-invalid', String(!valid));
        return valid;
    }
    emailInput.addEventListener('blur', validateEmail);
    emailInput.addEventListener('invalid', validateEmail);
    emailInput.addEventListener('input', () => {
        if (emailInput.getAttribute('aria-invalid') === 'true') validateEmail();
    });

    contactForm.addEventListener('submit', async event => {
        event.preventDefault();
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        if (submitBtn.disabled) return;
        if (!validatePhone()) {
            document.getElementById('form-phone').focus();
            return;
        }
        if (!validateEmail()) {
            emailInput.focus();
            return;
        }
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.textContent = '전송 중…';
        showFormStatus('문의 내용을 전송하고 있습니다.', 'sending');
        const message = document.getElementById('form-message').value;
        const formData = {
            name: document.getElementById('form-name').value,
            phone: document.getElementById('form-phone').value,
            email: document.getElementById('form-email').value,
            message: courseInput.value.trim() ? `문의 과정: ${courseInput.value.trim()}\n\n${message}` : message
        };
        const scriptURL = 'https://script.google.com/macros/s/AKfycbz7j-ks94iygdojnNtZidvApaOV0hWdGLkMhNDNotKbACP9dO1lwfxb5dyDiFppQW136g/exec';
        try {
            // Keep this a simple POST; read the ContentService JSON after its redirect.
            const response = await fetch(scriptURL, {
                method: 'POST', mode: 'cors', redirect: 'follow',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify(formData),
                signal: AbortSignal.timeout(15000)
            });
            if (!response.ok) throw new Error('Request failed');
            const receipt = await response.json();
            if (receipt?.result !== 'success') throw new Error('Saving was not confirmed');
            contactForm.reset();
            document.getElementById('email-error').textContent = '';
            emailInput.removeAttribute('aria-invalid');
            document.getElementById('phone-error').textContent = '';
            document.getElementById('form-phone').removeAttribute('aria-invalid');
            showFormStatus('문의가 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.', 'success');
        } catch (error) {
            const uncertain = error.name === 'TimeoutError';
            showFormStatus(uncertain
                ? '응답을 기다리는 시간이 초과되었습니다. 접수 여부를 확인할 수 없어 입력 내용을 유지했습니다. 다시 보내기 전 이메일 또는 카카오톡으로 확인해주세요.'
                : '접수 완료를 확인하지 못했습니다. 입력 내용은 유지했습니다. 중복 접수를 피하려면 다시 보내기 전 아래 이메일 또는 카카오톡으로 확인해주세요.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
    const phoneInput = document.getElementById('form-phone');
    phoneInput.addEventListener('input', () => {
        const raw = phoneInput.value.replace(/\D/g, '');
        const prefixLength = raw.startsWith('02') ? 2 : 3;
        const number = raw.slice(0, prefixLength + 8);
        const prefix = number.slice(0, prefixLength);
        const rest = number.slice(prefixLength);
        const middleLength = rest.length > 7 ? 4 : 3;
        phoneInput.value = !rest ? prefix
            : rest.length <= middleLength ? `${prefix}-${rest}`
            : `${prefix}-${rest.slice(0, middleLength)}-${rest.slice(middleLength)}`;
        // Clear an old error as soon as the corrected number is valid.
        if (phoneInput.getAttribute('aria-invalid') === 'true') validatePhone();
    });

});
