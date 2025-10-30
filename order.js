// Order Page Functionality

// WooCommerce API Configuration
const WOOCOMMERCE_URL = 'https://vitasynlabs.com';
const CONSUMER_KEY = 'ck_a4b4226fbbdff41fd6d7faba18a10b3ebc3004cb';
const CONSUMER_SECRET = 'cs_30cb119423d871d615d87ac96c23420dad3c8e1e';

// Product data storage
let allProducts = [];
let filteredProducts = [];

// Shopping cart
let cart = [];

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('peptide_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('peptide_cart', JSON.stringify(cart));
    updateCartUI();
}

// Add item to cart
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: parseFloat(product.price) || 0,
            image: product.images && product.images.length > 0 ? product.images[0].src : null,
            quantity: 1,
            permalink: product.permalink
        });
    }
    
    saveCart();
    showCartNotification(product.name);
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
}

// Update item quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
        }
    }
}

// Calculate cart total
function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Update cart UI (count badge)
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartCount) {
        cartCount.textContent = totalItems;
        if (totalItems > 0) {
            cartCount.classList.remove('hidden');
        } else {
            cartCount.classList.add('hidden');
        }
    }
    
    // Update cart sidebar if it's open
    renderCart();
}

// Render cart items in sidebar
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartTotalPrice = document.getElementById('cart-total-price');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartEmpty.style.display = 'block';
        cartItemsContainer.innerHTML = '';
        if (cartTotalPrice) cartTotalPrice.textContent = '$0.00';
        return;
    }
    
    cartEmpty.style.display = 'none';
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                ${item.image ? 
                    `<img src="${item.image}" alt="${item.name}">` : 
                    `<div class="cart-item-placeholder">PEPTIDE</div>`
                }
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button onclick="updateQuantity(${item.id}, -1)">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <div class="cart-item-remove">
                <button class="cart-remove-btn" onclick="removeFromCart(${item.id})">×</button>
            </div>
        </div>
    `).join('');
    
    if (cartTotalPrice) {
        cartTotalPrice.textContent = `$${getCartTotal().toFixed(2)}`;
    }
}

// Open cart sidebar
function openCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    if (cartSidebar) {
        cartSidebar.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        renderCart();
    }
}

// Close cart sidebar
function closeCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    if (cartSidebar) {
        cartSidebar.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// Show add to cart notification
function showCartNotification(productName) {
    // Simple alert for now - could be enhanced with a toast notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #000;
        color: #fff;
        padding: 20px 30px;
        z-index: 5000;
        letter-spacing: 1px;
        font-size: 14px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    `;
    notification.textContent = `Added ${productName} to cart`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Initialize cart
function initCart() {
    loadCart();
    
    // Cart icon click
    document.addEventListener('click', (e) => {
        if (e.target.closest('#cart-icon') || e.target.closest('.cart-icon')) {
            e.preventDefault();
            openCart();
        }
    });
    
    // Close button
    const closeBtn = document.getElementById('cart-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeCart);
    }
    
    // Overlay click
    const overlay = document.getElementById('cart-overlay');
    if (overlay) {
        overlay.addEventListener('click', closeCart);
    }
    
    // Continue shopping
    const continueBtn = document.getElementById('cart-continue');
    if (continueBtn) {
        continueBtn.addEventListener('click', closeCart);
    }
    
    // Checkout button
    const checkoutBtn = document.getElementById('cart-checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            alert('Checkout functionality coming soon!');
        });
    }
    
    // Escape key
    document.addEventListener('keydown', (e) => {
        const cartSidebar = document.getElementById('cart-sidebar');
        if (e.key === 'Escape' && cartSidebar && !cartSidebar.classList.contains('hidden')) {
            closeCart();
        }
    });
}

