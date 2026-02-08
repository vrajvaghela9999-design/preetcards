/* ========================================
   PREET CARDS - JavaScript
   3D Animations & Interactivity
   ======================================== */

import './style.css';

// Gallery image configuration
const TOTAL_IMAGES = 9;
const IMAGES_PER_LOAD = 9;
let currentLoadedImages = 0;
let currentLightboxIndex = 0;

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollAnimations();
    initHeroCardEffect();
    initDynamicGallery();
    initLightbox();
    initFormValidation();
    initSmoothScroll();
    initParallaxEffects();
});

/* ========== Hero Card 3D Effect ========== */
function initHeroCardEffect() {
    const heroCard = document.getElementById('heroCard3D');
    if (!heroCard) return;

    heroCard.addEventListener('mousemove', (e) => {
        const rect = heroCard.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        heroCard.style.transform = `
            rotateY(${x * 30}deg)
            rotateX(${-y * 20}deg)
            translateZ(30px)
            scale(1.05)
        `;
    });

    heroCard.addEventListener('mouseleave', () => {
        heroCard.style.transform = '';
    });
}

/* ========== Dynamic Gallery ========== */
function initDynamicGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    if (!galleryGrid) return;

    // Load initial batch
    loadGalleryImages(IMAGES_PER_LOAD);

    // Load more button
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            loadGalleryImages(IMAGES_PER_LOAD);
        });
    }
}

function loadGalleryImages(count) {
    const galleryGrid = document.getElementById('galleryGrid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    if (!galleryGrid) return;

    const startIndex = currentLoadedImages + 1;
    const endIndex = Math.min(currentLoadedImages + count, TOTAL_IMAGES);

    for (let i = startIndex; i <= endIndex; i++) {
        const cardTitle = extractCardTitle(i);
        const altText = `Preet Cards - ${cardTitle} Wedding Invitation`;
        const cardHtml = `
            <div class="gallery-item animate-on-scroll" data-index="${i}">
                <img src="./images/card-${i}.jpg" alt="${altText}" loading="lazy">
                <div class="gallery-overlay">
                    <h4>${cardTitle}</h4>
                    <p>Premium Wedding Card</p>
                </div>
            </div>
        `;
        galleryGrid.insertAdjacentHTML('beforeend', cardHtml);
    }

    currentLoadedImages = endIndex;

    // Hide load more button if all images loaded
    if (loadMoreBtn && currentLoadedImages >= TOTAL_IMAGES) {
        loadMoreBtn.style.display = 'none';
    }

    // Re-initialize scroll animations for new items
    initScrollAnimationsForNewItems();

    // Add click handlers for lightbox
    attachGalleryClickHandlers();
}

function extractCardTitle(index) {
    // Card titles matching the AI-generated designs
    const cardTitles = {
        1: 'Lagna Kankotri',
        2: 'Sangeet Ceremony',
        3: 'Vintage Laser-Cut',
        4: 'Modern Minimalist',
        5: 'Royal Boxed',
        6: 'Engagement Aamantran',
        7: 'Reception Card',
        8: 'Gujarati Traditional',
        9: 'Acrylic Fusion'
    };
    return cardTitles[index] || 'Premium Card #' + index;
}

function initScrollAnimationsForNewItems() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.gallery-item:not(.observed)').forEach(el => {
        el.classList.add('observed');
        observer.observe(el);
    });
}

/* ========== Lightbox ========== */
function initLightbox() {
    const modal = document.getElementById('lightboxModal');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    const backdrop = modal?.querySelector('.lightbox-backdrop');

    if (!modal) return;

    // Close button
    closeBtn?.addEventListener('click', closeLightbox);
    backdrop?.addEventListener('click', closeLightbox);

    // Navigation
    prevBtn?.addEventListener('click', () => navigateLightbox(-1));
    nextBtn?.addEventListener('click', () => navigateLightbox(1));

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                navigateLightbox(-1);
                break;
            case 'ArrowRight':
                navigateLightbox(1);
                break;
        }
    });
}

function attachGalleryClickHandlers() {
    document.querySelectorAll('.gallery-item').forEach(item => {
        if (item.hasAttribute('data-lightbox-attached')) return;
        item.setAttribute('data-lightbox-attached', 'true');

        item.addEventListener('click', () => {
            const index = parseInt(item.getAttribute('data-index'));
            openLightbox(index);
        });
    });
}

function openLightbox(index) {
    const modal = document.getElementById('lightboxModal');
    const image = document.getElementById('lightboxImage');
    const title = document.getElementById('lightboxTitle');
    const desc = document.getElementById('lightboxDesc');

    if (!modal || !image) return;

    currentLightboxIndex = index;

    const cardTitle = extractCardTitle(index);
    const altText = `Preet Cards - ${cardTitle} Wedding Invitation`;

    image.src = `./images/card-${index}.jpg`;
    image.alt = altText;
    if (title) title.textContent = cardTitle;
    if (desc) desc.textContent = 'Premium Wedding Invitation Card';

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const modal = document.getElementById('lightboxModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function navigateLightbox(direction) {
    let newIndex = currentLightboxIndex + direction;

    // Wrap around
    if (newIndex < 1) newIndex = TOTAL_IMAGES;
    if (newIndex > TOTAL_IMAGES) newIndex = 1;

    openLightbox(newIndex);
}


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
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Animate stats numbers
                if (entry.target.classList.contains('story-stats')) {
                    animateStats();
                }
            }
        });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

