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

function initResearchNotice(onContinue) {
    const notice = document.querySelector('.research-notice');
    if (!notice) return;

    const continueBtn = document.getElementById('notice-continue');
    const exitBtn = document.getElementById('notice-exit');
    const message = notice.querySelector('.notice-message');

    if (!continueBtn || !exitBtn || !message) return;

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
        if (typeof onContinue === 'function') {
            onContinue();
        }
    });

    exitBtn.addEventListener('click', () => {
        message.classList.remove('hidden');
        continueBtn.disabled = true;
        exitBtn.disabled = true;
    });
}

function initAgeGate() {
    const ageGate = document.querySelector('.age-gate');
    if (!ageGate) return null;

    const yesBtn = document.getElementById('age-verify-yes');
    const noBtn = document.getElementById('age-verify-no');
    const message = ageGate.querySelector('.age-gate-message');

    if (!yesBtn || !noBtn || !message) return null;

    const closeGate = () => {
        ageGate.classList.add('hidden');
        document.body.classList.remove('notice-locked');
    };

    const openGate = () => {
        ageGate.classList.remove('hidden');
        document.body.classList.add('notice-locked');
        message.classList.add('hidden');
        yesBtn.disabled = false;
        noBtn.disabled = false;
    };

    yesBtn.addEventListener('click', () => {
        closeGate();
    });

    noBtn.addEventListener('click', () => {
        message.classList.remove('hidden');
        yesBtn.disabled = true;
        noBtn.disabled = true;
    });

    return openGate;
}

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

function initNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email && validateEmail(email)) {
                console.log('Newsletter subscription:', email);
                emailInput.value = '';
                alert('Thank you for subscribing!');
            } else {
                alert('Please enter a valid email address');
            }
        });
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            navbar.style.boxShadow = 'none';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
    });
}

// WooCommerce API Integration
const WOOCOMMERCE_URL = 'https://vitasynlabs.com';
const CONSUMER_KEY = 'ck_a4b4226fbbdff41fd6d7faba18a10b3ebc3004cb';
const CONSUMER_SECRET = 'cs_30cb119423d871d615d87ac96c23420dad3c8e1e';

async function loadWooCommerceProducts() {
    try {
        console.log('Fetching products from WooCommerce...');
        
        const url = `${WOOCOMMERCE_URL}/wp-json/wc/v3/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&per_page=50&status=publish`;
        
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const products = await response.json();
        console.log('Products loaded:', products);
        
        if (products && products.length > 0) {
            displayWooCommerceProducts(products);
        } else {
            console.log('No products found');
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function displayWooCommerceProducts(products) {
    const productGrid = document.querySelector('.product-grid');
    
    if (!productGrid) {
        console.error('Product grid not found');
        return;
    }

    productGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        const imageUrl = product.images && product.images.length > 0 
            ? product.images[0].src 
            : null;
        
        const price = product.price || '0.00';
        
        productCard.innerHTML = `
            <div class="product-image">
                ${imageUrl ? 
                    `<img src="${imageUrl}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">` :
                    `<div class="placeholder-img">PEPTIDE IMAGE</div>`
                }
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">$${price}</p>
            </div>
        `;
        
        productCard.addEventListener('click', () => {
            window.location.href = product.permalink;
        });
        
        productGrid.appendChild(productCard);
    });
    
    console.log(`Displayed ${products.length} products`);
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const openAgeGate = initAgeGate();
    initResearchNotice(openAgeGate);
    
    new Carousel();
    
    loadWooCommerceProducts();
    
    initSmoothScroll();
    initNewsletter();
    initNavbarScroll();
    
    console.log('VitaSyn Labs Website Loaded');
});