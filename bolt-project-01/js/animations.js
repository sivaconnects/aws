// ===== ANIMATION CONTROLLER =====

class AnimationController {
    constructor() {
        this.observers = new Map();
        this.animations = new Map();
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
        this.setupHoverAnimations();
        this.setupLoadingAnimations();
    }

    // ===== INTERSECTION OBSERVER FOR SCROLL ANIMATIONS =====
    setupIntersectionObserver() {
        const options = {
            threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerAnimation(entry.target);
                }
            });
        }, options);

        // Observe all elements with animation attributes
        document.querySelectorAll('[data-aos], [data-animate], .animate-on-scroll').forEach(element => {
            observer.observe(element);
        });

        this.observers.set('scroll', observer);
    }

    // ===== TRIGGER ANIMATIONS =====
    triggerAnimation(element) {
        const animationType = element.dataset.aos || element.dataset.animate || 'fade-in';
        const delay = element.dataset.aosDelay || element.dataset.delay || 0;
        const duration = element.dataset.aosDuration || element.dataset.duration || 600;

        setTimeout(() => {
            element.classList.add('aos-animate', 'animated');
            this.applyAnimation(element, animationType, duration);
        }, parseInt(delay));
    }

    applyAnimation(element, type, duration) {
        element.style.animationDuration = `${duration}ms`;
        
        switch (type) {
            case 'fade-up':
                element.style.animation = `fadeInUp ${duration}ms ease-out forwards`;
                break;
            case 'fade-down':
                element.style.animation = `fadeInDown ${duration}ms ease-out forwards`;
                break;
            case 'fade-left':
                element.style.animation = `fadeInLeft ${duration}ms ease-out forwards`;
                break;
            case 'fade-right':
                element.style.animation = `fadeInRight ${duration}ms ease-out forwards`;
                break;
            case 'zoom-in':
                element.style.animation = `zoomIn ${duration}ms ease-out forwards`;
                break;
            case 'zoom-out':
                element.style.animation = `zoomOut ${duration}ms ease-out forwards`;
                break;
            case 'slide-up':
                element.style.animation = `slideInUp ${duration}ms ease-out forwards`;
                break;
            case 'slide-down':
                element.style.animation = `slideInDown ${duration}ms ease-out forwards`;
                break;
            case 'rotate-in':
                element.style.animation = `rotateIn ${duration}ms ease-out forwards`;
                break;
            case 'bounce-in':
                element.style.animation = `bounceIn ${duration}ms ease-out forwards`;
                break;
            default:
                element.style.animation = `fadeIn ${duration}ms ease-out forwards`;
        }
    }

    // ===== SCROLL-BASED ANIMATIONS =====
    setupScrollAnimations() {
        let ticking = false;

        const updateScrollAnimations = () => {
            const scrollY = window.pageYOffset;
            const windowHeight = window.innerHeight;

            // Parallax elements
            document.querySelectorAll('[data-parallax]').forEach(element => {
                const speed = parseFloat(element.dataset.parallax) || 0.5;
                const yPos = -(scrollY * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });

            // Progress bars
            document.querySelectorAll('.progress-bar').forEach(bar => {
                const rect = bar.getBoundingClientRect();
                if (rect.top < windowHeight && rect.bottom > 0) {
                    const progress = Math.min(100, Math.max(0, 
                        ((windowHeight - rect.top) / (windowHeight + rect.height)) * 100
                    ));
                    const fill = bar.querySelector('.progress-fill');
                    if (fill) {
                        fill.style.width = `${progress}%`;
                    }
                }
            });

            // Reveal elements
            document.querySelectorAll('.reveal').forEach(element => {
                const rect = element.getBoundingClientRect();
                if (rect.top < windowHeight * 0.8) {
                    element.classList.add('revealed');
                }
            });

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollAnimations);
                ticking = true;
            }
        });

        // Initial call
        updateScrollAnimations();
    }

    // ===== HOVER ANIMATIONS =====
    setupHoverAnimations() {
        // Magnetic effect for buttons
        document.querySelectorAll('.btn, .magnetic').forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0, 0)';
            });
        });

        // Tilt effect for cards
        document.querySelectorAll('.tilt, .feature-card, .service-item').forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / centerY * -10;
                const rotateY = (x - centerX) / centerX * 10;
                
                element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });

        // Ripple effect for buttons
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    // ===== LOADING ANIMATIONS =====
    setupLoadingAnimations() {
        // Skeleton loading
        document.querySelectorAll('.skeleton').forEach(skeleton => {
            skeleton.style.background = `
                linear-gradient(90deg, 
                    transparent, 
                    rgba(255, 255, 255, 0.4), 
                    transparent
                )
            `;
            skeleton.style.backgroundSize = '200% 100%';
            skeleton.style.animation = 'skeleton-loading 1.5s infinite';
        });

        // Stagger animations for lists
        document.querySelectorAll('.stagger-children').forEach(container => {
            const children = container.children;
            Array.from(children).forEach((child, index) => {
                child.style.animationDelay = `${index * 100}ms`;
                child.classList.add('stagger-item');
            });
        });
    }

    // ===== PARTICLE SYSTEM =====
    createParticles(container, count = 50) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                left: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 10}s;
                animation-duration: ${5 + Math.random() * 10}s;
            `;
            container.appendChild(particle);
        }
    }

    // ===== TEXT ANIMATIONS =====
    animateText(element, type = 'typewriter') {
        const text = element.textContent;
        element.textContent = '';

        switch (type) {
            case 'typewriter':
                this.typewriterEffect(element, text);
                break;
            case 'reveal':
                this.textRevealEffect(element, text);
                break;
            case 'scramble':
                this.scrambleEffect(element, text);
                break;
        }
    }

    typewriterEffect(element, text, speed = 100) {
        let i = 0;
        const timer = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            if (i > text.length - 1) {
                clearInterval(timer);
            }
        }, speed);
    }

    textRevealEffect(element, text) {
        const words = text.split(' ');
        element.innerHTML = words.map(word => 
            `<span class="word">${word.split('').map(char => 
                `<span class="char">${char}</span>`
            ).join('')}</span>`
        ).join(' ');

        const chars = element.querySelectorAll('.char');
        chars.forEach((char, index) => {
            char.style.animationDelay = `${index * 50}ms`;
            char.classList.add('text-reveal');
        });
    }

    scrambleEffect(element, text, duration = 2000) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let iterations = 0;
        const maxIterations = duration / 50;

        const interval = setInterval(() => {
            element.textContent = text
                .split('')
                .map((char, index) => {
                    if (index < iterations) {
                        return text[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');

            if (iterations >= text.length) {
                clearInterval(interval);
            }

            iterations += 1 / 3;
        }, 50);
    }

    // ===== MORPHING ANIMATIONS =====
    morphElement(element, shapes, duration = 2000) {
        let currentShape = 0;
        
        const morph = () => {
            element.style.borderRadius = shapes[currentShape];
            currentShape = (currentShape + 1) % shapes.length;
        };

        morph(); // Initial shape
        setInterval(morph, duration);
    }

    // ===== CLEANUP =====
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.animations.clear();
    }
}

// ===== CUSTOM KEYFRAMES =====
const customKeyframes = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    @keyframes skeleton-loading {
        0% {
            background-position: -200% 0;
        }
        100% {
            background-position: 200% 0;
        }
    }

    @keyframes bounceIn {
        0% {
            opacity: 0;
            transform: scale3d(0.3, 0.3, 0.3);
        }
        20% {
            transform: scale3d(1.1, 1.1, 1.1);
        }
        40% {
            transform: scale3d(0.9, 0.9, 0.9);
        }
        60% {
            opacity: 1;
            transform: scale3d(1.03, 1.03, 1.03);
        }
        80% {
            transform: scale3d(0.97, 0.97, 0.97);
        }
        100% {
            opacity: 1;
            transform: scale3d(1, 1, 1);
        }
    }
`;

// Inject custom keyframes
const style = document.createElement('style');
style.textContent = customKeyframes;
document.head.appendChild(style);

// Initialize animation controller when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.animationController = new AnimationController();
    
    // Add particle effects to hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        window.animationController.createParticles(heroSection, 30);
    }
    
    // Animate text elements
    document.querySelectorAll('[data-text-animate]').forEach(element => {
        const type = element.dataset.textAnimate || 'typewriter';
        window.animationController.animateText(element, type);
    });
    
    // Setup morphing elements
    document.querySelectorAll('[data-morph]').forEach(element => {
        const shapes = element.dataset.morph.split(',');
        window.animationController.morphElement(element, shapes);
    });
});

// Export for use in other files
window.AnimationController = AnimationController;