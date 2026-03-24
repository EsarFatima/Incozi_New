# INCOZI Advanced Project Structure

This document explains the new **component-based modular architecture** for INCOZI.

---

## Project Structure

```
Incozi/
├── src/                              ← Source code (new structure)
│   ├── components/                   ← Reusable components
│   │   ├── header/
│   │   │   ├── header.html          ← Component markup
│   │   │   ├── header.css           ← Component styles
│   │   │   └── header.js            ← Component logic
│   │   ├── footer/
│   │   │   ├── footer.html
│   │   │   ├── footer.css
│   │   │   └── footer.js
│   │   ├── navigation/
│   │   │   ├── navigation.html
│   │   │   ├── navigation.css
│   │   │   └── navigation.js
│   │   ├── sidebar/
│   │   │   ├── sidebar.html
│   │   │   ├── sidebar.css
│   │   │   └── sidebar.js
│   │   └── common/                   ← Shared components
│   │       ├── modal.css
│   │       ├── modal.js
│   │       ├── button.css
│   │       └── ...
│   │
│   ├── pages/                        ← Page-specific code
│   │   ├── home/
│   │   │   ├── home.html             ← Page markup
│   │   │   ├── home.css              ← Page styles
│   │   │   └── home.js               ← Page logic
│   │   ├── services/
│   │   │   ├── services.html
│   │   │   ├── services.css
│   │   │   ├── services.js
│   │   │   └── index.html            ← Compiled entry point
│   │   ├── consultation/
│   │   │   ├── consultation.html
│   │   │   ├── consultation.css
│   │   │   ├── consultation.js
│   │   │   └── index.html
│   │   ├── dashboard/
│   │   │   ├── dashboard.html
│   │   │   ├── dashboard.css
│   │   │   ├── dashboard.js
│   │   │   └── index.html
│   │   ├── admin/
│   │   │   ├── admin.html
│   │   │   ├── admin.css
│   │   │   ├── admin.js
│   │   │   └── index.html
│   │   ├── auth/
│   │   │   ├── auth.html
│   │   │   ├── auth.css
│   │   │   ├── auth.js
│   │   │   └── index.html
│   │   └── checkout/
│   │       ├── checkout.html
│   │       ├── checkout.css
│   │       ├── checkout.js
│   │       └── index.html
│   │
│   ├── styles/                       ← Global stylesheets
│   │   ├── main.css                  ← Main entry point
│   │   ├── variables.css             ← CSS variables & theme
│   │   ├── reset.css                 ← Browser reset
│   │   ├── typography.css            ← Font styles
│   │   ├── layout.css                ← Grid & flex layouts
│   │   ├── responsive.css            ← Media queries
│   │   └── utilities.css             ← Utility classes
│   │
│   ├── js/                           ← Shared JavaScript
│   │   ├── main.js                   ← Entry point
│   │   ├── config.js                 ← Configuration
│   │   ├── api.js                    ← API client
│   │   ├── auth.js                   ← Auth utilities
│   │   ├── utils.js                  ← Helper functions
│   │   ├── router.js                 ← Page routing
│   │   └── modules/                  ← Feature modules
│   │       ├── services.js           ← Services logic
│   │       ├── bookings.js           ← Bookings logic
│   │       ├── payments.js           ← Payments logic
│   │       ├── chat.js               ← Chat logic
│   │       └── dashboard.js          ← Dashboard logic
│   │
│   └── assets/                       ← Static assets
│       ├── images/
│       ├── icons/
│       ├── fonts/
│       └── uploads/
│
├── backend/                          ← Backend API (Node.js)
│   ├── infrastructure/
│   ├── application/
│   ├── migrations/
│   └── ...
│
├── public/                           ← Compiled HTML (root level)
│   ├── index.html                    ← Built from src/pages/home/
│   ├── services.html                 ← Built from src/pages/services/
│   ├── consultation.html             ← Built from src/pages/consultation/
│   ├── dashboard.html                ← Built from src/pages/dashboard/
│   └── ...
│
├── build/                            ← Build scripts
│   ├── build.js                      ← Compilation script
│   └── serve.js                      ← Local dev server
│
├── server.js                         ← Main Express server
├── package.json
├── .env.example
├── STRUCTURE.md                      ← This file
└── README.md
```

---

## Key Principles

