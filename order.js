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
    
    document.addEventListener('click', (e) => {
        if (e.target.closest('#cart-icon') || e.target.closest('.cart-icon')) {
            e.preventDefault();
            openCart();
        }
    });
    
    const closeBtn = document.getElementById('cart-close');
    if (closeBtn) closeBtn.addEventListener('click', closeCart);
    
    const overlay = document.getElementById('cart-overlay');
    if (overlay) overlay.addEventListener('click', closeCart);
    
    const continueBtn = document.getElementById('cart-continue');
    if (continueBtn) continueBtn.addEventListener('click', closeCart);
    
    const checkoutBtn = document.getElementById('cart-checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            alert('Checkout functionality coming soon!');
        });
    }
    
    document.addEventListener('keydown', (e) => {
        const cartSidebar = document.getElementById('cart-sidebar');
        if (e.key === 'Escape' && cartSidebar && !cartSidebar.classList.contains('hidden')) {
            closeCart();
        }
    });
}

// Stack definitions
const STACK_DEFINITIONS = {
    wolverine: {
        keywords: ['BPC', 'TB-500', 'TB500', 'Ipamorelin', 'CJC', 'MK-677', 'MK677', 'Growth', 'Recovery'],
        maxProducts: 4,
        fallbackToAny: true
    },
    glow: {
        keywords: ['GHK', 'Epithalon', 'NAD', 'Melanotan', 'Collagen', 'Peptide', 'Anti-aging', 'Skin'],
        maxProducts: 4,
        fallbackToAny: true
    }
};

// Load products
async function loadAllProducts() {
    const productGrid = document.getElementById('product-grid');
    
    if (productGrid) {
        productGrid.innerHTML = `
            <div class="loading-spinner" style="grid-column: 1 / -1;">
                <div class="spinner"></div>
            </div>
        `;
    }
    
    try {
        const url = `${WOOCOMMERCE_URL}/wp-json/wc/v3/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&per_page=100&status=publish`;
        const response = await fetch(url);

        if (!response.ok) throw new Error(`API Error: ${response.status}`);

        const products = await response.json();
        allProducts = products;
        filteredProducts = products;
        
        displayAllProducts(products);
        displayStackProducts();
    } catch (error) {
        console.error('Error loading products:', error);
        displayError();
    }
}

// Display all products
function displayAllProducts(products) {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;

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
}

// Create product card
function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    
    const imageUrl = product.images && product.images.length > 0 ? product.images[0].src : null;
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
    
    productCard.addEventListener('click', () => openProductModal(product));
    return productCard;
}

// Create stack product card
function createStackProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'stack-product-card';
    
    const imageUrl = product.images && product.images.length > 0 ? product.images[0].src : null;
    const price = product.price || '0.00';
    
    productCard.innerHTML = `
        <div class="stack-product-image">
            ${imageUrl ? 
                `<img src="${imageUrl}" alt="${product.name}" loading="lazy">` :
                `<div class="stack-product-placeholder">PEPTIDE IMAGE</div>`
            }
        </div>
        <div class="stack-product-info">
            <h4 class="stack-product-name">${product.name}</h4>
            <p class="stack-product-price">$${price}</p>
        </div>
    `;
    
    productCard.addEventListener('click', () => openProductModal(product));
    return productCard;
}

// Display stack products
function displayStackProducts() {
    displayWolverineStack();
    displayGlowStack();
}

function displayWolverineStack() {
    const container = document.getElementById('wolverine-products');
    if (!container) return;

    const products = filterProductsForStack(STACK_DEFINITIONS.wolverine);
    
    if (products.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px;">
                <p style="color: #1a5490; letter-spacing: 2px;">STACK PRODUCTS COMING SOON</p>
            </div>
        `;
        return;
    }

    container.innerHTML = '';
    products.forEach(product => container.appendChild(createStackProductCard(product)));
}

function displayGlowStack() {
    const container = document.getElementById('glow-products');
    if (!container) return;

    const products = filterProductsForStack(STACK_DEFINITIONS.glow);
    
    if (products.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px;">
                <p style="color: #c9a961; letter-spacing: 2px;">STACK PRODUCTS COMING SOON</p>
            </div>
        `;
        return;
    }

    container.innerHTML = '';
    products.forEach(product => container.appendChild(createStackProductCard(product)));
}

