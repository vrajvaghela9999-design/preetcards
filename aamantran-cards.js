import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ===== Card Data - Using images from /preet-card-images/ folder =====
// Aamantran cards use card-026 to card-035 (engagement, sangeet, reception events)
const generateAamantranCards = () => {
    const cards = [];
    const categories = ['engagement', 'engagement', 'sangeet', 'sangeet', 'sangeet', 'reception', 'reception', 'reception', 'engagement', 'reception'];

    for (let i = 26; i <= 35; i++) {
        const paddedNum = String(i).padStart(3, '0');
        const code = `#${paddedNum}`;
        cards.push({
            id: i,
            category: categories[i - 26],
            code: code,
            title: `Aamantran Design ${i - 25}`,
            priceRange: '₹65–₹90 per card',
            image: `./preet-card-images/card-${paddedNum}.jpeg`,
            altText: `Preet Cards - Aamantran Card ${code}`,
            featured: i <= 30
        });
    }
    return cards;
};

const cardsData = generateAamantranCards();

// ===== Parallax Background =====
const initParallaxBg = () => {
    const bg = document.getElementById('parallaxBg');

    document.addEventListener('mousemove', (e) => {
        const mouseX = (e.clientX / window.innerWidth - 0.5) * 30;
        const mouseY = (e.clientY / window.innerHeight - 0.5) * 30;

        gsap.to(bg, {
            x: mouseX,
            y: mouseY,
            duration: 1,
            ease: 'power2.out'
        });
    });
};

// ===== 3D Carousel =====
let currentAngle = 0;
let carouselItems = [];
let autoRotateInterval;

const initCarousel = (filter = 'all') => {
    const carousel = document.getElementById('carousel3D');
    if (!carousel) return;

    carousel.innerHTML = '';

    const filteredCards = filter === 'all'
        ? cardsData
        : cardsData.filter(card => card.category === filter);

    const itemCount = filteredCards.length;
    const angleStep = 360 / itemCount;
    const radius = 400;

    filteredCards.forEach((card, index) => {
        const item = document.createElement('div');
        item.className = 'carousel-item';
        item.dataset.index = index;

        // WhatsApp message for this card
        const whatsappMsg = encodeURIComponent(`Hi, I am interested in card ${card.code}. Please share more details.`);

        item.innerHTML = `
            <img src="${card.image}" alt="${card.altText || card.title}" loading="lazy">
            <span class="card-code-badge">Code: ${card.code}</span>
            <div class="carousel-item-content">
                <h3>${card.title}</h3>
                <p class="price">${card.priceRange}</p>
                <a href="https://wa.me/919824319135?text=${whatsappMsg}" class="card-cta-btn" target="_blank" rel="noopener noreferrer">
                    Customize This Design
                </a>
            </div>
        `;

        const angle = angleStep * index;
        item.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;

        carousel.appendChild(item);
    });

    carouselItems = carousel.querySelectorAll('.carousel-item');
    updateCarouselPosition(0);

    // Auto-rotate
    clearInterval(autoRotateInterval);
    autoRotateInterval = setInterval(() => {
        rotateCarousel(1);
    }, 4000);
};

const rotateCarousel = (direction) => {
    const itemCount = carouselItems.length;
    if (itemCount === 0) return;

    const angleStep = 360 / itemCount;
    currentAngle += angleStep * direction;
    updateCarouselPosition(currentAngle);
};

const updateCarouselPosition = (angle) => {
    const carousel = document.getElementById('carousel3D');
    if (carousel) {
        gsap.to(carousel, {
            rotationY: -angle,
            duration: 1,
            ease: 'power2.out'
        });
    }
};