### 1. **Component Isolation**
Each component/page has its own:
- **HTML** - Component markup
- **CSS** - Scoped styles (prefixed with component name)
- **JavaScript** - Component-specific logic

### 2. **Single Responsibility**
Each file has ONE clear purpose:
- `header.js` only handles header logic
- `services.js` page only displays services
- `payments.js` module only handles payments

### 3. **Reusable Components**
Common UI elements go in `src/components/common/`:
- Modal dialogs
- Buttons
- Forms
- Cards
- Breadcrumbs

### 4. **Global Assets**
Shared resources in `src/styles/` and `src/js/`:
- CSS variables (colors, spacing, fonts)
- API client
- Authentication utilities
- Helper functions

---

## Component Anatomy

Each component/page follows this pattern:

### HTML (`header.html`)
```html
<!-- Keep markup minimal and semantic -->
<header class="header">
  <div class="header__container">
    <h1 class="header__logo">INCOZI</h1>
    <nav class="header__nav"></nav>
  </div>
</header>
```

### CSS (`header.css`)
```css
/* Use BEM naming convention */
.header {
  background: var(--primary-color);
  padding: var(--spacing-md);
}

.header__container {
  display: flex;
  justify-content: space-between;
}

.header__logo {
  font-size: var(--font-lg);
}

.header__nav {
  display: flex;
  gap: var(--spacing-sm);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .header__container {
    flex-direction: column;
  }
}
```

### JavaScript (`header.js`)
```javascript
// Component class/module
class Header {
  constructor() {
    this.element = document.querySelector('.header');
    this.init();
  }

  init() {
    this.attachEventListeners();
    this.render();
  }

  attachEventListeners() {
    // Handle click events, etc.
  }

  render() {
    // Update DOM if needed
  }
}

// Export for reuse
export default Header;
```

---

## File Organization Guide

### When to Create a New Component

**Create a component if:**
- UI element used in multiple pages
- Complex functionality that needs isolation
- Reusable across the application

**Examples:**
- `Header` (appears on all pages)
- `Footer` (appears on all pages)
- `Modal` (alerts, confirmations)
- `Form` (login, registration)

### When to Create a Page

**Create a page if:**
- Complete screen/route in the app
- Specific user workflow
- Distinct functionality

**Examples:**
- `Home` (landing page)
- `Services` (service listing)
- `Dashboard` (user workspace)
- `Admin` (management interface)

### When to Create a Module

**Create a module if:**
- Business logic used across multiple pages
- API interactions
- Data management

**Examples:**
- `services.js` - Fetch & manage services
- `bookings.js` - Create & manage bookings
- `payments.js` - Payment operations
- `auth.js` - Authentication flow

---

## Style Architecture (CSS)

### 1. **CSS Variables** (`variables.css`)
```css
:root {
  /* Colors */
  --primary-color: #667eea;
  --accent-color: #764ba2;
  --success-color: #48bb78;
  --error-color: #ef4444;
  --text-100: #1a202c;
  --text-200: #4a5568;
  --bg-100: #ffffff;
  --bg-200: #f7fafc;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Typography */
  --font-sm: 0.875rem;
  --font-md: 1rem;
  --font-lg: 1.125rem;
  --font-xl: 1.25rem;

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
}
```

### 2. **Reset** (`reset.css`)
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: var(--text-100);
  background: var(--bg-100);
}
```

### 3. **BEM Naming Convention**
```css
/* Block */
.button { }

/* Element (block__element) */
.button__text { }

/* Modifier (block--modifier) */
.button--primary { }
.button--small { }

/* Combined */
.button--primary__text { }
```

---

## JavaScript Architecture

### 1. **Main Entry Point** (`main.js`)
```javascript
import Header from '../components/header/header.js';
import Footer from '../components/footer/footer.js';
import Navigation from '../components/navigation/navigation.js';
import { initRouter } from './router.js';
import { initAuth } from './auth.js';

// Initialize shared components
const header = new Header();
const footer = new Footer();
const nav = new Navigation();

// Initialize features
initAuth();
initRouter();

console.log('✅ INCOZI app initialized');
```

### 2. **Module Pattern** (`modules/payments.js`)
```javascript
const PaymentsModule = (() => {
  // Private methods
  const chargeCard = async (cardData) => {
    const response = await fetch('/api/payments/checkout', {
      method: 'POST',
      body: JSON.stringify(cardData),
    });
    return response.json();
  };

  // Public API
  return {
    processPayment: chargeCard,
    getPaymentHistory: async () => {
      // Fetch
    },
    refundPayment: async (transactionId) => {
      // Process refund
    },
  };
})();