// Stack definitions - specify which products belong to each stack
const STACK_DEFINITIONS = {
    wolverine: {
        // Keywords to match products for Wolverine Stack (recovery & regeneration)
        keywords: ['BPC', 'TB-500', 'TB500', 'Ipamorelin', 'CJC', 'MK-677', 'MK677', 'Growth', 'Recovery'],
        maxProducts: 4,
        fallbackToAny: true // If no matches, show first available products
    },
    glow: {
        // Keywords to match products for Glow Stack (rejuvenation & vitality)
        keywords: ['GHK', 'Epithalon', 'NAD', 'Melanotan', 'Collagen', 'Peptide', 'Anti-aging', 'Skin'],
        maxProducts: 4,
        fallbackToAny: true // If no matches, show first available products
    }
};

// Load products when page loads
async function loadAllProducts() {
    const productGrid = document.getElementById('product-grid');
    
    // Show loading spinner
    if (productGrid) {
        productGrid.innerHTML = `
            <div class="loading-spinner" style="grid-column: 1 / -1;">
                <div class="spinner"></div>
            </div>
        `;
    }
    
    try {
        console.log('Loading products for order page...');
        
        const url = `${WOOCOMMERCE_URL}/wp-json/wc/v3/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&per_page=100&status=publish`;
        
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const products = await response.json();
        console.log('Products loaded:', products.length, 'products');
        
        allProducts = products;
        filteredProducts = products;
        
        displayAllProducts(products);
        displayStackProducts();
        
    } catch (error) {
        console.error('Error loading products:', error);
        displayError();
    }
}

// Display all products in the main grid
function displayAllProducts(products) {
    const productGrid = document.getElementById('product-grid');
    
    if (!productGrid) {
        console.error('Product grid not found');
        return;
    }

    if (!products || products.length === 0) {
        productGrid.innerHTML = `
            <div class="no-results" style="grid-column: 1 / -1;">
                <h3 class="no-results-title">NO PRODUCTS FOUND</h3>
                <p class="no-results-text">Please try a different search term</p>
            </div>
        `;
        return;
    }

    productGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
    
    console.log(`Displayed ${products.length} products in main grid`);
}

// Create a product card element
function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    
    const imageUrl = product.images && product.images.length > 0 
        ? product.images[0].src 
        : null;
    
    const price = product.price || '0.00';
    
    productCard.innerHTML = `
        <div class="product-image">
            ${imageUrl ? 
                `<img src="${imageUrl}" alt="${product.name}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; display: block;">` :
                `<div class="placeholder-img">PEPTIDE IMAGE</div>`
            }
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">$${price}</p>
        </div>
    `;
    
    productCard.addEventListener('click', () => {
        openProductModal(product);
    });
    
    return productCard;
}

// Create a stack product card element
function createStackProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'stack-product-card';
    
    const imageUrl = product.images && product.images.length > 0 
        ? product.images[0].src 
        : null;
    
    const price = product.price || '0.00';
    
    productCard.innerHTML = `
        <div class="stack-product-image">
            ${imageUrl ? 
                `<img src="${imageUrl}" alt="${product.name}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; display: block;">` :
                `<div class="stack-product-placeholder">PEPTIDE IMAGE</div>`
            }
        </div>
        <div class="stack-product-info">
            <h4 class="stack-product-name">${product.name}</h4>
            <p class="stack-product-price">$${price}</p>
        </div>
    `;
    
    productCard.addEventListener('click', () => {
        openProductModal(product);
    });
    
    return productCard;
}

// Display products in stacks
function displayStackProducts() {
    displayWolverineStack();
    displayGlowStack();
}

