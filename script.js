// Carousel functionality
class Carousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.carousel-slide');
        this.prevBtn = document.querySelector('.carousel-btn.prev');
        this.nextBtn = document.querySelector('.carousel-btn.next');
        this.dotsContainer = document.querySelector('.carousel-dots');
        this.autoplayInterval = null;
        
        this.init();
    }

    init() {
        this.createDots();
        this.addEventListeners();
        this.startAutoplay();
    }

    createDots() {
        this.slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
        this.dots = document.querySelectorAll('.dot');
    }

    addEventListeners() {
        this.prevBtn.addEventListener('click', () => {
            this.stopAutoplay();
            this.prevSlide();
            this.startAutoplay();
        });

        this.nextBtn.addEventListener('click', () => {
            this.stopAutoplay();
            this.nextSlide();
            this.startAutoplay();
        });

        // Pause autoplay on hover
        const carousel = document.querySelector('.carousel');
        carousel.addEventListener('mouseenter', () => this.stopAutoplay());
        carousel.addEventListener('mouseleave', () => this.startAutoplay());
    }

    goToSlide(index) {
        this.slides[this.currentSlide].classList.remove('active');
        this.dots[this.currentSlide].classList.remove('active');
        
        this.currentSlide = index;
        
        this.slides[this.currentSlide].classList.add('active');
        this.dots[this.currentSlide].classList.add('active');
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }

    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
    }
}

function initResearchNotice() {
    const notice = document.querySelector('.research-notice');
    if (!notice) {
        return;
    }

    const continueBtn = document.getElementById('notice-continue');
    const exitBtn = document.getElementById('notice-exit');
    const message = notice.querySelector('.notice-message');

    if (!continueBtn || !exitBtn || !message) {
        return;
    }

    notice.classList.remove('hidden');
    document.body.classList.add('notice-locked');
    message.classList.add('hidden');
    continueBtn.disabled = false;
    exitBtn.disabled = false;

    const closeNotice = () => {
        notice.classList.add('hidden');
        document.body.classList.remove('notice-locked');
    };

    continueBtn.addEventListener('click', () => {
        closeNotice();
    });

    exitBtn.addEventListener('click', () => {
        message.classList.remove('hidden');
        continueBtn.disabled = true;
        exitBtn.disabled = true;
    });
}

// Product card interactions
function initProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('click', function() {
            console.log('Product clicked:', this.querySelector('.product-name').textContent);
            // Add product detail navigation or modal functionality here
        });
    });
}

// Smooth scroll for navigation links
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#search' && href !== '#cart') {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Newsletter form handling
function initNewsletter() {
    const newsletterInput = document.querySelector('.newsletter-input');
    
    if (newsletterInput) {
        newsletterInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const email = this.value.trim();
                if (email && validateEmail(email)) {
                    console.log('Newsletter subscription:', email);
                    this.value = '';
                    alert('Thank you for subscribing!');
                } else {
                    alert('Please enter a valid email address');
                }
            }
        });
    }
}

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Shopping bag counter (placeholder)
let bagCount = 0;

function updateBagCount(count) {
    bagCount = count;
    const bagElement = document.querySelector('.nav-icon[href="#cart"]');
    if (bagElement) {
        bagElement.textContent = `BAG (${bagCount})`;
    }
}

// Navbar scroll effect
function initNavbarScroll() {
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            navbar.style.boxShadow = 'none';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
        
        lastScroll = currentScroll;
    });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initResearchNotice();
    // Initialize carousel
    new Carousel();
    
    // Initialize other features
    initProductCards();
    initSmoothScroll();
    initNewsletter();
    initNavbarScroll();
    
    console.log('Research Laboratory Website Loaded');
});