// ===== Bento Grid =====
const initBentoGrid = () => {
    const grid = document.getElementById('bentoGrid');
    if (!grid) return;

    grid.innerHTML = '';

    const featuredCards = cardsData.filter(card => card.featured);
    const sizes = ['large', 'medium', 'tall', 'medium', 'large', 'tall'];

    featuredCards.forEach((card, index) => {
        const item = document.createElement('div');
        item.className = `bento-item ${sizes[index % sizes.length]}`;

        // WhatsApp message for this card
        const whatsappMsg = encodeURIComponent(`Hi, I am interested in card ${card.code}. Please share more details.`);

        item.innerHTML = `
            <img src="${card.image}" alt="${card.altText || card.title}" loading="lazy">
            <span class="card-code-badge">Code: ${card.code}</span>
            <div class="bento-item-overlay">
                <h3>${card.title}</h3>
                <p class="price">${card.priceRange}</p>
                <a href="https://wa.me/919824319135?text=${whatsappMsg}" class="card-cta-btn" target="_blank" rel="noopener noreferrer">
                    Customize
                </a>
            </div>
        `;

        grid.appendChild(item);

        // Animate on scroll
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 0.6,
            delay: index * 0.1
        });

        // 3D tilt effect
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            gsap.to(item, {
                rotationX: rotateX,
                rotationY: rotateY,
                transformPerspective: 1000,
                ease: 'power1.out',
                duration: 0.4
            });
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                rotationX: 0,
                rotationY: 0,
                ease: 'power1.out',
                duration: 0.4
            });
        });
    });
};

// ===== Customizer Modal =====
const initCustomizer = () => {
    const modal = document.getElementById('customizerModal');
    const openBtn = document.getElementById('openCustomizer');
    const closeBtn = document.getElementById('closeCustomizer');
    const updateBtn = document.getElementById('updatePreview');

    if (!modal || !openBtn) return;

    openBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
            modal.classList.remove('active');
        }
    });

    if (updateBtn) {
        updateBtn.addEventListener('click', () => {
            const eventType = document.getElementById('eventType').value;
            const names = document.getElementById('cardNames').value || 'Names Here';
            const date = document.getElementById('cardDate').value || 'Date';
            const venue = document.getElementById('cardVenue').value || 'Venue';

            document.querySelector('.live-event').textContent = eventType.charAt(0).toUpperCase() + eventType.slice(1);
            document.querySelector('.live-names').textContent = names;
            document.querySelector('.live-date').textContent = date;
            document.querySelector('.live-venue').textContent = venue;

            // Animate the card
            const liveCard = document.getElementById('livePreviewCard');
            gsap.fromTo(liveCard,
                { rotationY: 0 },
                { rotationY: 360, duration: 1, ease: 'power2.inOut' }
            );
        });
    }
};

// ===== Category Filter =====
const initCategoryFilter = () => {
    const pills = document.querySelectorAll('.pill');

    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const category = pill.dataset.category;
            initCarousel(category);

            // Reset auto-rotate
            clearInterval(autoRotateInterval);
            autoRotateInterval = setInterval(() => {
                rotateCarousel(1);
            }, 4000);
        });
    });
};

// ===== Carousel Controls =====
const initCarouselControls = () => {
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            rotateCarousel(-1);
            clearInterval(autoRotateInterval);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            rotateCarousel(1);
            clearInterval(autoRotateInterval);
        });
    }
};

// ===== Hero Cube Interaction =====
const initCubeInteraction = () => {
    const cube = document.getElementById('rotatingCube');
    if (!cube) return;

    cube.addEventListener('mouseenter', () => {
        cube.style.animationPlayState = 'paused';
    });

    cube.addEventListener('mouseleave', () => {
        cube.style.animationPlayState = 'running';
    });
};

// ===== Navigation =====
const initNavigation = () => {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navbar = document.getElementById('navbar');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });
};

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    initParallaxBg();
    initCarousel();
    initBentoGrid();
    initCustomizer();
    initCategoryFilter();
    initCarouselControls();
    initCubeInteraction();
    initNavigation();

    // GSAP ScrollTrigger refresh
    ScrollTrigger.refresh();
});