export default PaymentsModule;
```

### 3. **API Client** (`api.js`)
```javascript
const API = {
  baseURL: process.env.API_URL || 'http://localhost:3000',

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`,
        ...options.headers,
      },
      ...options,
    });
    return response.json();
  },

  // Service methods
  services: {
    list: () => API.request('/api/services'),
    get: (id) => API.request(`/api/services/${id}`),
    create: (data) => API.request('/api/services', { method: 'POST', body: JSON.stringify(data) }),
  },

  bookings: {
    list: () => API.request('/api/consultations'),
    create: (data) => API.request('/api/consultations', { method: 'POST', body: JSON.stringify(data) }),
  },

  payments: {
    checkout: (data) => API.request('/api/payments/checkout', { method: 'POST', body: JSON.stringify(data) }),
  },

  getToken: () => localStorage.getItem('auth_token'),
};

export default API;
```

---

## Build & Compilation

### Development
```bash
npm run dev
```

Starts a local server with:
- Live reload
- SCSS compilation
- Source maps for debugging

### Production Build
```bash
npm run build
```

Creates optimized files:
- Minified CSS
- Minified JavaScript
- Optimized images
- Sourcemap removal

---

## Advantages of This Structure

| Feature | Benefit |
|---------|---------|
| **Modularity** | Each file has one responsibility |
| **Reusability** | Components shared across pages |
| **Scalability** | Easy to add new pages/components |
| **Maintainability** | Clear file organization |
| **Testability** | Isolated logic easier to test |
| **Performance** | CSS/JS can be tree-shaken, minified |
| **Developer Experience** | Clear where to add features |
| **Collaboration** | Multiple developers work on different components |

---

## Migration Guide

### Step 1: Move Existing Files

```bash
# Copy current HTML to src/pages/
cp pages/index.html src/pages/home/index.html
cp pages/consultation.html src/pages/consultation/index.html
# ... etc
```

### Step 2: Extract Component CSS

```css
/* Old: style.css contains everything */
/* New: Split into modular files */

src/styles/
├── main.css (imports all below)
├── variables.css
├── reset.css
├── typography.css
├── layout.css
├── responsive.css
└── utilities.css
```

### Step 3: Extract Component JavaScript

```javascript
/* Old: script.js contains all logic */
/* New: Split into modules */

src/js/
├── main.js (entry point)
├── modules/
│   ├── services.js
│   ├── bookings.js
│   ├── payments.js
│   └── ...
```

### Step 4: Update Server.js

```javascript
// Serve from public/ and src/ directories
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'src')));
```

---

## Example: Adding a New Feature

### 1. Create Component Directory
```bash
mkdir -p src/components/service-card
```

### 2. Create Component Files

**service-card.html:**
```html
<div class="service-card">
  <img class="service-card__image" src="" alt="">
  <h3 class="service-card__title"></h3>
  <p class="service-card__price"></p>
  <button class="service-card__btn">Book Now</button>
</div>
```

**service-card.css:**
```css
.service-card {
  border: 1px solid var(--text-200);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  transition: transform 0.3s ease;
}

.service-card:hover {
  transform: translateY(-4px);
}
```

**service-card.js:**
```javascript
class ServiceCard {
  constructor(data) {
    this.data = data;
  }

  render() {
    const html = `<div class="service-card">...</div>`;
    return html;
  }
}
```

### 3. Use in a Page

```javascript
import ServiceCard from '../components/service-card/service-card.js';

const services = await API.services.list();
services.forEach(service => {
  const card = new ServiceCard(service);
  document.querySelector('.services-grid').innerHTML += card.render();
});
```

---

## Summary

| Aspect | Structure |
|--------|-----------|
| **HTML** | `src/pages/[page-name]/index.html` + `src/components/[component-name]/` |
| **CSS** | `src/styles/` (global) + component-specific `.css` |
| **JavaScript** | `src/js/` (modules) + component-specific `.js` |
| **Assets** | `src/assets/` (images, icons, fonts) |
| **Backend** | `backend/` (Node.js API) |
| **Build Output** | `public/` (compiled HTML) |

---

**Result:** Professional, scalable, enterprise-grade project structure! 🚀

See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for quick reference.
