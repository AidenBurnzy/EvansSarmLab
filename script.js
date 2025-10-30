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

function initResearchNotice(onContinue) {
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
    if (!ageGate) {
        return null;
    }

    const yesBtn = document.getElementById('age-verify-yes');
    const noBtn = document.getElementById('age-verify-no');
    const message = ageGate.querySelector('.age-gate-message');

    if (!yesBtn || !noBtn || !message) {
        return null;
    }

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
// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const openAgeGate = initAgeGate();
    initResearchNotice(openAgeGate);
    // Initialize carousel
    new Carousel();
    
    // Load DropShip products
    loadDropShipProducts();
    
    // Initialize other features
    initSmoothScroll();
    initNewsletter();
    initNavbarScroll();
    
    console.log('Research Laboratory Website Loaded');
});

// DropShipEazy API Integration
const DROPSHIP_API_KEY = 'dss_10ce498615f6e6d677a2a13af5df18a1ed890be2bf35875b6f521050d0a15d29';

async function loadDropShipProducts() {
    try {
        const response = await fetch('https://api.dropshipeazy.com/v1/products', {
            headers: {
                'Authorization': `Bearer ${DROPSHIP_API_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Products loaded:', data);
        
        // Display the products
        displayDropShipProducts(data.products || data);
    } catch (error) {
        console.error('Error loading products:', error);
        // Keep placeholder products if API fails
    }
}

function displayDropShipProducts(products) {
    const productGrid = document.querySelector('.product-grid');
    
    if (!products || products.length === 0) {
        console.log('No products found');
        return;
    }

    // Clear existing placeholder products
    productGrid.innerHTML = '';

    // Add each product from the API
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <div class="product-image">
                ${product.image ? 
                    `<img src="${product.image}" alt="${product.name || 'Product'}" style="width: 100%; height: 100%; object-fit: cover;">` :
                    `<div class="placeholder-img">PEPTIDE IMAGE</div>`
                }
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name || product.title || 'Product'}</h3>
                <p class="product-price">$${product.price || '0.00'}</p>
            </div>
        `;
        
        // Add click handler
        productCard.addEventListener('click', () => {
            console.log('Product clicked:', product);
            // You can add modal or detail page here
            alert(`Product: ${product.name}\nPrice: $${product.price}\n\nClick OK to continue`);
        });
        
        productGrid.appendChild(productCard);
    });
}