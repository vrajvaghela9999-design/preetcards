/* ========================================
   CUSTOM DESIGN - JavaScript
   Form handling & Animations
   ======================================== */

import './style.css';
import './custom-design.css';

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollAnimations();
    initFileUpload();
    initFormSubmit();
});

/* ========== Navigation ========== */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* ========== Scroll Animations ========== */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const delay = entry.target.classList.contains('delay-1') ? 200 :
                    entry.target.classList.contains('delay-2') ? 400 :
                        entry.target.classList.contains('delay-3') ? 600 : 0;

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

/* ========== File Upload ========== */
function initFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('referenceFiles');
    const fileList = document.getElementById('fileList');
    let uploadedFiles = [];

    if (!uploadArea || !fileInput) return;

    // Drag and drop events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.classList.add('dragover');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.classList.remove('dragover');
        });
    });

    uploadArea.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        handleFiles(files);
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    function handleFiles(files) {
        [...files].forEach(file => {
            if (file.type.startsWith('image/') || file.type === 'application/pdf') {
                uploadedFiles.push(file);
                displayFile(file);
            }
        });
    }

    function displayFile(file) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <span>📎 ${file.name}</span>
            <button type="button" data-name="${file.name}">✕</button>
        `;

        fileItem.querySelector('button').addEventListener('click', () => {
            uploadedFiles = uploadedFiles.filter(f => f.name !== file.name);
            fileItem.remove();
        });

        fileList.appendChild(fileItem);
    }
}

/* ========== Form Submit ========== */
function initFormSubmit() {
    const form = document.getElementById('designForm');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Collect form data
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Build WhatsApp message
        const message = `Hi! I want to request a custom design.

*Name:* ${data.name}
*Event Type:* ${data.eventType}
*Event Date:* ${data.eventDate}
*Cards Needed:* ${data.guestCount}
*Color Preference:* ${data.colorPreference || 'Not specified'}
*Design Description:* ${data.designDescription || 'Not specified'}

Please help me create a custom invitation card!`;

        // Open WhatsApp
        const whatsappUrl = `https://wa.me/919824319135?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });
}

/* ========== Smooth Scroll ========== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});
