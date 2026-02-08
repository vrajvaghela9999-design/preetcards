/**
 * LAGNA KANKOTRI - Advanced 3D Interactions
 * GSAP animations, parallax, mouse tracking, card effects
 */

// ===== Mid-Range Cards from /preet-card-images/ folder =====
// Dynamically generate card filenames (supports up to 120 cards)
// Filename convention: card-001.jpeg to card-120.jpeg (always 3 digits)
const generateCardFilenames = (startNum, endNum) => {
    const filenames = [];
    for (let i = startNum; i <= endNum; i++) {
        // Pad number to 3 digits: 1 -> 001, 10 -> 010, 100 -> 100
        const paddedNum = String(i).padStart(3, '0');
        filenames.push(`card-${paddedNum}.jpeg`);
    }
    return filenames;
};

// Lagna Kankotri cards: card-001 to card-025
const laganKankotariImages = generateCardFilenames(1, 25);

// Generate mid-range cards from Lagna Kankotri images
const generateMidRangeCards = () => {
    return laganKankotariImages.map((filename, index) => {
        // Extract 3-digit code from filename: card-001.jpeg -> 001
        const cardNum = filename.match(/card-(\d{3})\.jpeg/)[1];
        const cardCode = `#${cardNum}`;
        const cardName = `Lagna Design ${parseInt(cardNum)}`;
        return {
            id: 100 + index,
            category: 'lagna',
            name: cardName,
            code: cardCode,
            altText: `Preet Cards - ${cardName} Wedding Invitation`,
            price: 75, // Base mid-range price
            priceRange: '₹65–₹90 per card',
            priceNote: 'Price: ₹65–₹90 per card based on design complexity.',
            material: 'Premium Paper with Custom Options',
            image: `./preet-card-images/${filename}`,
            tier: 'mid'
        };
    });
};

// Note: formatCardName function removed as card names are now generated from sequential filenames

// ===== Combined Card Data =====
// Only Lagna Kankotri cards (001-025) are used for this page
const cardData = generateMidRangeCards();

// ===== Initialize when DOM ready =====
document.addEventListener('DOMContentLoaded', () => {
    initNavToggle();
    createDiyaParticles();
    initParallax();
    initCardGallery();
    initFilterTabs();
    initModalTriggers();
    initScrollAnimations();
    initMouseParallax();
    initHeroImageRotation();
});

// ===== Hero Image Rotation - Auto-cycles through featured designs =====
const heroFeaturedImages = [
    './preet-card-images/card-001.jpeg',
    './preet-card-images/card-002.jpeg',
    './preet-card-images/card-003.jpeg',
    './preet-card-images/card-004.jpeg'
];

const initHeroImageRotation = () => {
    const heroCardImg = document.querySelector('.card-face.front img');
    if (!heroCardImg) return;

    let currentIndex = 0;

    // Auto-rotate every 4 seconds
    setInterval(() => {
        currentIndex = (currentIndex + 1) % heroFeaturedImages.length;

        // Fade transition
        heroCardImg.style.transition = 'opacity 0.5s ease';
        heroCardImg.style.opacity = '0.3';

        setTimeout(() => {
            heroCardImg.src = heroFeaturedImages[currentIndex];
            heroCardImg.alt = `Preet Cards - Lagan Design ${currentIndex + 1} Wedding Invitation`;
            heroCardImg.style.opacity = '1';
        }, 300);
    }, 4000);
};

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

// ===== Create Diya Particles =====
const createDiyaParticles = () => {
    const container = document.getElementById('particles-container');
    if (!container) return;

    const particleCount = 25;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'diya-particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.setProperty('--duration', `${6 + Math.random() * 6}s`);
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particle.style.width = `${4 + Math.random() * 8}px`;
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
};

// ===== Parallax on Scroll =====
const initParallax = () => {
    const layers = document.querySelectorAll('.parallax-layer');
    if (!layers.length) return;

    // Check for GSAP
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        layers.forEach(layer => {
            const speed = parseFloat(layer.dataset.speed) || 0.1;

            gsap.to(layer, {
                y: () => window.innerHeight * speed * 0.5,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.hero-3d',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });
    } else {
        // Fallback parallax
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            layers.forEach(layer => {
                const speed = parseFloat(layer.dataset.speed) || 0.1;
                layer.style.transform = `translateY(${scrollY * speed}px)`;
            });
        });
    }
};

// ===== Card Gallery =====
const initCardGallery = () => {
    const grid = document.getElementById('cards-grid');
    if (!grid) return;

    renderCards(cardData);

    // Cascade animation
    setTimeout(() => {
        const cards = grid.querySelectorAll('.card-item-3d');
        cards.forEach((card, i) => {
            setTimeout(() => {
                card.classList.add('visible');
            }, i * 100);
        });
    }, 300);
};

const renderCards = (cards) => {
    const grid = document.getElementById('cards-grid');
    if (!grid) return;

    // Clear existing (except grid-sizer)
    const sizer = grid.querySelector('.grid-sizer');
    grid.innerHTML = '';
    if (sizer) grid.appendChild(sizer);

    cards.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.className = 'card-item-3d';
        cardEl.dataset.category = card.category;
        cardEl.dataset.tier = card.tier;

        // Generate tier badge text
        const tierBadge = card.tier === 'premium' ? 'Premium' :
            card.tier === 'mid' ? 'Mid-Range' : 'Budget';

        // Pricing note HTML for mid-range cards
        const pricingNoteHTML = card.priceNote ? `
            <div class="pricing-note">
                <p class="price-range-info">₹65–₹90 per card</p>
                <p class="price-note-text">(based on design complexity)</p>
            </div>
        ` : '';

        // WhatsApp message for this card - simple format with card code
        const whatsappMsg = encodeURIComponent(`Hi, I am interested in card ${card.code}. Please share more details.`);

        // CTA button - different for each tier
        const ctaButton = card.tier === 'mid' ? `
            <a href="https://wa.me/919824319135?text=${whatsappMsg}" 
               class="card-cta-btn" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Customize This Design
            </a>
        ` : `<span class="customizable">✓ Customizable</span>`;

        // Generate proper alt text
        const altText = card.altText || `Preet Cards - ${card.name} Wedding Invitation`;

        cardEl.innerHTML = `
            <div class="card-inner-3d">
                <div class="card-front-3d">
                    <img src="${card.image}" alt="${altText}" loading="lazy">
                    <span class="card-category-badge">${card.category}</span>
                    <span class="card-tier-badge tier-${card.tier}">${tierBadge}</span>
                    <span class="card-code-badge">Code: ${card.code}</span>
                </div>
                <div class="card-back-3d">
                    <span class="card-code-back">Code: ${card.code}</span>
                    <h3>${card.name}</h3>
                    <p class="price">${card.priceRange || '₹65–₹90 per card'}</p>
                    <p class="material">${card.material}</p>
                    ${pricingNoteHTML}
                    ${ctaButton}
                </div>
            </div>
        `;

        grid.appendChild(cardEl);
    });

    // Add mouse parallax to new cards
    initCardMouseEffect();
};

