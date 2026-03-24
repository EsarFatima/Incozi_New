# INCOZI Advanced Project Structure - Quick Reference

## Directory Tree

```
Incozi/
│
├── src/                              ← All source code here
│   ├── components/                   ← Reusable UI Components
│   │   ├── header/
│   │   │   ├── header.html          ← Component HTML
│   │   │   ├── header.css           ← Component styles
│   │   │   └── header.js            ← Component logic
│   │   ├── footer/
│   │   ├── navigation/
│   │   ├── sidebar/
│   │   └── common/                   ← Shared components
│   │       ├── modal.css
│   │       ├── modal.js
│   │       └── button.css
│   │
│   ├── pages/                        ← Page-Specific Code
│   │   ├── home/
│   │   │   ├── home.html
│   │   │   ├── home.css
│   │   │   ├── home.js
│   │   │   └── index.html            ← Entry point
│   │   ├── services/
│   │   ├── consultation/
│   │   ├── dashboard/
│   │   ├── admin/
│   │   ├── auth/
│   │   └── checkout/
│   │
│   ├── styles/                       ← Global Stylesheets
│   │   ├── main.css                  ← Entry point (imports all)
│   │   ├── variables.css             ← CSS vars & theme
│   │   ├── reset.css                 ← Browser reset
│   │   ├── typography.css            ← Font & text
│   │   ├── layout.css                ← Flex, grid, spacing
│   │   ├── responsive.css            ← Media queries
│   │   └── utilities.css             ← Utility classes
│   │
│   ├── js/                           ← Shared JavaScript
│   │   ├── main.js                   ← Entry point
│   │   ├── config.js                 ← Configuration
│   │   ├── api.js                    ← API client
│   │   ├── utils.js                  ← Helper functions
│   │   ├── router.js                 ← Page routing
│   │   └── modules/                  ← Feature modules
│   │       ├── auth.js               ← Auth logic
│   │       ├── services.js           ← Service logic
│   │       ├── bookings.js
│   │       ├── payments.js
│   │       ├── chat.js
│   │       └── dashboard.js
│   │
│   └── assets/                       ← Static assets
│       ├── images/
│       ├── icons/
│       ├── fonts/
│       └── uploads/
│
├── backend/                          ← Node.js API
├── pages/                            ← OLD: Keep for migration
├── public/                           ← Compiled HTML (generated)
├── STRUCTURE.md                      ← This structure doc
├── server.js
├── script.js                         ← OLD: Migrate to src/js/
├── style.css                         ← OLD: Migrate to src/styles/
└── README.md
```

---

## File Naming Convention

### Components
```javascript
src/components/[component-name]/
  ├── [component-name].html
  ├── [component-name].css
  └── [component-name].js
```

Examples:
- `src/components/header/header.*`
- `src/components/footer/footer.*`
- `src/components/service-card/service-card.*`

### Pages
```javascript
src/pages/[page-name]/
  ├── [page-name].html
  ├── [page-name].css
  ├── [page-name].js
  └── index.html  (← Entry point)
```

Examples:
- `src/pages/home/`
- `src/pages/consultation/`
- `src/pages/dashboard/`

### Modules
```javascript
src/js/modules/[feature-name].js
```

Examples:
- `src/js/modules/auth.js`
- `src/js/modules/services.js`
- `src/js/modules/payments.js`

---

## CSS Architecture (BEM Convention)

### Block
```css
.header { }
.button { }
.service-card { }
```

### Element
```css
.header__logo { }
.header__nav { }
.button__text { }
.service-card__image { }
```

### Modifier
```css
.button--primary { }
.button--small { }
.header__nav--mobile { }
```

---

## JavaScript Module Pattern

### Service Module
```javascript
// src/js/modules/payments.js

const PaymentsModule = (() => {
  // Private methods
  const processPayment = async (data) => { ... };
  
  // Public API
  return {
    create: processPayment,
    refund: async (id) => { ... },
    getHistory: async () => { ... },
  };
})();

export default PaymentsModule;
```

