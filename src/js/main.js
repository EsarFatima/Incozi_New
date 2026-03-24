// src/js/main.js
// Main Application Entry Point

import CONFIG from './config.js';
import API from './api.js';
import AuthModule from './modules/auth.js';
import ServicesModule from './modules/services.js';
import { showNotification, debounce } from './utils.js';

// ===== APPLICATION INITIALIZATION =====

class IncozApp {
  constructor() {
    this.config = CONFIG;
    this.api = API;
    this.auth = AuthModule;
    this.services = ServicesModule;
    this.isInitialized = false;
  }

  /**
   * Initialize application
   */
  async init() {
    console.log('🚀 Initializing INCOZI Application...');

    try {
      // Check authentication
      this.checkAuth();

      // Setup event listeners
      this.setupEventListeners();

      // Initialize components
      await this.initializeComponents();

      // Setup Socket.IO if enabled
      if (this.config.features.socketIO) {
        this.setupSocket();
      }

      this.isInitialized = true;
      console.log('✅ INCOZI Application initialized successfully');
    } catch (error) {
      console.error('❌ Application initialization failed:', error);
      showNotification('Failed to initialize application', 'error');
    }
  }

  /**
   * Check authentication status
   */
  checkAuth() {
    const isAuth = this.auth.isAuthenticated();
    const currentPage = window.location.pathname;

    // Protected pages
    const protectedPages = ['/dashboard', '/admin', '/profile'];
    const isProtectedPage = protectedPages.some(page => currentPage.includes(page));

    if (isProtectedPage && !isAuth) {
      window.location.href = '/account.html?redirect=' + currentPage;
    }
  }

  /**
   * Setup global event listeners
   */
  setupEventListeners() {
    // Search debounce
    const searchInput = document.querySelector('[data-search]');
    if (searchInput) {
      searchInput.addEventListener(
        'input',
        debounce((e) => this.handleSearch(e), 300)
      );
    }

    // Logout button
    const logoutBtn = document.querySelector('[data-logout]');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.handleLogout());
    }

    // Session timeout warning
    this.setupSessionTimeout();
  }

  /**
   * Initialize application components
   */
  async initializeComponents() {
    // Load user profile if authenticated
    if (this.auth.isAuthenticated()) {
      try {
        const profile = await this.api.user.profile();
        this.updateUserUI(profile);
      } catch (error) {
        console.warn('Could not load user profile:', error);
      }
    }

    // Load services on service pages
    const servicesContainer = document.querySelector('[data-services]');
    if (servicesContainer) {
      await this.loadServices();
    }
  }

  /**
   * Load and display services
   */
  async loadServices() {
    try {
      const services = await this.services.getServices();
      this.renderServices(services);
    } catch (error) {
      console.error('Error loading services:', error);
      showNotification('Failed to load services', 'error');
    }
  }

  /**
   * Render services
   */
  renderServices(services) {
    const container = document.querySelector('[data-services]');
    if (!container) return;

    container.innerHTML = services.map(service => `
      <div class="service-card" data-service-id="${service.id}">
        <img src="${service.image_url}" alt="${service.name}" class="service-card__image">
        <h3 class="service-card__title">${service.name}</h3>
        <p class="service-card__category">${service.category}</p>
        <p class="service-card__price">$${service.base_price}</p>
        <button class="button button--primary" onclick="app.selectService('${service.id}')">
          Book Now
        </button>
      </div>
    `).join('');
  }

  /**
   * Handle search
   */
  async handleSearch(e) {
    const query = e.target.value;
    if (query.length < 2) return;

    try {
      const results = await this.services.searchServices(query);
      this.renderServices(results);
    } catch (error) {
      console.error('Search error:', error);
    }
  }

  /**
   * Handle logout
   */
  async handleLogout() {
    try {
      await this.auth.logout();
      showNotification('Logged out successfully', 'success');
      window.location.href = '/index.html';
    } catch (error) {
      console.error('Logout error:', error);
      showNotification('Logout failed', 'error');
    }
  }

  /**
   * Update UI with user information
   */
  updateUserUI(profile) {
    const userNameEl = document.querySelector('[data-user-name]');
    const userRoleEl = document.querySelector('[data-user-role]');

    if (userNameEl) {
      userNameEl.textContent = `${profile.first_name} ${profile.last_name}`;
    }
    if (userRoleEl) {
      userRoleEl.textContent = profile.role.toUpperCase();
    }
  }

  /**
   * Setup Socket.IO for real-time features
   */
  setupSocket() {
    // Socket.IO will be initialized when real-time features are needed
    console.log('💬 Socket.IO ready for real-time communication');
  }

  /**
   * Setup session timeout
   */
  setupSessionTimeout() {
    let timeout;

    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        console.warn('Session timeout');
        this.auth.logout();
        showNotification('Your session has expired', 'warning');
      }, this.config.timeouts.sessionTimeout);
    };

    // Reset on user activity
    ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
      document.addEventListener(event, resetTimeout, true);
    });

    resetTimeout();
  }

  /**
   * Select a service (for booking)
   */
  selectService(serviceId) {
    window.location.href = `/order-wizard.html?service_id=${serviceId}`;
  }
}

// ===== APPLICATION BOOT =====

let app;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  app = new IncozApp();
  await app.init();
});

// Export for global access
window.app = app;
export default IncozApp;