// ===== Filter Tabs =====
const initFilterTabs = () => {
    const tabs = document.querySelectorAll('.tab-3d');
    const select = document.getElementById('category-select');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filter = tab.dataset.filter;
            filterCards(filter);
        });
    });

    if (select) {
        select.addEventListener('change', (e) => {
            const category = e.target.value;
            filterCardsByCategory(category);
        });
    }
};

const filterCards = (filter) => {
    let filtered = cardData;

    // Filter by tier instead of price for accurate category filtering
    if (filter === 'premium') {
        filtered = cardData.filter(c => c.tier === 'premium');
    } else if (filter === 'mid') {
        filtered = cardData.filter(c => c.tier === 'mid');
    } else if (filter === 'budget') {
        filtered = cardData.filter(c => c.tier === 'budget');
    }

    // Animate out
    const cards = document.querySelectorAll('.card-item-3d');
    cards.forEach((card, i) => {
        if (typeof gsap !== 'undefined') {
            gsap.to(card, {
                opacity: 0,
                rotateY: 30,
                scale: 0.8,
                duration: 0.3,
                delay: i * 0.05,
                ease: 'power2.in'
            });
        } else {
            card.style.opacity = '0';
            card.style.transform = 'rotateY(30deg) scale(0.8)';
        }
    });

    // Render new cards after animation
    setTimeout(() => {
        renderCards(filtered);

        // Animate in
        const newCards = document.querySelectorAll('.card-item-3d');
        newCards.forEach((card, i) => {
            setTimeout(() => {
                card.classList.add('visible');
            }, i * 100);
        });
    }, 400);
};

const filterCardsByCategory = (category) => {
    let filtered = cardData;

    if (category !== 'all') {
        filtered = cardData.filter(c => c.category === category);
    }

    renderCards(filtered);

    setTimeout(() => {
        const cards = document.querySelectorAll('.card-item-3d');
        cards.forEach((card, i) => {
            setTimeout(() => card.classList.add('visible'), i * 100);
        });
    }, 100);
};

// ===== Mouse Parallax on Cards =====
const initMouseParallax = () => {
    const heroCard = document.querySelector('.card-rotator');
    if (!heroCard) return;

    document.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;

        heroCard.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });

    heroCard.addEventListener('mouseenter', () => {
        heroCard.style.transition = 'none';
    });

    heroCard.addEventListener('mouseleave', () => {
        heroCard.style.transition = 'transform 0.5s ease';
        heroCard.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
};

const initCardMouseEffect = () => {
    const cards = document.querySelectorAll('.card-item-3d');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(40px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
};

// ===== Modal Triggers =====
const initModalTriggers = () => {
    const triggerBtn = document.getElementById('sampleRequestBtn');
    const modal = document.getElementById('sampleModal');
    const closeBtn = modal?.querySelector('.modal-close');

    if (triggerBtn && modal) {
        triggerBtn.addEventListener('click', () => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        closeBtn?.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
};

// ===== Scroll Animations =====
const initScrollAnimations = () => {
    // Check for GSAP
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // Discount cards fly in
        gsap.utils.toArray('.discount-card').forEach((card, i) => {
            const direction = i === 0 ? -100 : i === 2 ? 100 : 0;

            gsap.from(card, {
                x: direction,
                y: 100,
                opacity: 0,
                rotation: direction / 5,
                duration: 0.8,
                scrollTrigger: {
                    trigger: '.cta-3d-section',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                delay: i * 0.2
            });
        });

        // Section headers
        gsap.utils.toArray('.section-header-3d').forEach(header => {
            gsap.from(header, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                scrollTrigger: {
                    trigger: header,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            });
        });
    } else {
        // Fallback with IntersectionObserver
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.discount-card, .section-header-3d').forEach(el => {
            observer.observe(el);
        });
    }
};

// ===== Smooth Scroll (if GSAP available) =====
if (typeof gsap !== 'undefined') {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: { y: target, offsetY: 80 },
                    ease: 'power3.inOut'
                });
            }
        });
    });
}

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
