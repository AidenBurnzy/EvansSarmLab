// Local Development Authentication
// This version uses localStorage instead of Neon database for easy local testing

class Auth {
  constructor() {
    this.token = localStorage.getItem('vitasyn_token');
    this.user = JSON.parse(localStorage.getItem('vitasyn_user') || 'null');
  }

  // Register new user (LOCAL VERSION - stores in browser)
  async register(email, password, firstName, lastName, phone) {
    try {
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('vitasyn_users') || '[]');
      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (existingUser) {
        return { error: 'Email already registered' };
      }
      
      // Create new user
      const newUser = {
        id: Date.now(),
        email: email.toLowerCase(),
        password: password, // In production, this would be hashed
        firstName,
        lastName,
        phone: phone || '',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      
      // Save user
      users.push(newUser);
      localStorage.setItem('vitasyn_users', JSON.stringify(users));
      
      // Generate fake token
      const token = 'local_token_' + Date.now();
      
      // Save session
      this.token = token;
      this.user = {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phone: newUser.phone
      };
      
      localStorage.setItem('vitasyn_token', token);
      localStorage.setItem('vitasyn_user', JSON.stringify(this.user));
      
      return {
        success: true,
        token,
        user: this.user
      };
    } catch (error) {
      console.error('Registration error:', error);
      return { error: 'Registration failed. Please try again.' };
    }
  }

  // Login user (LOCAL VERSION)
  async login(email, password) {
    try {
      const users = JSON.parse(localStorage.getItem('vitasyn_users') || '[]');
      const user = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === password
      );
      
      if (!user) {
        return { error: 'Invalid email or password' };
      }
      
      // Update last login
      user.lastLogin = new Date().toISOString();
      const userIndex = users.findIndex(u => u.id === user.id);
      users[userIndex] = user;
      localStorage.setItem('vitasyn_users', JSON.stringify(users));
      
      // Generate token
      const token = 'local_token_' + Date.now();
      
      // Save session
      this.token = token;
      this.user = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone
      };
      
      localStorage.setItem('vitasyn_token', token);
      localStorage.setItem('vitasyn_user', JSON.stringify(this.user));
      
      return {
        success: true,
        token,
        user: this.user
      };
    } catch (error) {
      console.error('Login error:', error);
      return { error: 'Login failed. Please try again.' };
    }
  }

  // Update user profile (LOCAL VERSION)
  async updateProfile(firstName, lastName, phone) {
    try {
      if (!this.isLoggedIn()) {
        return { error: 'Not logged in' };
      }
      
      const users = JSON.parse(localStorage.getItem('vitasyn_users') || '[]');
      const userIndex = users.findIndex(u => u.id === this.user.id);
      
      if (userIndex === -1) {
        return { error: 'User not found' };
      }
      
      // Update user
      users[userIndex].firstName = firstName;
      users[userIndex].lastName = lastName;
      users[userIndex].phone = phone;
      
      localStorage.setItem('vitasyn_users', JSON.stringify(users));
      
      // Update session
      this.user.firstName = firstName;
      this.user.lastName = lastName;
      this.user.phone = phone;
      localStorage.setItem('vitasyn_user', JSON.stringify(this.user));
      
      return {
        success: true,
        user: this.user
      };
    } catch (error) {
      console.error('Update error:', error);
      return { error: 'Update failed' };
    }
  }

  // Get user profile (LOCAL VERSION)
  async getProfile() {
    try {
      if (!this.isLoggedIn()) {
        return { error: 'Not logged in' };
      }
      
      const users = JSON.parse(localStorage.getItem('vitasyn_users') || '[]');
      const user = users.find(u => u.id === this.user.id);
      
      if (!user) {
        return { error: 'User not found' };
      }
      
      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        }
      };
    } catch (error) {
      console.error('Get profile error:', error);
      return { error: 'Failed to load profile' };
    }
  }

  // Logout user
  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('vitasyn_token');
    localStorage.removeItem('vitasyn_user');
  }

  // Check if user is logged in
  isLoggedIn() {
    return !!this.token && !!this.user;
  }

  // Get authorization headers (for compatibility)
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
  }

  // Get orders (LOCAL VERSION - returns mock data)
  async getOrders() {
    if (!this.isLoggedIn()) {
      return { error: 'Not logged in' };
    }
    
    // Return mock orders for testing
    const orders = JSON.parse(localStorage.getItem('vitasyn_orders_' + this.user.id) || '[]');
    
    return {
      orders: orders
    };
  }

  // Create order (LOCAL VERSION)
  async createOrder(orderData) {
    if (!this.isLoggedIn()) {
      return { error: 'Not logged in' };
    }
    
    const orders = JSON.parse(localStorage.getItem('vitasyn_orders_' + this.user.id) || '[]');
    
    const newOrder = {
      id: Date.now(),
      orderNumber: 'ORD-' + Date.now(),
      status: 'pending',
      totalAmount: orderData.totalAmount,
      items: orderData.items,
      createdAt: new Date().toISOString(),
      trackingNumber: null
    };
    
    orders.push(newOrder);
    localStorage.setItem('vitasyn_orders_' + this.user.id, JSON.stringify(orders));
    
    return {
      success: true,
      order: newOrder
    };
  }
}