/* ========== Stats Animation ========== */
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');

    stats.forEach(stat => {
        const target = stat.getAttribute('data-count');
        if (!target) return;

        const numericTarget = parseInt(target.replace(/[^0-9]/g, ''));
        const suffix = target.replace(/[0-9]/g, '');
        const duration = 2000;
        const increment = numericTarget / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < numericTarget) {
                stat.textContent = Math.floor(current) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target;
            }
        };

        updateCounter();
    });
}

/* ========== 3D Card Effects ========== */
function init3DCardEffects() {
    const cards = document.querySelectorAll('.card-3d');
    const scene = document.querySelector('.card-scene');

    if (!scene) return;

    // Mouse move parallax effect on card scene
    scene.addEventListener('mousemove', (e) => {
        const rect = scene.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        cards.forEach((card, index) => {
            const rotateX = y * 20;
            const rotateY = x * 20;
            const depth = (index + 1) * 10;

            card.style.transform = `
        translateZ(${depth}px)
        rotateX(${-rotateX}deg)
        rotateY(${rotateY}deg)
      `;
        });
    });

    scene.addEventListener('mouseleave', () => {
        cards.forEach((card, index) => {
            card.style.transform = '';
        });
    });

    // Collection card tilt effect
    const tiltCards = document.querySelectorAll('[data-tilt]');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            card.style.transform = `
        perspective(1000px)
        translateY(-10px)
        rotateX(${-y * 10}deg)
        rotateY(${x * 10}deg)
      `;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

/* ========== Form Validation ========== */
function initFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Basic validation
        const errors = [];

        if (!data.name || data.name.trim().length < 2) {
            errors.push('Please enter your full name');
        }

        if (!data.email || !isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }

        if (errors.length > 0) {
            showFormMessage(errors.join('\n'), 'error');
            return;
        }

        // Simulate form submission
        const button = form.querySelector('button[type="submit"]');
        const originalText = button.innerHTML;
        button.innerHTML = '<span>Sending...</span>';
        button.disabled = true;

        setTimeout(() => {
            showFormMessage('Thank you for your inquiry! We will contact you within 24 hours.', 'success');
            form.reset();
            button.innerHTML = originalText;
            button.disabled = false;
        }, 1500);
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-message-${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    animation: fadeIn 0.3s ease;
    ${type === 'success'
            ? 'background: rgba(37, 211, 102, 0.1); color: #25D366; border: 1px solid rgba(37, 211, 102, 0.3);'
            : 'background: rgba(220, 53, 69, 0.1); color: #dc3545; border: 1px solid rgba(220, 53, 69, 0.3);'
        }
  `;

    const form = document.getElementById('contactForm');
    form.insertBefore(messageEl, form.firstChild);

    // Auto remove after 5 seconds
    setTimeout(() => {
        messageEl.style.opacity = '0';
        setTimeout(() => messageEl.remove(), 300);
    }, 5000);
}

/* ========== Smooth Scroll ========== */
function initSmoothScroll() {
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
}

/* ========== Parallax Effects ========== */
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.hero-deco, .peacock-feather, .rangoli-pattern');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        parallaxElements.forEach((el, index) => {
            const speed = 0.1 + (index * 0.05);
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Hero parallax
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');

    if (hero && heroContent) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroHeight = hero.offsetHeight;

            if (scrolled < heroHeight) {
                const opacity = 1 - (scrolled / heroHeight);
                const translateY = scrolled * 0.3;

                heroContent.style.opacity = opacity;
                heroContent.style.transform = `translateY(${translateY}px)`;
            }
        });
    }
}

/* ========== Gallery Lightbox ========== */
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            // Create lightbox
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
        <div class="lightbox-overlay"></div>
        <div class="lightbox-content">
          <button class="lightbox-close">&times;</button>
          <div class="lightbox-image">
            ${item.querySelector('.gallery-placeholder').outerHTML}
          </div>
          <div class="lightbox-info">
            <h4>${item.querySelector('h4')?.textContent || ''}</h4>
            <p>${item.querySelector('.gallery-overlay p')?.textContent || ''}</p>
          </div>
        </div>
      `;

            lightbox.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 2000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
      `;

            document.body.appendChild(lightbox);
            document.body.style.overflow = 'hidden';

            // Close lightbox
            const closeLightbox = () => {
                lightbox.style.opacity = '0';
                setTimeout(() => {
                    lightbox.remove();
                    document.body.style.overflow = '';
                }, 300);
            };

            lightbox.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);
            lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') closeLightbox();
            }, { once: true });
        });
    });
}

// Add CSS animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .lightbox-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.9);
  }
  
  .lightbox-content {
    position: relative;
    max-width: 800px;
    max-height: 80vh;
    background: #1A0505;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid rgba(212, 175, 55, 0.3);
  }
  
  .lightbox-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    color: #D4AF37;
    font-size: 2rem;
    cursor: pointer;
    z-index: 1;
  }
  
  .lightbox-image {
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(145deg, rgba(212, 175, 55, 0.1) 0%, rgba(139, 0, 0, 0.3) 100%);
  }
  
  .lightbox-info {
    padding: 1.5rem;
    text-align: center;
  }
  
  .lightbox-info h4 {
    color: #FFF8E7;
    margin-bottom: 0.5rem;
  }
  
  .lightbox-info p {
    color: #D4AF37;
  }
`;
document.head.appendChild(style);
