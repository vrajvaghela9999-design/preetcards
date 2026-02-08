/**
 * Page Loading Animation
 * Shows overlay until page fully loads, minimum 500ms display
 */

(function () {
    'use strict';

    const MIN_DISPLAY_TIME = 500;
    const FADE_DURATION = 1000;
    let loaderElement = null;
    let startTime = Date.now();

    // Create loader element immediately
    function createLoader() {
        loaderElement = document.createElement('div');
        loaderElement.className = 'page-loader';
        loaderElement.innerHTML = `
            <div class="loader-logo">Preet Cards</div>
            <div class="loader-spinner"></div>
            <div class="loader-text">Loading</div>
        `;
        document.body.insertBefore(loaderElement, document.body.firstChild);
    }

    // Hide loader with fade effect
    function hideLoader() {
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, MIN_DISPLAY_TIME - elapsed);

        setTimeout(() => {
            if (loaderElement) {
                loaderElement.classList.add('fade-out');
                setTimeout(() => {
                    loaderElement.remove();
                    document.body.style.overflow = '';
                }, FADE_DURATION);
            }
        }, remainingTime);
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createLoader);
    } else {
        createLoader();
    }

    // Hide on full page load
    window.addEventListener('load', hideLoader);

    // Fallback - hide after 5 seconds max
    setTimeout(hideLoader, 5000);
})();
