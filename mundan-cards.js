/* ========================================
   MUNDAN CARDS - JavaScript
   3D Animations, Confetti, Photo Upload
   ======================================== */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ===== Card Data - Using images from /preet-card-images/ folder =====
// Mundan cards use card-036 to card-041 (baby-themed ceremony cards)
const generateMundanCards = () => {
    const cards = [];
    const categories = ['traditional', 'modern', 'cartoon', 'floral', 'royal', 'simple'];
    const emojis = ['🙏', '✨', '🧸', '🌸', '👑', '🎈'];

    for (let i = 36; i <= 41; i++) {
        const paddedNum = String(i).padStart(3, '0');
        const code = `#${paddedNum}`;
        const categoryIndex = i - 36;
        cards.push({
            id: i,
            category: categories[categoryIndex],
            code: code,
            title: `Mundan Design ${i - 35}`,
            priceRange: '₹65–₹90 per card',
            image: `./preet-card-images/card-${paddedNum}.jpeg`,
            altText: `Preet Cards - Mundan Card ${code}`,
            emoji: emojis[categoryIndex]
        });
    }
    return cards;
};

const cardsData = generateMundanCards();

// ===== Confetti Effect =====
const initConfetti = () => {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettiColors = ['#FFE566', '#89CFF0', '#FFD1DC', '#C1E1C1', '#E0BBE4', '#FFF3B0'];
    const confettiPieces = [];

    // Create confetti pieces
    for (let i = 0; i < 150; i++) {
        confettiPieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 10 + 5,
            color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            speed: Math.random() * 3 + 2,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5,
            wobble: Math.random() * 10,
            wobbleSpeed: Math.random() * 0.1,
        });
    }

    let animationFrame;
    let startTime = Date.now();
    const duration = 4000; // 4 seconds

    const animate = () => {
        const elapsed = Date.now() - startTime;

        if (elapsed > duration) {
            // Fade out
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            gsap.to(canvas, {
                opacity: 0, duration: 0.5, onComplete: () => {
                    cancelAnimationFrame(animationFrame);
                    canvas.style.display = 'none';
                }
            });
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        confettiPieces.forEach((piece, index) => {
            piece.y += piece.speed;
            piece.x += Math.sin(piece.wobble) * 2;
            piece.wobble += piece.wobbleSpeed;
            piece.rotation += piece.rotationSpeed;

            // Respawn at top if fallen off
            if (piece.y > canvas.height) {
                piece.y = -piece.size;
                piece.x = Math.random() * canvas.width;
            }

            ctx.save();
            ctx.translate(piece.x, piece.y);
            ctx.rotate((piece.rotation * Math.PI) / 180);
            ctx.fillStyle = piece.color;
            ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size / 2);
            ctx.restore();
        });

        animationFrame = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
};

// ===== Parallax Background =====
const initParallax = () => {
    const bg = document.getElementById('parallaxBg');
    const duck = document.getElementById('rubberDuck');
    const motifs = document.querySelectorAll('.motif');

    // Mouse parallax
    document.addEventListener('mousemove', (e) => {
        const mouseX = (e.clientX / window.innerWidth - 0.5) * 30;
        const mouseY = (e.clientY / window.innerHeight - 0.5) * 30;

        gsap.to(bg, {
            x: mouseX,
            y: mouseY,
            duration: 1,
            ease: 'power2.out'
        });

        motifs.forEach((motif, index) => {
            const speed = parseFloat(motif.dataset.speed) || 0.1;
            gsap.to(motif, {
                x: mouseX * speed * 10,
                y: mouseY * speed * 10,
                duration: 1,
                ease: 'power2.out'
            });
        });
    });

    // Scroll parallax for rubber duck
    if (duck) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            gsap.to(duck, {
                y: scrollY * 0.3,
                x: Math.sin(scrollY * 0.005) * 50,
                rotation: scrollY * 0.02,
                duration: 0.5,
                ease: 'power1.out'
            });
        });
    }
};

