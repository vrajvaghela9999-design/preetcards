/**
 * GLOBAL TRANSITIONS & EFFECTS
 * View Transitions, Loading, Lazy Loading, Accessibility
 */

// ===== Loading Screen =====
const initLoadingScreen = () => {
    const loadingScreen = document.querySelector('.loading-screen');
    if (!loadingScreen) return;

    const progressBar = loadingScreen.querySelector('.progress-bar');
    let progress = 0;

    // Simulate loading progress
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);

            // Hide loading screen with zoom effect
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                // Remove from DOM after transition
                setTimeout(() => {
                    loadingScreen.remove();
                }, 600);
            }, 400);
        }
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }, 100);

    // Also hide when fully loaded
    window.addEventListener('load', () => {
        if (!loadingScreen.classList.contains('hidden')) {
            progress = 100;
            if (progressBar) progressBar.style.width = '100%';
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                setTimeout(() => loadingScreen.remove(), 600);
            }, 300);
        }
    });
};

// ===== View Transitions API =====
const initViewTransitions = () => {
    // Check if View Transitions API is supported
    if (!document.startViewTransition) {
        console.log('View Transitions API not supported, using fallback');
        initFallbackTransitions();
        return;
    }

    // Intercept all internal navigation links
    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');

        // Skip external links, hash links, and special links
        if (!href ||
            href.startsWith('http') ||
            href.startsWith('#') ||
            href.startsWith('mailto:') ||
            href.startsWith('tel:') ||
            href.startsWith('javascript:') ||
            link.target === '_blank' ||
            href.includes('wa.me')) {
            return;
        }

        link.addEventListener('click', (e) => {
            // Don't handle if reduce motion is active
            if (document.body.classList.contains('reduce-motion')) {
                return;
            }

            e.preventDefault();

            // Start view transition
            document.startViewTransition(() => {
                window.location.href = href;
            });
        });
    });
};

// ===== Fallback Transitions (for Safari) =====
const initFallbackTransitions = () => {
    // Check if GSAP is available
    const hasGSAP = typeof gsap !== 'undefined';

    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');

        if (!href ||
            href.startsWith('http') ||
            href.startsWith('#') ||
            href.startsWith('mailto:') ||
            href.startsWith('tel:') ||
            href.startsWith('javascript:') ||
            link.target === '_blank' ||
            href.includes('wa.me')) {
            return;
        }

        link.addEventListener('click', (e) => {
            if (document.body.classList.contains('reduce-motion')) {
                return;
            }

            e.preventDefault();

            // Create overlay for transition
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                inset: 0;
                background: #1A0505;
                z-index: 99999;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(overlay);

            // Fade out current page
            if (hasGSAP) {
                gsap.to(document.body, {
                    scale: 0.95,
                    opacity: 0,
                    duration: 0.3,
                    ease: 'power2.in',
                    onComplete: () => {
                        window.location.href = href;
                    }
                });
            } else {
                document.body.style.transition = 'all 0.3s ease';
                document.body.style.transform = 'scale(0.95)';
                document.body.style.opacity = '0';
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            }
        });
    });
};

// ===== Lazy Load Animations =====
const initLazyAnimations = () => {
    const lazyElements = document.querySelectorAll('.lazy-animate, .lazy-animate-scale, .animate-on-scroll');

    if (!lazyElements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');

                // Trigger GSAP animation if available
                if (typeof gsap !== 'undefined' && entry.target.classList.contains('animate-on-scroll')) {
                    gsap.fromTo(entry.target,
                        { y: 30, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
                    );
                }

                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    lazyElements.forEach(el => observer.observe(el));
};

// ===== Reduce Motion Toggle =====
const initReduceMotionToggle = () => {
    const toggle = document.querySelector('.reduce-motion-toggle');
    if (!toggle) return;

    // Check saved preference
    const savedPref = localStorage.getItem('reduceMotion');
    if (savedPref === 'true') {
        document.body.classList.add('reduce-motion');
        toggle.classList.add('active');
    }

    // Check system preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        document.body.classList.add('reduce-motion');
        toggle.classList.add('active');
    }

    toggle.addEventListener('click', () => {
        const isActive = document.body.classList.toggle('reduce-motion');
        toggle.classList.toggle('active', isActive);
        localStorage.setItem('reduceMotion', isActive);
    });
};

// ===== 3D WhatsApp Button =====
const initWhatsAppButton = () => {
    const whatsappBtn = document.querySelector('.whatsapp-3d');
    if (!whatsappBtn) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    // Smooth scroll-follow effect
    const updatePosition = () => {
        const scrollDelta = window.scrollY - lastScrollY;

        // Add subtle movement based on scroll direction
        if (typeof gsap !== 'undefined') {
            gsap.to(whatsappBtn, {
                y: scrollDelta * 0.1,
                duration: 0.3,
                ease: 'power2.out',
                onComplete: () => {
                    gsap.to(whatsappBtn, {
                        y: 0,
                        duration: 0.5,
                        ease: 'elastic.out(1, 0.5)'
                    });
                }
            });
        }

        lastScrollY = window.scrollY;
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking && !document.body.classList.contains('reduce-motion')) {
            requestAnimationFrame(updatePosition);
            ticking = true;
        }
    });
};

// ===== 3D Footer Phone Button =====
const initPhoneButton = () => {
    const phoneBtn = document.querySelector('.phone-btn-3d');
    if (!phoneBtn) return;

    phoneBtn.addEventListener('mousedown', () => {
        phoneBtn.style.transform = 'translateY(4px)';
    });

    phoneBtn.addEventListener('mouseup', () => {
        phoneBtn.style.transform = 'translateY(-4px)';
    });

    phoneBtn.addEventListener('mouseleave', () => {
        phoneBtn.style.transform = '';
    });
};

// ===== 3D Social Icon Flip =====
const initSocialFlip = () => {
    // Already handled by CSS, but add click tracking
    document.querySelectorAll('.social-3d-link').forEach(link => {
        link.addEventListener('click', function (e) {
            // Track social clicks (analytics)
            const platform = this.getAttribute('aria-label');
            console.log(`Social click: ${platform}`);
        });
    });
};

// ===== Mobile Optimizations =====
const optimizeForMobile = () => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    if (isMobile) {
        // Reduce animation complexity
        document.body.classList.add('mobile-optimized');

        // Disable heavy 3D transforms
        document.querySelectorAll('[style*="perspective"]').forEach(el => {
            el.style.perspective = 'none';
        });
    }
};

// ===== Initialize All =====
const initTransitions = () => {
    // Initialize loading screen first
    initLoadingScreen();

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initViewTransitions();
            initLazyAnimations();
            initReduceMotionToggle();
            initWhatsAppButton();
            initPhoneButton();
            initSocialFlip();
            optimizeForMobile();
        });
    } else {
        initViewTransitions();
        initLazyAnimations();
        initReduceMotionToggle();
        initWhatsAppButton();
        initPhoneButton();
        initSocialFlip();
        optimizeForMobile();
    }
};

// Auto-initialize
initTransitions();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initTransitions };
}
