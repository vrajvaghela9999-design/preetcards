/**
 * Google Analytics 4 Tracking
 * Event tracking for Preet Cards website
 * 
 * SETUP INSTRUCTIONS:
 * 1. Replace 'G-S0MLM0KLPL' with your actual GA4 Measurement ID
 * 2. Create a GA4 property at https://analytics.google.com
 * 3. Go to Admin > Data Streams > Web > Create stream
 * 4. Copy the Measurement ID (starts with G-)
 */

// ========== GA4 CONFIGURATION ==========
const GA4_MEASUREMENT_ID = 'G-S0MLM0KLPL'; // Replace with your ID

// ========== GTAG INITIALIZATION ==========
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());

// Configure with consent mode (GDPR compliant)
gtag('consent', 'default', {
    'analytics_storage': 'granted',
    'ad_storage': 'denied'
});

gtag('config', GA4_MEASUREMENT_ID, {
    'page_title': document.title,
    'page_location': window.location.href,
    'send_page_view': true
});

// ========== EVENT TRACKING FUNCTIONS ==========

/**
 * Track WhatsApp button clicks
 */
function trackWhatsAppClick(source = 'floating_button') {
    gtag('event', 'whatsapp_click', {
        'event_category': 'engagement',
        'event_label': source,
        'value': 1
    });
}

/**
 * Track contact form submissions
 */
function trackFormSubmit(formType = 'contact') {
    gtag('event', 'form_submit', {
        'event_category': 'conversion',
        'event_label': formType,
        'value': 1
    });
}

/**
 * Track phone/call clicks
 */
function trackPhoneClick() {
    gtag('event', 'phone_click', {
        'event_category': 'engagement',
        'event_label': 'click_to_call',
        'value': 1
    });
}

/**
 * Track product page views
 */
function trackProductView(productType) {
    gtag('event', 'product_view', {
        'event_category': 'browse',
        'event_label': productType,
        'value': 1
    });
}

/**
 * Track scroll depth
 */
function initScrollTracking() {
    const thresholds = [25, 50, 75, 100];
    const tracked = {};

    window.addEventListener('scroll', () => {
        const scrollPercent = Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );

        thresholds.forEach(threshold => {
            if (scrollPercent >= threshold && !tracked[threshold]) {
                tracked[threshold] = true;
                gtag('event', 'page_scroll', {
                    'event_category': 'engagement',
                    'event_label': `${threshold}%`,
                    'value': threshold
                });
            }
        });
    }, { passive: true });
}

/**
 * Track outbound links
 */
function initOutboundLinkTracking() {
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.href;
        if (href && !href.includes(window.location.hostname)) {
            gtag('event', 'outbound_link', {
                'event_category': 'navigation',
                'event_label': href,
                'transport_type': 'beacon'
            });
        }
    });
}

// ========== AUTO-ATTACH EVENT LISTENERS ==========

function initEventTracking() {
    // Track WhatsApp button clicks
    document.querySelectorAll('a[href*="wa.me"], .whatsapp-btn').forEach(btn => {
        btn.addEventListener('click', () => trackWhatsAppClick());
    });

    // Track phone clicks
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', trackPhoneClick);
    });

    // Track form submissions
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', () => trackFormSubmit(form.id || 'unknown'));
    });

    // Track product page views
    const productPages = {
        'aamantran-cards.html': 'aamantran',
        'mundan-cards.html': 'mundan',
        'lagna-kankotri.html': 'lagna_kankotri',
        'custom-design.html': 'custom_design'
    };

    const currentPage = window.location.pathname.split('/').pop();
    if (productPages[currentPage]) {
        trackProductView(productPages[currentPage]);
    }

    // Initialize scroll tracking
    initScrollTracking();

    // Initialize outbound link tracking
    initOutboundLinkTracking();
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEventTracking);
} else {
    initEventTracking();
}

// ========== COOKIE CONSENT (PLACEHOLDER) ==========
// Implement your own cookie consent solution
// Example: https://cookieconsent.orestbida.com/

/*
function updateConsent(granted) {
    gtag('consent', 'update', {
        'analytics_storage': granted ? 'granted' : 'denied'
    });
}
*/