### Component Class
```javascript
// src/components/header/header.js

class Header {
  constructor() {
    this.element = document.querySelector('.header');
    this.init();
  }
  
  init() { ... }
  attachEventListeners() { ... }
  render() { ... }
}

export default Header;
```

---

## Importing Files

### Import CSS in Main
```css
/* src/styles/main.css */
@import url('./variables.css');
@import url('./reset.css');
@import url('./layout.css');
```

### Import JS in Main
```javascript
// src/js/main.js
import CONFIG from './config.js';
import API from './api.js';
import AuthModule from './modules/auth.js';
import ServicesModule from './modules/services.js';
```

### Import Components
```javascript
// In a page component
import Header from '../components/header/header.js';

const header = new Header();
```

---

## Server Configuration

### Serve Files
```javascript
// server.js

app.use(express.static(path.join(__dirname, 'src')));
app.use(express.static(path.join(__dirname, 'public')));
```

### URL Mapping
```
http://localhost:3000/index.html           → src/pages/home/index.html
http://localhost:3000/services.html        → src/pages/services/index.html
http://localhost:3000/js/main.js           → src/js/main.js
http://localhost:3000/styles/main.css      → src/styles/main.css
```

---

## Migration Checklist

- [ ] Move all HTML from `pages/` to `src/pages/[name]/`
- [ ] Extract CSS from `style.css` to `src/styles/`
  - [ ] Variables → `variables.css`
  - [ ] Reset → `reset.css`
  - [ ] Typography → `typography.css`
  - [ ] Layout → `layout.css`
  - [ ] Responsive → `responsive.css`
- [ ] Extract JS from `script.js` to `src/js/`
  - [ ] Config → `config.js`
  - [ ] API → `api.js`
  - [ ] Utils → `utils.js`
  - [ ] Auth → `modules/auth.js`
  - [ ] Services → `modules/services.js`
- [ ] Create reusable components in `src/components/`
  - [ ] Header
  - [ ] Footer
  - [ ] Navigation
  - [ ] Sidebar
- [ ] Create main entry point in `src/js/main.js`
- [ ] Update `server.js` to serve from `src/`

---

## File Linking in HTML

### Link Stylesheets
```html
<link rel="stylesheet" href="/styles/main.css">
```

### Link Scripts
```html
<script src="/js/main.js" type="module"></script>
```

### Import in JavaScript
```javascript
import Header from './components/header/header.js';
import { formatDate } from './utils.js';
```

---

## VS Code Extensions (Recommended)

- **Live Server** - Live reload
- **CSS Peek** - CSS preview
- **ES7+ React/Redux/React-Native snippets** - JS snippets
- **Prettier** - Code formatter
- **ESLint** - Linting

---

## Build Tools (Optional)

For production, consider:
- **Vite** - Fast bundler
- **Webpack** - Module bundler
- **Parcel** - Zero-config bundler

But NOT needed initially - the modular structure works without build tools!

---

## Benefits of This Structure

✅ **Modular** - Each file has one job  
✅ **Reusable** - Components shared across pages  
✅ **Scalable** - Easy to add features  
✅ **Maintainable** - Clear organization  
✅ **Collaborative** - Teams can work in parallel  
✅ **Professional** - Enterprise-grade setup  

---

## Examples

### Component Usage
```html
<!-- In any page -->
<div id="header"></div>

<script type="module">
  import Header from './components/header/header.js';
  const header = new Header();
</script>
```

### API Usage
```javascript
import API from './api.js';

const services = await API.services.list();
const booked = await API.consultations.create(data);
const paid = await API.payments.checkout(cardData);
```

### Authentication
```javascript
import AuthModule from './modules/auth.js';

const result = await AuthModule.login(email, password);
if (AuthModule.isAuthenticated()) {
  // Show dashboard
}
```

---

**Ready to build a professional web application!** 🚀
