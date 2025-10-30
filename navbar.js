// Navbar functionality - works on all pages

// Load cart from localStorage
function loadNavbarCart() {
    const savedCart = localStorage.getItem('peptide_cart');
    const cart = savedCart ? JSON.parse(savedCart) : [];
    updateNavbarCartCount(cart);
}

// Update cart count badge in navbar
function updateNavbarCartCount(cart) {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        if (totalItems > 0) {
            cartCount.classList.remove('hidden');
        } else {
            cartCount.classList.add('hidden');
        }
    }
}

// Initialize navbar after it's loaded
function initializeNavbar() {
    console.log('Initializing navbar...');
    
    // Initialize cart count
    loadNavbarCart();
    
    // Cart icon click - redirect to order page if not already there
    const cartIcon = document.getElementById('cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            const currentPage = window.location.pathname;
            if (currentPage.includes('order.html')) {
                // If on order page, open cart sidebar (handled by order.js)
                const event = new CustomEvent('openCart');
                document.dispatchEvent(event);
            } else {
                // Otherwise, go to order page
                window.location.href = 'order.html#cart';
            }
        });
        console.log('Cart icon initialized');
    }
    
    // Profile icon click - check login status and redirect accordingly
    const profileIcon = document.getElementById('profile-icon');
    if (profileIcon) {
        profileIcon.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Check if user is logged in
            const token = localStorage.getItem('vitasyn_token');
            const currentPage = window.location.pathname;
            
            if (currentPage.includes('order.html')) {
                // If on order page, toggle dropdown (handled by order.js)
                const event = new CustomEvent('toggleProfile');
                document.dispatchEvent(event);
            } else if (token) {
                // User is logged in, go to account page
                window.location.href = 'account.html';
            } else {
                // User not logged in, show login menu
                showProfileMenu(e);
            }
        });
        console.log('Profile icon initialized');
    }
    
    // Track My Order link
    const trackOrderLinks = document.querySelectorAll('a[href="#track-order"]');
    trackOrderLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Track Order functionality coming soon!\n\nYou will be able to:\n• Track your shipment\n• View order history\n• Check order status');
        });
    });
    
    console.log('Navbar initialization complete');
}

// Simple profile menu for pages other than order.html
function showProfileMenu(event) {
    // Remove any existing menu
    const existingMenu = document.getElementById('simple-profile-menu');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }
    
    const menu = document.createElement('div');
    menu.id = 'simple-profile-menu';
    menu.style.cssText = `
        position: fixed;
        top: 170px;
        right: 40px;
        background: #fff;
        border: 2px solid #000;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        min-width: 250px;
        z-index: 3500;
    `;
    
    menu.innerHTML = `
        <div style="padding: 25px; text-align: center; background: #000; color: #fff;">
            <div style="width: 50px; height: 50px; margin: 0 auto 12px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            </div>
            <p style="font-size: 13px; letter-spacing: 1.5px; margin: 0;">Welcome, Guest</p>
        </div>
        <div style="padding: 10px 0;">
            <div style="height: 1px; background: #e0e0e0; margin: 10px 0;"></div>
            <a href="login.html" style="display: block; padding: 12px 20px; color: #000; text-decoration: none; font-size: 13px; letter-spacing: 1.5px; font-weight: 600; transition: background 0.3s;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='transparent'">SIGN IN</a>
            <a href="register.html" style="display: block; padding: 12px 20px; color: #000; text-decoration: none; font-size: 13px; letter-spacing: 1.5px; transition: background 0.3s;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='transparent'">CREATE ACCOUNT</a>
        </div>
    `;
    
    document.body.appendChild(menu);
    
    // Close on click outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target) && e.target.id !== 'profile-icon') {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);
    
    // Close on escape
    document.addEventListener('keydown', function closeOnEscape(e) {
        if (e.key === 'Escape') {
            menu.remove();
            document.removeEventListener('keydown', closeOnEscape);
        }
    });
}

// Load navbar HTML and initialize
function loadNavbar() {
    fetch('navbar.html')
        .then(r => r.text())
        .then(html => {
            const temp = document.createElement('div');
            temp.innerHTML = html;
            const navbar = temp.querySelector('nav');
            if (navbar) {
                const container = document.getElementById('navbar-container');
                if (container) {
                    container.appendChild(navbar);
                    initializeNavbar();
                }
            }
        })
        .catch(err => console.error('Error loading navbar:', err));
}

// Auto-load navbar if navbar-container exists
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('navbar-container')) {
            loadNavbar();
        }
    });
} else {
    if (document.getElementById('navbar-container')) {
        loadNavbar();
    }
}
