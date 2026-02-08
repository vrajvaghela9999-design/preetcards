/**
 * Preet Cards - Google Analytics Event Tracking
 * Tracks all important user interactions for conversion optimization
 * GA Property: G-S0MLM0KLPL
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Ensure gtag is available
    if (typeof gtag !== 'function') {
        console.warn('GA: gtag not loaded yet');
        return;
    }

    console.log('✅ Preet Cards GA Event Tracking Initialized');

    // ===========================================
    // 1. WHATSAPP BUTTON CLICKS (Primary CTA)
    // ===========================================
    const whatsappSelectors = [
        '.whatsapp-btn',
        '.whatsapp-float',
        'a[href*="wa.me"]',
        'a[href*="whatsapp"]',
        '.cta-whatsapp',
        '[class*="whatsapp"]'
    ];
    
    document.querySelectorAll(whatsappSelectors.join(', ')).forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            gtag('event', 'whatsapp_click', {
                'event_category': 'conversion',
                'event_label': document.title,
                'value': 5000
            });
            console.log('GA: WhatsApp click tracked');
        });
    });

    // ===========================================
    // 2. PHONE NUMBER CLICKS
    // ===========================================
    document.querySelectorAll('a[href^="tel:"]').forEach(function(link) {
        link.addEventListener('click', function() {
            const phoneNumber = this.getAttribute('href').replace('tel:', '');
            gtag('event', 'phone_click', {
                'event_category': 'conversion',
                'event_label': phoneNumber,
                'value': 3000
            });
            console.log('GA: Phone click tracked - ' + phoneNumber);
        });
    });

    // ===========================================
    // 3. EMAIL CLICKS
    // ===========================================
    document.querySelectorAll('a[href^="mailto:"]').forEach(function(link) {
        link.addEventListener('click', function() {
            gtag('event', 'email_click', {
                'event_category': 'conversion',
                'event_label': 'Email inquiry',
                'value': 2000
            });
            console.log('GA: Email click tracked');
        });
    });

    // ===========================================
    // 4. CTA BUTTON CLICKS
    // ===========================================
    const ctaSelectors = [
        '.cta-btn',
        '.cta-button',
        '.book-consultation',
        '.explore-btn',
        '.hero-cta',
        'button[class*="cta"]',
        'a[class*="cta"]'
    ];
    
    document.querySelectorAll(ctaSelectors.join(', ')).forEach(function(btn) {
        btn.addEventListener('click', function() {
            const btnText = this.textContent.trim().substring(0, 50);
            gtag('event', 'cta_click', {
                'event_category': 'engagement',
                'event_label': btnText,
                'value': 1000
            });
            console.log('GA: CTA click tracked - ' + btnText);
        });
    });

    // ===========================================
    // 5. PRODUCT CATEGORY PAGE VIEWS
    // ===========================================
    const productPages = {
        'lagna-kankotri': 'Lagna Kankotri',
        'aamantran-cards': 'Aamantran Cards',
        'mundan-cards': 'Mundan Cards',
        'custom-design': 'Custom Design',
        'contact': 'Contact Page'
    };
    
    const currentPath = window.location.pathname.toLowerCase();
    
    for (const [slug, name] of Object.entries(productPages)) {
        if (currentPath.includes(slug)) {
            gtag('event', 'page_view_category', {
                'event_category': 'navigation',
                'event_label': name,
                'value': 500
            });
            console.log('GA: Category page view - ' + name);
            break;
        }
    }

    // ===========================================
    // 6. SCROLL DEPTH TRACKING
    // ===========================================
    let scrollMilestones = { 25: false, 50: false, 75: false, 100: false };
    
    function trackScroll() {
        const scrollPercent = Math.round(
            (window.scrollY + window.innerHeight) / 
            document.documentElement.scrollHeight * 100
        );
        
        for (const milestone of [25, 50, 75, 100]) {
            if (scrollPercent >= milestone && !scrollMilestones[milestone]) {
                scrollMilestones[milestone] = true;
                gtag('event', 'scroll_depth', {
                    'event_category': 'engagement',
                    'event_label': milestone + '% scrolled',
                    'value': milestone
                });
                console.log('GA: Scroll depth - ' + milestone + '%');
            }
        }
    }
    
    // Throttle scroll tracking
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) return;
        scrollTimeout = setTimeout(function() {
            trackScroll();
            scrollTimeout = null;
        }, 200);
    });

    // ===========================================
    // 7. TIME ON PAGE (Engagement)
    // ===========================================
    const startTime = Date.now();
    let engagementTracked = { 30: false, 60: false, 120: false };
    
    setInterval(function() {
        const secondsOnPage = Math.round((Date.now() - startTime) / 1000);
        
        for (const seconds of [30, 60, 120]) {
            if (secondsOnPage >= seconds && !engagementTracked[seconds]) {
                engagementTracked[seconds] = true;
                gtag('event', 'engaged_time', {
                    'event_category': 'engagement',
                    'event_label': seconds + ' seconds on page',
                    'value': seconds
                });
                console.log('GA: Time engagement - ' + seconds + 's');
            }
        }
    }, 5000);

    // ===========================================
    // 8. NAVIGATION MENU CLICKS
    // ===========================================
    document.querySelectorAll('nav a, .nav-link, .nav-menu a').forEach(function(link) {
        link.addEventListener('click', function() {
            const linkText = this.textContent.trim().substring(0, 30);
            const linkHref = this.getAttribute('href');
            gtag('event', 'navigation_click', {
                'event_category': 'navigation',
                'event_label': linkText + ' -> ' + linkHref
            });
        });
    });

    // ===========================================
    // 9. FORM INTERACTIONS
    // ===========================================
    document.querySelectorAll('form').forEach(function(form) {
        let formStarted = false;
        let formName = form.id || form.className || 'unnamed-form';
        
        // Track form start
        form.querySelectorAll('input, textarea, select').forEach(function(field) {
            field.addEventListener('focus', function() {
                if (!formStarted) {
                    formStarted = true;
                    gtag('event', 'form_start', {
                        'event_category': 'conversion',
                        'event_label': formName,
                        'value': 4000
                    });
                    console.log('GA: Form started - ' + formName);
                }
            });
        });
        
        // Track form submission
        form.addEventListener('submit', function() {
            gtag('event', 'form_submit', {
                'event_category': 'conversion',
                'event_label': formName,
                'value': 10000
            });
            console.log('GA: Form submitted - ' + formName);
        });
    });

    // ===========================================
    // 10. CARD/PRODUCT CLICKS
    // ===========================================
    const cardSelectors = [
        '.card-item',
        '.product-card',
        '.gallery-item',
        '.collection-card',
        '[class*="card-"]'
    ];
    
    document.querySelectorAll(cardSelectors.join(', ')).forEach(function(card) {
        card.addEventListener('click', function() {
            const cardName = this.querySelector('h3, h4, .card-title')?.textContent?.trim() || 'unknown';
            gtag('event', 'product_click', {
                'event_category': 'engagement',
                'event_label': cardName.substring(0, 50),
                'value': 500
            });
            console.log('GA: Product click - ' + cardName);
        });
    });

    // ===========================================
    // 11. OUTBOUND LINK CLICKS
    // ===========================================
    document.querySelectorAll('a[href^="http"]').forEach(function(link) {
        if (!link.href.includes(window.location.hostname)) {
            link.addEventListener('click', function() {
                gtag('event', 'outbound_click', {
                    'event_category': 'outbound',
                    'event_label': this.href,
                    'transport_type': 'beacon'
                });
            });
        }
    });

    // ===========================================
    // 12. PAGE VISIBILITY (Tab switches)
    // ===========================================
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'hidden') {
            const timeOnPage = Math.round((Date.now() - startTime) / 1000);
            gtag('event', 'page_hidden', {
                'event_category': 'engagement',
                'event_label': 'Total time: ' + timeOnPage + 's',
                'value': timeOnPage,
                'transport_type': 'beacon'
            });
        }
    });

});
