/**
 * Testimonials Carousel
 * Auto-play, touch/swipe, keyboard navigation, responsive
 */

(function () {
    'use strict';

    // Testimonials data
    const testimonials = [
        {
            name: "Priya Shah",
            photo: "https://ui-avatars.com/api/?name=Priya+Shah&background=D4AF37&color=fff&size=80",
            rating: 5,
            text: "Best wedding cards in Vadodara! Beautiful designs and quick delivery."
        },
        {
            name: "Rahul Patel",
            photo: "https://ui-avatars.com/api/?name=Rahul+Patel&background=C41E3A&color=fff&size=80",
            rating: 5,
            text: "Excellent service and affordable prices. Highly recommended!"
        },
        {
            name: "Neha Desai",
            photo: "https://ui-avatars.com/api/?name=Neha+Desai&background=D4AF37&color=fff&size=80",
            rating: 5,
            text: "They customized our cards exactly as we wanted. Very professional!"
        },
        {
            name: "Amit Modi",
            photo: "https://ui-avatars.com/api/?name=Amit+Modi&background=800020&color=fff&size=80",
            rating: 5,
            text: "Amazing quality cards at reasonable prices. Will order again!"
        },
        {
            name: "Kavita Joshi",
            photo: "https://ui-avatars.com/api/?name=Kavita+Joshi&background=D4AF37&color=fff&size=80",
            rating: 5,
            text: "Our guests loved the invitation cards. Thank you Preet Cards!"
        }
    ];

    let currentSlide = 0;
    let autoPlayInterval = null;
    let touchStartX = 0;
    let touchEndX = 0;

    function init() {
        const container = document.getElementById('testimonials-carousel');
        if (!container) return;

        renderCarousel(container);
        setupEventListeners();
        startAutoPlay();
    }

    function renderCarousel(container) {
        const slidesPerView = window.innerWidth >= 768 ? 3 : 1;

        container.innerHTML = `
            <div class="testimonials-wrapper">
                <button class="carousel-arrow carousel-prev" aria-label="Previous testimonial">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
                
                <div class="testimonials-track" id="testimonials-track">
                    ${testimonials.map((t, i) => `
                        <div class="testimonial-card" data-index="${i}">
                            <div class="testimonial-header">
                                <img src="${t.photo}" alt="${t.name}" class="testimonial-photo" loading="lazy">
                                <div class="testimonial-info">
                                    <h4 class="testimonial-name">${t.name}</h4>
                                    <div class="testimonial-rating">
                                        ${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}
                                    </div>
                                </div>
                            </div>
                            <blockquote class="testimonial-text">"${t.text}"</blockquote>
                        </div>
                    `).join('')}
                </div>
                
                <button class="carousel-arrow carousel-next" aria-label="Next testimonial">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            </div>
            
            <div class="carousel-dots" id="carousel-dots">
                ${Array(Math.ceil(testimonials.length / slidesPerView)).fill(0).map((_, i) => `
                    <button class="carousel-dot ${i === 0 ? 'active' : ''}" data-slide="${i}" aria-label="Go to slide ${i + 1}"></button>
                `).join('')}
            </div>
        `;

        updateSlidePosition();
    }

    function updateSlidePosition() {
        const track = document.getElementById('testimonials-track');
        if (!track) return;

        const slidesPerView = window.innerWidth >= 768 ? 3 : 1;
        const slideWidth = 100 / slidesPerView;
        const offset = currentSlide * slideWidth;

        track.style.transform = `translateX(-${offset}%)`;

        // Update dots
        document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === Math.floor(currentSlide / slidesPerView));
        });
    }

    function nextSlide() {
        const slidesPerView = window.innerWidth >= 768 ? 3 : 1;
        const maxSlide = testimonials.length - slidesPerView;
        currentSlide = currentSlide >= maxSlide ? 0 : currentSlide + 1;
        updateSlidePosition();
    }

    function prevSlide() {
        const slidesPerView = window.innerWidth >= 768 ? 3 : 1;
        const maxSlide = testimonials.length - slidesPerView;
        currentSlide = currentSlide <= 0 ? maxSlide : currentSlide - 1;
        updateSlidePosition();
    }

    function goToSlide(index) {
        const slidesPerView = window.innerWidth >= 768 ? 3 : 1;
        currentSlide = index * slidesPerView;
        updateSlidePosition();
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function pauseAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    function setupEventListeners() {
        const container = document.getElementById('testimonials-carousel');
        if (!container) return;

        // Arrow buttons
        container.querySelector('.carousel-prev')?.addEventListener('click', () => {
            prevSlide();
            pauseAutoPlay();
            startAutoPlay();
        });

        container.querySelector('.carousel-next')?.addEventListener('click', () => {
            nextSlide();
            pauseAutoPlay();
            startAutoPlay();
        });

        // Dots
        container.querySelectorAll('.carousel-dot').forEach(dot => {
            dot.addEventListener('click', (e) => {
                goToSlide(parseInt(e.target.dataset.slide));
                pauseAutoPlay();
                startAutoPlay();
            });
        });

        // Pause on hover
        container.addEventListener('mouseenter', pauseAutoPlay);
        container.addEventListener('mouseleave', startAutoPlay);

        // Touch/swipe support
        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!container.matches(':hover')) return;
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        });

        // Resize handler
        window.addEventListener('resize', () => {
            renderCarousel(container);
        });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            pauseAutoPlay();
            startAutoPlay();
        }
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
