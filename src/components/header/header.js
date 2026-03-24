// src/components/header/header.js
// Header Component Logic

class Header {
  constructor() {
    this.header = document.querySelector('.header');
    this.mobileToggle = document.getElementById('mobileMenuToggle');
    this.userToggle = document.getElementById('userMenuToggle');
    this.userDropdown = document.getElementById('userDropdown');
    this.cartBadge = document.querySelector('[data-cart-count]');
    
    this.init();
  }

  init() {
    this.attachEventListeners();
    this.updateCartBadge();
  }

  attachEventListeners() {
    // Mobile menu toggle
    if (this.mobileToggle) {
      this.mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    // User menu toggle
    if (this.userToggle) {
      this.userToggle.addEventListener('click', () => this.toggleUserMenu());
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.header__user-menu')) {
        this.closeUserMenu();
      }
    });

    // Update cart badge when cart changes
    window.addEventListener('cart:updated', () => this.updateCartBadge());
  }

  toggleMobileMenu() {
    const nav = this.header.querySelector('.header__nav');
    if (nav) {
      nav.classList.toggle('show-mobile');
    }
  }

  toggleUserMenu() {
    this.userDropdown?.classList.toggle('hidden');
  }

  closeUserMenu() {
    this.userDropdown?.classList.add('hidden');
  }

  updateCartBadge() {
    if (!this.cartBadge) return;

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.length;
    
    this.cartBadge.textContent = count;
    this.cartBadge.style.display = count > 0 ? 'flex' : 'none';
  }

  /**
   * Close all header menus
   */
  closeAll() {
    this.closeUserMenu();
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  new Header();
});

export default Header;
