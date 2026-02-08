/**
 * Contact Page JavaScript
 * Form validation, WhatsApp integration, FAQ accordion
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavToggle();
    initContactForm();
    initFaqAccordion();
    initScrollAnimations();
});

// ===== Navigation Toggle =====
const initNavToggle = () => {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');

    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            menu.classList.toggle('active');
        });
    }
};

// ===== Contact Form =====
const initContactForm = () => {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const messageInput = document.getElementById('message');
    const charCount = document.getElementById('charCount');

    // Character count for message (500 max)
    if (messageInput && charCount) {
        messageInput.addEventListener('input', () => {
            const length = messageInput.value.length;
            const remaining = 500 - length;
            charCount.textContent = `${length}/500 characters`;

            if (length >= 500) {
                charCount.style.color = '#ff4444';
            } else if (length >= 20) {
                charCount.style.color = '#25D366';
            } else {
                charCount.style.color = 'rgba(245, 241, 231, 0.5)';
            }
        });
    }

    // Form submission
    form.addEventListener('submit', handleFormSubmit);

    // Clear error on input
    form.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('input', () => {
            field.classList.remove('error');
            const errorEl = document.getElementById(`${field.id}Error`);
            if (errorEl) errorEl.textContent = '';
        });
    });
};

// ===== Zapier Webhook Configuration =====
// Replace with your actual Zapier webhook URL
const ZAPIER_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/XXXXX/XXXXX/';

// ===== Form Submission Handler =====
const handleFormSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const submitBtn = document.getElementById('submitBtn');

    // Check honeypot (spam protection)
    const honeypot = document.getElementById('website');
    if (honeypot && honeypot.value) {
        console.log('Spam detected');
        return;
    }

    // Rate limiting check (5 per hour)
    if (!checkRateLimit()) {
        showFormError('Too many submissions. Please try again later.');
        return;
    }

    // Validate form
    if (!validateForm(form)) {
        return;
    }

    // Get form data
    const formData = {
        name: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        messageType: document.getElementById('messageType').value,
        occasion: document.getElementById('occasion')?.value || '',
        message: document.getElementById('message').value.trim(),
        contactMethod: document.querySelector('input[name="contactMethod"]:checked')?.value || 'WhatsApp',
        timestamp: new Date().toISOString(),
        source: 'website'
    };

    // Show loading state
    setButtonLoading(submitBtn, true);

    try {
        // Submit to Zapier webhook
        await submitToZapier(formData);

        // Show success message
        showSuccessMessage(form);

        // Record submission for rate limiting
        recordSubmission();

        // Create WhatsApp message and open after short delay
        const whatsappMessage = createWhatsAppMessage(formData);
        const whatsappUrl = `https://wa.me/919824319135?text=${encodeURIComponent(whatsappMessage)}`;

        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
        }, 1500);

    } catch (error) {
        console.error('Form submission error:', error);
        showFormError('Something went wrong. Please try WhatsApp directly or call us.');

        // Still allow WhatsApp fallback on error
        const whatsappMessage = createWhatsAppMessage(formData);
        const whatsappUrl = `https://wa.me/919824319135?text=${encodeURIComponent(whatsappMessage)}`;

        setTimeout(() => {
            if (confirm('Would you like to send your message via WhatsApp instead?')) {
                window.open(whatsappUrl, '_blank');
            }
        }, 2000);
    } finally {
        setButtonLoading(submitBtn, false);
    }
};

// ===== Submit to Zapier Webhook =====
const submitToZapier = async (formData) => {
    // Skip if placeholder URL (for development)
    if (ZAPIER_WEBHOOK_URL.includes('XXXXX')) {
        console.log('Zapier webhook not configured. Form data:', formData);
        return Promise.resolve({ success: true, message: 'Development mode - webhook skipped' });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
        const response = await fetch(ZAPIER_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Request timed out. Please try again.');
        }
        throw error;
    }
};

// ===== Button Loading State =====
const setButtonLoading = (button, isLoading) => {
    if (!button) return;

    if (isLoading) {
        button.disabled = true;
        button.classList.add('loading');
        button.setAttribute('data-original-text', button.innerHTML);
        button.innerHTML = `
            <span class="spinner"></span>
            <span>Sending...</span>
        `;
    } else {
        button.disabled = false;
        button.classList.remove('loading');
        const originalText = button.getAttribute('data-original-text');
        if (originalText) {
            button.innerHTML = originalText;
        }
    }
};

// ===== Show Form Error Message =====
const showFormError = (message) => {
    // Remove existing error message
    const existingError = document.querySelector('.form-error-banner');
    if (existingError) existingError.remove();

    const errorBanner = document.createElement('div');
    errorBanner.className = 'form-error-banner';
    errorBanner.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12" y2="16"/>
        </svg>
        <span>${message}</span>
        <button type="button" class="error-dismiss" aria-label="Dismiss">&times;</button>
    `;

    const form = document.getElementById('contactForm');
    form.insertBefore(errorBanner, form.firstChild);

    // Auto dismiss after 8 seconds
    setTimeout(() => errorBanner.remove(), 8000);

    // Dismiss on click
    errorBanner.querySelector('.error-dismiss').addEventListener('click', () => errorBanner.remove());
};

// ===== Form Validation =====
const validateForm = (form) => {
    let isValid = true;

    // Full Name
    const fullName = document.getElementById('fullName');
    if (!fullName.value.trim()) {
        showFieldError('fullName', 'Please enter your full name');
        isValid = false;
    }

    // Email
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        showFieldError('email', 'Please enter your email address');
        isValid = false;
    } else if (!emailRegex.test(email.value.trim())) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }

    // Phone
    const phone = document.getElementById('phone');
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    const phoneValue = phone.value.replace(/\s/g, '');
    if (!phoneValue) {
        showFieldError('phone', 'Please enter your phone number');
        isValid = false;
    } else if (phoneValue.length < 10) {
        showFieldError('phone', 'Phone number must be at least 10 digits');
        isValid = false;
    }

    // Message Type
    const messageType = document.getElementById('messageType');
    if (!messageType.value) {
        showFieldError('messageType', 'Please select a message type');
        isValid = false;
    }

    // Message
    const message = document.getElementById('message');
    if (!message.value.trim()) {
        showFieldError('message', 'Please enter your message');
        isValid = false;
    } else if (message.value.trim().length < 20) {
        showFieldError('message', 'Message must be at least 20 characters');
        isValid = false;
    }

    return isValid;
};

// ===== Show Field Error =====
const showFieldError = (fieldId, message) => {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(`${fieldId}Error`);

    if (field) field.classList.add('error');
    if (errorEl) errorEl.textContent = message;
};

// ===== Show Error =====
const showError = (elementId, message) => {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.color = '#8b0000';
        setTimeout(() => {
            element.textContent = 'Send to WhatsApp';
            element.style.color = '';
        }, 3000);
    }
};

// ===== Create WhatsApp Message =====
const createWhatsAppMessage = (data) => {
    return `NEW INQUIRY - Preet Cards Website

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Type: ${data.messageType}
Preferred Contact: ${data.contactMethod}

Message:
${data.message}

Sent from: Contact Form`;
};

// ===== Show Success Message =====
const showSuccessMessage = (form) => {
    form.classList.add('submitted');
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.classList.add('visible');
    }

    // Reset form after delay
    setTimeout(() => {
        form.reset();
        form.classList.remove('submitted');
        successMessage?.classList.remove('visible');

        // Reset char count
        const charCount = document.getElementById('charCount');
        if (charCount) {
            charCount.textContent = '0/20 minimum';
            charCount.style.color = 'rgba(245, 241, 231, 0.5)';
        }
    }, 5000);
};

// ===== Rate Limiting =====
const RATE_LIMIT_KEY = 'preet_contact_submissions';
const MAX_SUBMISSIONS = 5;
const TIME_WINDOW = 60 * 60 * 1000; // 1 hour

const checkRateLimit = () => {
    const submissions = getSubmissions();
    const now = Date.now();
    const recentSubmissions = submissions.filter(time => now - time < TIME_WINDOW);
    return recentSubmissions.length < MAX_SUBMISSIONS;
};

const recordSubmission = () => {
    const submissions = getSubmissions();
    submissions.push(Date.now());
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(submissions));
};

const getSubmissions = () => {
    try {
        const data = localStorage.getItem(RATE_LIMIT_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

// ===== FAQ Accordion =====
const initFaqAccordion = () => {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('open');
                    otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current item
            item.classList.toggle('open');
            question.setAttribute('aria-expanded', !isOpen);
        });
    });
};

// ===== Scroll Animations =====
const initScrollAnimations = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
};

// ===== Navbar Scroll Effect =====
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});