// Display Wolverine Stack products
function displayWolverineStack() {
    const wolverineContainer = document.getElementById('wolverine-products');
    
    if (!wolverineContainer) return;

    const wolverineProducts = filterProductsForStack(STACK_DEFINITIONS.wolverine);
    
    console.log('Wolverine stack products found:', wolverineProducts.length);
    
    if (wolverineProducts.length === 0) {
        wolverineContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; background: #f8f8f8; border: 2px dashed #1a5490;">
                <p style="color: #1a5490; letter-spacing: 2px; font-size: 15px; font-weight: 500;">
                    🔬 STACK PRODUCTS COMING SOON
                </p>
                <p style="color: #666; letter-spacing: 1px; font-size: 13px; margin-top: 10px;">
                    Premium peptide stack for ultimate recovery and regeneration
                </p>
            </div>
        `;
        return;
    }

    wolverineContainer.innerHTML = '';
    wolverineProducts.forEach(product => {
        const card = createStackProductCard(product);
        wolverineContainer.appendChild(card);
    });
    console.log('Displayed', wolverineProducts.length, 'products in Wolverine stack');
}

// Display Glow Stack products
function displayGlowStack() {
    const glowContainer = document.getElementById('glow-products');
    
    if (!glowContainer) return;

    const glowProducts = filterProductsForStack(STACK_DEFINITIONS.glow);
    
    console.log('Glow stack products found:', glowProducts.length);
    
    if (glowProducts.length === 0) {
        glowContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; background: #f8f8f8; border: 2px dashed #c9a961;">
                <p style="color: #c9a961; letter-spacing: 2px; font-size: 15px; font-weight: 500;">
                    ✨ STACK PRODUCTS COMING SOON
                </p>
                <p style="color: #666; letter-spacing: 1px; font-size: 13px; margin-top: 10px;">
                    Premium peptide stack for cellular rejuvenation and vitality
                </p>
            </div>
        `;
        return;
    }

    glowContainer.innerHTML = '';
    glowProducts.forEach(product => {
        const card = createStackProductCard(product);
        glowContainer.appendChild(card);
    });
    console.log('Displayed', glowProducts.length, 'products in Glow stack');
}

// Filter products for a specific stack based on keywords
function filterProductsForStack(stackDef) {
    if (!allProducts || allProducts.length === 0) {
        console.log('No products available to filter');
        return [];
    }
    
    // First try to match by keywords
    const matchedProducts = allProducts.filter(product => {
        const productName = product.name.toLowerCase();
        const productSku = product.sku ? product.sku.toLowerCase() : '';
        const productDesc = product.description ? product.description.toLowerCase() : '';
        
        return stackDef.keywords.some(keyword => {
            const keywordLower = keyword.toLowerCase();
            return productName.includes(keywordLower) || 
                   productSku.includes(keywordLower) ||
                   productDesc.includes(keywordLower);
        });
    });
    
    console.log('Filtering for keywords:', stackDef.keywords, '- Found:', matchedProducts.length);
    
    // If no matches and fallback is enabled, just show some products
    if (matchedProducts.length === 0 && stackDef.fallbackToAny && allProducts.length > 0) {
        console.log('No keyword matches, using fallback products');
        return allProducts.slice(0, stackDef.maxProducts);
    }
    
    // Limit to max products for the stack
    return matchedProducts.slice(0, stackDef.maxProducts);
}

// Search functionality
function initSearch() {
    const searchInput = document.getElementById('product-search');
    const searchBtn = document.getElementById('search-btn');
    
    if (!searchInput || !searchBtn) return;

    // Search on button click
    searchBtn.addEventListener('click', performSearch);
    
    // Search on Enter key
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Real-time search as user types (with debounce)
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch();
        }, 500);
    });
}

