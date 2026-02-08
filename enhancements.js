/**
 * Enhanced Lazy Loading with Blur Placeholder & Fade-in Effect
 * Intersection Observer with fallback for older browsers
 */

(function () {
    'use strict';

    // Configuration
    const config = {
        rootMargin: '50px 0px',
        threshold: 0.1,
        fadeInDuration: 500,
        placeholderColor: 'rgba(212, 175, 55, 0.1)'
    };

    // Check for native lazy loading support
    const supportsNativeLazy = 'loading' in HTMLImageElement.prototype;

    // Initialize lazy loading
    function init() {
        const lazyImages = document.querySelectorAll('img[data-src], img[loading="lazy"]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver(handleIntersection, {
                rootMargin: config.rootMargin,
                threshold: config.threshold
            });

            lazyImages.forEach(img => {
                addPlaceholder(img);
                imageObserver.observe(img);
            });
        } else {
            // Fallback for older browsers
            lazyImages.forEach(loadImage);
        }
    }

    // Add blur placeholder effect
    function addPlaceholder(img) {
        if (img.complete && img.naturalHeight !== 0) return;

        img.style.backgroundColor = config.placeholderColor;
        img.style.filter = 'blur(10px)';
        img.style.transition = `filter ${config.fadeInDuration}ms ease, opacity ${config.fadeInDuration}ms ease`;
        img.style.opacity = '0.5';
    }

    // Handle intersection observer callback
    function handleIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadImage(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }

    // Load image with fade-in effect
    function loadImage(img) {
        const src = img.dataset.src || img.src;

        if (!src) return;

        // Create temp image to preload
        const tempImg = new Image();

        tempImg.onload = function () {
            if (img.dataset.src) {
                img.src = src;
            }

            // Trigger fade-in
            requestAnimationFrame(() => {
                img.style.filter = 'blur(0)';
                img.style.opacity = '1';
                img.classList.add('loaded');
            });
        };

        tempImg.onerror = function () {
            // Show fallback on error
            img.style.filter = 'blur(0)';
            img.style.opacity = '0.5';
            img.alt = 'Image could not be loaded';
            console.warn('Failed to load image:', src);
        };

        tempImg.src = src;
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

/**
 * Enhanced Mobile Navigation
 * ESC key close, backdrop click, body scroll lock
 */

(function () {
    'use strict';

    function initMobileNav() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        const navLinks = navMenu?.querySelectorAll('a');

        if (!navToggle || !navMenu) return;

        // Create backdrop if doesn't exist
        let backdrop = document.querySelector('.nav-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.className = 'nav-backdrop';
            backdrop.style.cssText = `
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 999;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s ease, visibility 0.3s ease;
            `;
            document.body.appendChild(backdrop);
        }

        // Toggle menu
        function toggleMenu(open) {
            const isOpen = typeof open === 'boolean' ? open : !navMenu.classList.contains('active');

            navToggle.classList.toggle('active', isOpen);
            navMenu.classList.toggle('active', isOpen);

            if (isOpen) {
                backdrop.style.opacity = '1';
                backdrop.style.visibility = 'visible';
                document.body.style.overflow = 'hidden';
            } else {
                backdrop.style.opacity = '0';
                backdrop.style.visibility = 'hidden';
                document.body.style.overflow = '';
            }
        }

        // Close menu function
        function closeMenu() {
            toggleMenu(false);
        }

        // Backdrop click to close
        backdrop.addEventListener('click', closeMenu);

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });

        // Close menu when link clicked
        navLinks?.forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(closeMenu, 150);
            });
        });

        // Prevent scroll when menu open (touch devices)
        navMenu.addEventListener('touchmove', (e) => {
            e.stopPropagation();
        }, { passive: true });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileNav);
    } else {
        initMobileNav();
    }
})();