// ===== Photo Upload =====
const initPhotoUpload = () => {
    const uploadArea = document.getElementById('uploadArea');
    const photoInput = document.getElementById('photoInput');
    const photoPreviewArea = document.getElementById('photoPreviewArea');
    const updateBtn = document.getElementById('updateCardPreview');
    const babyNameInput = document.getElementById('babyName');
    const ceremonyDateInput = document.getElementById('ceremonyDate');
    const previewBabyName = document.getElementById('previewBabyName');
    const previewDate = document.getElementById('previewDate');

    if (!uploadArea || !photoInput) return;

    // Drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.classList.add('drag-over');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.classList.remove('drag-over');
        });
    });

    uploadArea.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    uploadArea.addEventListener('click', () => {
        photoInput.click();
    });

    photoInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    const handleFile = (file) => {
        if (!file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            photoPreviewArea.innerHTML = `<img src="${e.target.result}" alt="Baby's Photo">`;

            // Animate the preview card
            const previewCard = document.getElementById('previewCardRotating');
            if (previewCard) {
                gsap.fromTo(previewCard,
                    { scale: 0.8, opacity: 0.5 },
                    { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
                );
            }
        };
        reader.readAsDataURL(file);
    };

    // Update preview button
    if (updateBtn) {
        updateBtn.addEventListener('click', () => {
            if (previewBabyName && babyNameInput) {
                previewBabyName.textContent = babyNameInput.value || "Baby's Name";
            }
            if (previewDate && ceremonyDateInput) {
                previewDate.textContent = ceremonyDateInput.value || "Date & Venue";
            }

            // Animate the card rotation
            const previewCard = document.getElementById('previewCardRotating');
            if (previewCard) {
                gsap.to(previewCard, {
                    rotationY: '+=360',
                    duration: 1,
                    ease: 'power2.inOut'
                });
            }
        });
    }
};

// ===== Frame Gallery =====
const initFrameGallery = (filter = 'all') => {
    const gallery = document.getElementById('frameGallery');
    if (!gallery) return;

    gallery.innerHTML = '';

    const filteredCards = filter === 'all'
        ? cardsData
        : cardsData.filter(card => card.category === filter);

    filteredCards.forEach((card, index) => {
        const frameCard = document.createElement('div');
        frameCard.className = 'frame-card';
        frameCard.dataset.category = card.category;

        // WhatsApp message for this card
        const whatsappMsg = encodeURIComponent(`Hi, I am interested in card ${card.code}. Please share more details.`);

        frameCard.innerHTML = `
            <div class="frame-card-inner">
                <div class="frame-image">
                    <img src="${card.image}" alt="${card.altText || card.title}" loading="lazy">
                    <span class="card-code-badge">Code: ${card.code}</span>
                </div>
                <div class="frame-content">
                    <h3>${card.title}</h3>
                    <p class="price">${card.priceRange}</p>
                    <a href="https://wa.me/919824319135?text=${whatsappMsg}" class="card-cta-btn" target="_blank" rel="noopener noreferrer">
                        Customize This Design
                    </a>
                </div>
            </div>
        `;

        gallery.appendChild(frameCard);

        // Sequential pop-in animation (jack-in-the-box effect)
        gsap.fromTo(frameCard,
            {
                y: 100,
                scale: 0.5,
                opacity: 0,
                rotationX: -30
            },
            {
                y: 0,
                scale: 1,
                opacity: 1,
                rotationX: 0,
                duration: 0.8,
                delay: index * 0.1,
                ease: 'back.out(1.7)',
                scrollTrigger: {
                    trigger: frameCard,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );

        // Spring bounce on hover
        frameCard.addEventListener('mouseenter', () => {
            gsap.to(frameCard, {
                scale: 1.05,
                y: -15,
                rotationY: 10,
                rotationX: -5,
                duration: 0.4,
                ease: 'elastic.out(1, 0.5)'
            });
        });

        frameCard.addEventListener('mouseleave', () => {
            gsap.to(frameCard, {
                scale: 1,
                y: 0,
                rotationY: 0,
                rotationX: 0,
                duration: 0.6,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
};

// ===== Category Filter =====
const initCategoryFilter = () => {
    const pills = document.querySelectorAll('.pill');

    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const category = pill.dataset.category;
            initFrameGallery(category);
        });
    });
};

// ===== Toy Blocks Interaction =====
const initToyBlocks = () => {
    const blocks = document.querySelectorAll('.toy-block');

    blocks.forEach(block => {
        block.addEventListener('mouseenter', () => {
            gsap.to(block, {
                rotationY: 15,
                rotationX: -10,
                scale: 1.1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        block.addEventListener('mouseleave', () => {
            gsap.to(block, {
                rotationY: 0,
                rotationX: 0,
                scale: 1,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
};

// ===== Badge Animations =====
const initBadgeAnimations = () => {
    const badges = document.querySelectorAll('.badge-3d');

    badges.forEach((badge, index) => {
        gsap.from(badge, {
            scrollTrigger: {
                trigger: badge,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            scale: 0.8,
            duration: 0.6,
            delay: index * 0.15,
            ease: 'back.out(1.7)'
        });
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

// ===== Smooth Scroll =====
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                gsap.to(window, {
                    scrollTo: { y: target, offsetY: 80 },
                    duration: 1,
                    ease: 'power2.inOut'
                });
            }
        });
    });
};

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    // Fire confetti on load
    initConfetti();

    // Initialize all features
    initParallax();
    initPhotoUpload();
    initFrameGallery();
    initCategoryFilter();
    initToyBlocks();
    initBadgeAnimations();
    initNavigation();
    initSmoothScroll();

    // Refresh ScrollTrigger
    ScrollTrigger.refresh();
});