// Perform product search
function performSearch() {
    const searchInput = document.getElementById('product-search');
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (searchTerm === '') {
        filteredProducts = allProducts;
        displayAllProducts(allProducts);
        return;
    }
    
    filteredProducts = allProducts.filter(product => {
        const name = product.name.toLowerCase();
        const description = product.description ? product.description.toLowerCase() : '';
        const shortDescription = product.short_description ? product.short_description.toLowerCase() : '';
        
        return name.includes(searchTerm) || 
               description.includes(searchTerm) || 
               shortDescription.includes(searchTerm);
    });
    
    displayAllProducts(filteredProducts);
    
    // Scroll to results
    const allProductsSection = document.getElementById('all-products');
    if (allProductsSection && filteredProducts.length > 0) {
        allProductsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Display error message
function displayError() {
    const productGrid = document.getElementById('product-grid');
    if (productGrid) {
        productGrid.innerHTML = `
            <div class="no-results">
                <h3 class="no-results-title">UNABLE TO LOAD PRODUCTS</h3>
                <p class="no-results-text">Please try again later</p>
            </div>
        `;
    }
}

// Load navbar and footer
function loadComponents() {
    // Load navbar
    fetch('navbar.html')
        .then(response => response.text())
        .then(html => {
            const temp = document.createElement('div');
            temp.innerHTML = html;
            const navbar = temp.querySelector('nav');
            if (navbar) {
                document.getElementById('navbar-container').appendChild(navbar);
                initNavbarScroll();
            }
        })
        .catch(err => console.error('Error loading navbar:', err));
    
    // Load footer
    fetch('footer.html')
        .then(response => response.text())
        .then(html => {
            const temp = document.createElement('div');
            temp.innerHTML = html;
            const footer = temp.querySelector('footer');
            if (footer) {
                document.getElementById('footer-container').appendChild(footer);
                initNewsletter();
            }
        })
        .catch(err => console.error('Error loading footer:', err));
}

// Initialize smooth scrolling
function initSmoothScrollForOrder() {
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

// Helper functions from script.js that we need locally
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

function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            navbar.style.boxShadow = 'none';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
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

// Product Modal Functions
let currentProduct = null;

function openProductModal(product) {
    currentProduct = product;
    const modal = document.getElementById('product-modal');
    const modalImage = document.getElementById('modal-product-image');
    const modalImageContainer = document.getElementById('modal-image-container');
    const modalName = document.getElementById('modal-product-name');
    const modalPrice = document.getElementById('modal-product-price');
    const modalDescription = document.getElementById('modal-product-description');
    const modalViewProduct = document.getElementById('modal-view-product');
    
    if (!modal) return;
    
    // Populate modal with product data
    if (product.images && product.images.length > 0) {
        modalImage.src = product.images[0].src;
        modalImage.alt = product.name;
        modalImage.style.display = 'block';
    } else {
        modalImageContainer.innerHTML = '<div class="product-modal-placeholder">PEPTIDE IMAGE</div>';
    }
    
    modalName.textContent = product.name;
    modalPrice.textContent = `$${product.price || '0.00'}`;
    
    // Set description (strip HTML tags for security)
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = product.short_description || product.description || 'No description available.';
    modalDescription.textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    // Set product link
    modalViewProduct.href = product.permalink;
    
    // Show modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    console.log('Opened modal for:', product.name);
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

function initProductModal() {
    const modal = document.getElementById('product-modal');
    const closeBtn = document.getElementById('modal-close');
    const overlay = document.getElementById('modal-overlay');
    const addToCartBtn = document.getElementById('modal-add-to-cart');
    
    if (!modal) return;
    
    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeProductModal);
    }
    
    // Overlay click
    if (overlay) {
        overlay.addEventListener('click', closeProductModal);
    }
    
    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeProductModal();
        }
    });
    
    // Add to cart button (placeholder functionality)
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            if (currentProduct) {
                addToCart(currentProduct);
                closeProductModal();
            }
        });
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize gates and notices
    const openAgeGate = initAgeGate();
    initResearchNotice(openAgeGate);
    
    // Load components
    loadComponents();
    
    // Load products
    loadAllProducts();
    
    // Initialize search
    initSearch();
    
    // Initialize smooth scrolling
    initSmoothScrollForOrder();
    
    // Initialize product modal
    initProductModal();
    
    // Initialize shopping cart
    initCart();
    
    console.log('Order page loaded');
});
