const contactForm = document.querySelector('.contact__form');
const yearElement = document.getElementById('year');
const faqItems = document.querySelectorAll('.faq__item');
const navToggle = document.querySelector('.site-header__toggle');
const siteNav = document.getElementById('primary-nav');

function updateYear() {
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

function initFaqAccordion() {
    faqItems.forEach((item) => {
        item.addEventListener('toggle', () => {
            if (item.open) {
                faqItems.forEach((other) => {
                    if (other !== item) {
                        other.removeAttribute('open');
                    }
                });
            }
        });
    });
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach((field) => {
        const container = field.closest('.form-field') || field.parentElement;
        if (!field.value.trim()) {
            field.setAttribute('aria-invalid', 'true');
            field.classList.add('is-invalid');
            if (!container.querySelector('.form-error')) {
                const error = document.createElement('p');
                error.className = 'form-error';
                error.textContent = 'Detta fält är obligatoriskt.';
                container.appendChild(error);
            }
            isValid = false;
        } else {
            field.removeAttribute('aria-invalid');
            field.classList.remove('is-invalid');
            const error = container.querySelector('.form-error');
            if (error) {
                error.remove();
            }
        }
    });

    return isValid;
}

function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!validateForm(form)) {
        return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Skickar...';

    setTimeout(() => {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        form.reset();

        let success = form.querySelector('.form-success');
        if (!success) {
            success = document.createElement('p');
            success.className = 'form-success';
            form.appendChild(success);
        }
        success.textContent = 'Tack! Vi återkommer till dig inom 48 timmar.';
    }, 800);
}

function initForm() {
    if (!contactForm) return;
    contactForm.addEventListener('submit', handleFormSubmit);
}

function closeNav() {
    if (!navToggle || !siteNav) return;
    siteNav.setAttribute('data-state', 'closed');
    siteNav.setAttribute('aria-hidden', 'true');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Öppna menyn');
    document.body.classList.remove('nav-open');
}

function openNav() {
    if (!navToggle || !siteNav) return;
    siteNav.setAttribute('data-state', 'open');
    siteNav.setAttribute('aria-hidden', 'false');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Stäng menyn');
    document.body.classList.add('nav-open');
}

function toggleNav() {
    if (!navToggle || !siteNav) return;
    const isOpen = siteNav.getAttribute('data-state') === 'open';
    if (isOpen) {
        closeNav();
    } else {
        openNav();
    }
}

function handleEscape(event) {
    if (event.key === 'Escape' && siteNav?.getAttribute('data-state') === 'open') {
        closeNav();
        navToggle?.focus();
    }
}

function initMobileNav() {
    if (!navToggle || !siteNav) return;

    navToggle.addEventListener('click', toggleNav);

    siteNav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            closeNav();
        });
    });

    document.addEventListener('keydown', handleEscape);

    const desktopMedia = window.matchMedia('(min-width: 961px)');
    const handleMediaChange = (event) => {
        if (event.matches) {
            siteNav.setAttribute('data-state', 'open');
            siteNav.setAttribute('aria-hidden', 'false');
            document.body.classList.remove('nav-open');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Öppna menyn');
        }
        if (!event.matches) {
            closeNav();
        }
    };

    if (typeof desktopMedia.addEventListener === 'function') {
        desktopMedia.addEventListener('change', handleMediaChange);
    } else if (typeof desktopMedia.addListener === 'function') {
        desktopMedia.addListener(handleMediaChange);
    }

    if (desktopMedia.matches) {
        siteNav.setAttribute('data-state', 'open');
        siteNav.setAttribute('aria-hidden', 'false');
    } else {
        closeNav();
    }
}

function init() {
    updateYear();
    initFaqAccordion();
    initForm();
    initMobileNav();
}

init();
