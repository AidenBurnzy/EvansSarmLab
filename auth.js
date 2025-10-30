// VitaSyn Labs Authentication Module
// Place this file in your root directory

const API_URL = '/.netlify/functions'; // Change this if using different backend

class Auth {
  constructor() {
    this.token = localStorage.getItem('vitasyn_token');
    this.user = JSON.parse(localStorage.getItem('vitasyn_user') || 'null');
  }

  // Register new user
  async register(email, password, firstName, lastName, phone) {
    try {
      const response = await fetch(`${API_URL}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'register',
          email, 
          password, 
          firstName, 
          lastName, 
          phone 
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.token) {
        this.token = data.token;
        this.user = data.user;
        localStorage.setItem('vitasyn_token', data.token);
        localStorage.setItem('vitasyn_user', JSON.stringify(data.user));
        await this.syncCart();
      }
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      return { error: 'Registration failed. Please try again.' };
    }
  }

  // Login user
  async login(email, password) {
    try {
      const response = await fetch(`${API_URL}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'login',
          email, 
          password 
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.token) {
        this.token = data.token;
        this.user = data.user;
        localStorage.setItem('vitasyn_token', data.token);
        localStorage.setItem('vitasyn_user', JSON.stringify(data.user));
        await this.syncCart();
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      return { error: 'Login failed. Please try again.' };
    }
  }

  // Logout user
  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('vitasyn_token');
    localStorage.removeItem('vitasyn_user');
    localStorage.removeItem('peptide_cart');
  }

  // Check if user is logged in
  isLoggedIn() {
    return !!this.token;
  }

  // Get authorization headers
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
  }

  // Sync local cart to database
  async syncCart() {
    if (!this.isLoggedIn()) return;

    const localCart = JSON.parse(localStorage.getItem('peptide_cart') || '[]');
    
    if (localCart.length === 0) return;

    try {
      for (const item of localCart) {
        await fetch(`${API_URL}/cart`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify({
            action: 'add',
            productId: item.id,
            productName: item.name,
            productPrice: item.price,
            productImage: item.image,
            productPermalink: item.permalink,
            quantity: item.quantity
          })
        });
      }

      // Clear local cart after sync
      localStorage.removeItem('peptide_cart');
    } catch (error) {
      console.error('Cart sync error:', error);
    }
  }

  // Load cart from database
  async loadCart() {
    if (!this.isLoggedIn()) {
      const localCart = JSON.parse(localStorage.getItem('peptide_cart') || '[]');
      return localCart;
    }

    try {
      const response = await fetch(`${API_URL}/cart?action=get`, {
        headers: this.getHeaders()
      });
      
      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Load cart error:', error);
      return [];
    }
  }

  // Add to cart
  async addToCart(product, quantity = 1) {
    if (!this.isLoggedIn()) {
      // Save to localStorage if not logged in
      const cart = JSON.parse(localStorage.getItem('peptide_cart') || '[]');
      const existing = cart.find(item => item.id === product.id);
      
      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.push({ 
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0]?.src || null,
          permalink: product.permalink,
          quantity 
        });
      }
      
      localStorage.setItem('peptide_cart', JSON.stringify(cart));
      return { success: true };
    }

    try {
      const response = await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          action: 'add',
          productId: product.id,
          productName: product.name,
          productPrice: product.price || 0,
          productImage: product.images?.[0]?.src || null,
          productPermalink: product.permalink,
          quantity
        })
      });
      
      return await response.json();
    } catch (error) {
      console.error('Add to cart error:', error);
      return { error: 'Failed to add item to cart' };
    }
  }

  // Update cart item quantity
  async updateCartItem(itemId, quantity) {
    if (!this.isLoggedIn()) {
      const cart = JSON.parse(localStorage.getItem('peptide_cart') || '[]');
      const item = cart.find(i => i.id === itemId);
      
      if (item) {
        if (quantity <= 0) {
          const filtered = cart.filter(i => i.id !== itemId);
          localStorage.setItem('peptide_cart', JSON.stringify(filtered));
        } else {
          item.quantity = quantity;
          localStorage.setItem('peptide_cart', JSON.stringify(cart));
        }
      }
      return { success: true };
    }

    try {
      const response = await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          action: 'update',
          itemId,
          quantity
        })
      });
      
      return await response.json();
    } catch (error) {
      console.error('Update cart error:', error);
      return { error: 'Failed to update cart' };
    }
  }

  // Remove from cart
  async removeFromCart(itemId) {
    if (!this.isLoggedIn()) {
      const cart = JSON.parse(localStorage.getItem('peptide_cart') || '[]');
      const filtered = cart.filter(item => item.id !== itemId);
      localStorage.setItem('peptide_cart', JSON.stringify(filtered));
      return { success: true };
    }

    try {
      const response = await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          action: 'remove',
          itemId
        })
      });
      
      return await response.json();
    } catch (error) {
      console.error('Remove from cart error:', error);
      return { error: 'Failed to remove item' };
    }
  }

  // Clear cart
  async clearCart() {
    if (!this.isLoggedIn()) {
      localStorage.removeItem('peptide_cart');
      return { success: true };
    }

    try {
      const response = await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          action: 'clear'
        })
      });
      
      return await response.json();
    } catch (error) {
      console.error('Clear cart error:', error);
      return { error: 'Failed to clear cart' };
    }
  }

  // Create order
  async createOrder(shippingAddress, billingAddress, paymentMethod) {
    if (!this.isLoggedIn()) {
      return { error: 'Please login to create an order' };
    }

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          action: 'create',
          shippingAddress,
          billingAddress,
          paymentMethod
        })
      });
      
      return await response.json();
    } catch (error) {
      console.error('Create order error:', error);
      return { error: 'Failed to create order' };
    }
  }

  // Get all orders
  async getOrders() {
    if (!this.isLoggedIn()) return [];

    try {
      const response = await fetch(`${API_URL}/orders?action=list`, {
        headers: this.getHeaders()
      });
      
      const data = await response.json();
      return data.orders || [];
    } catch (error) {
      console.error('Get orders error:', error);
      return [];
    }
  }

  // Get single order
  async getOrder(orderId) {
    if (!this.isLoggedIn()) return null;

    try {
      const response = await fetch(`${API_URL}/orders?action=get&orderId=${orderId}`, {
        headers: this.getHeaders()
      });
      
      const data = await response.json();
      return data.order || null;
    } catch (error) {
      console.error('Get order error:', error);
      return null;
    }
  }

  // Get user profile
  async getProfile() {
    if (!this.isLoggedIn()) return null;

    try {
      const response = await fetch(`${API_URL}/user?action=profile`, {
        headers: this.getHeaders()
      });
      
      const data = await response.json();
      return data.user || null;
    } catch (error) {
      console.error('Get profile error:', error);
      return null;
    }
  }

  // Update user profile
  async updateProfile(firstName, lastName, phone) {
    if (!this.isLoggedIn()) return { error: 'Not logged in' };

    try {
      const response = await fetch(`${API_URL}/user`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          action: 'update',
          firstName,
          lastName,
          phone
        })
      });
      
      const data = await response.json();
      
      if (data.user) {
        this.user = data.user;
        localStorage.setItem('vitasyn_user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      return { error: 'Failed to update profile' };
    }
  }
}

// Create global auth instance
const auth = new Auth();