function filterProductsForStack(stackDef) {
    if (!allProducts || allProducts.length === 0) return [];
    
    const matched = allProducts.filter(product => {
        const name = product.name.toLowerCase();
        return stackDef.keywords.some(kw => name.includes(kw.toLowerCase()));
    });
    
    if (matched.length === 0 && stackDef.fallbackToAny) {
        return allProducts.slice(0, stackDef.maxProducts);
    }
    
    return matched.slice(0, stackDef.maxProducts);
}

// Search
function initSearch() {
    const searchInput = document.getElementById('product-search');
    const searchBtn = document.getElementById('search-btn');
    
    if (!searchInput || !searchBtn) return;

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
    
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(performSearch, 500);
    });
}

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
        const desc = product.description ? product.description.toLowerCase() : '';
        return name.includes(searchTerm) || desc.includes(searchTerm);
    });
    
    displayAllProducts(filteredProducts);
}

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

// Product Modal
let currentProduct = null;

function openProductModal(product) {
    currentProduct = product;
    const modal = document.getElementById('product-modal');
    if (!modal) return;
    
    const modalImage = document.getElementById('modal-product-image');
    const modalName = document.getElementById('modal-product-name');
    const modalPrice = document.getElementById('modal-product-price');
    const modalDescription = document.getElementById('modal-product-description');
    
    if (product.images && product.images.length > 0) {
        modalImage.src = product.images[0].src;
        modalImage.style.display = 'block';
    }
    
    modalName.textContent = product.name;
    modalPrice.textContent = `$${product.price || '0.00'}`;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = product.short_description || product.description || 'No description available.';
    modalDescription.textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
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
    if (!modal) return;
    
    const closeBtn = document.getElementById('modal-close');
    const overlay = document.getElementById('modal-overlay');
    const addToCartBtn = document.getElementById('modal-add-to-cart');
    
    if (closeBtn) closeBtn.addEventListener('click', closeProductModal);
    if (overlay) overlay.addEventListener('click', closeProductModal);
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            if (currentProduct) {
                addToCart(currentProduct);
                closeProductModal();
            }
        });
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeProductModal();
        }
    });
}

// Load components
function loadComponents() {
    fetch('navbar.html')
        .then(r => r.text())
        .then(html => {
            const temp = document.createElement('div');
            temp.innerHTML = html;
            const navbar = temp.querySelector('nav');
            if (navbar) document.getElementById('navbar-container').appendChild(navbar);
        });
    
    fetch('footer.html')
        .then(r => r.text())
        .then(html => {
            const temp = document.createElement('div');
            temp.innerHTML = html;
            const footer = temp.querySelector('footer');
            if (footer) document.getElementById('footer-container').appendChild(footer);
        });
}

// Helper functions
function initAgeGate() {
    const ageGate = document.querySelector('.age-gate');
    if (!ageGate) return null;

    const yesBtn = document.getElementById('age-verify-yes');
    const noBtn = document.getElementById('age-verify-no');

    const closeGate = () => {
        ageGate.classList.add('hidden');
        document.body.classList.remove('notice-locked');
    };

    const openGate = () => {
        ageGate.classList.remove('hidden');
        document.body.classList.add('notice-locked');
    };

    yesBtn.addEventListener('click', closeGate);
    noBtn.addEventListener('click', () => {
        const message = ageGate.querySelector('.age-gate-message');
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

    notice.classList.remove('hidden');
    document.body.classList.add('notice-locked');

    continueBtn.addEventListener('click', () => {
        notice.classList.add('hidden');
        document.body.classList.remove('notice-locked');
        if (typeof onContinue === 'function') onContinue();
    });

    exitBtn.addEventListener('click', () => {
        const message = notice.querySelector('.notice-message');
        message.classList.remove('hidden');
        continueBtn.disabled = true;
        exitBtn.disabled = true;
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    const openAgeGate = initAgeGate();
    initResearchNotice(openAgeGate);
    
    loadComponents();
    loadAllProducts();
    initSearch();
    initProductModal();
    initCart();
    
    console.log('Order page loaded');
});