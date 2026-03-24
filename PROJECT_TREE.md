# INCOZI React Project Tree

Complete file structure after React 18 + Tailwind CSS conversion:

```
Incozi/
│
├── 📁 src/                                    Main source code
│   ├── 📄 index.jsx                          React entry point
│   ├── 📄 App.jsx                            Main router & layout
│   ├── 📄 index.css                          Global styles (Tailwind imports)
│   │
│   ├── 📁 components/                        Reusable UI components
│   │   ├── 📄 Header.jsx                     Navigation header
│   │   └── 📄 Footer.jsx                     Footer with links
│   │
│   ├── 📁 pages/                             Page components (one per route)
│   │   ├── 📄 Home.jsx                       Landing page
│   │   ├── 📄 Services.jsx                   Services listing
│   │   ├── 📄 Consultation.jsx               Consultation booking
│   │   ├── 📄 Dashboard.jsx                  User dashboard
│   │   ├── 📄 Auth.jsx                       Login/Register
│   │   ├── 📄 Checkout.jsx                   Shopping cart
│   │   ├── 📄 AdminPanel.jsx                 Admin section
│   │   └── 📄 NotFound.jsx                   404 page
│   │
│   ├── 📁 context/                           Global state management
│   │   └── 📄 AuthContext.jsx                Authentication context
│   │
│   ├── 📁 hooks/                             Custom React hooks
│   │   └── 📄 useAuth.js                     Auth hook
│   │
│   ├── 📁 services/                          API & external services
│   │   └── 📄 api.js                         Axios API client
│   │
│   └── 📁 assets/                            Static files
│       ├── 📁 images/
│       ├── 📁 icons/
│       └── 📁 fonts/
│
├── 📁 public/                                Public static files
│   └── 📄 index.html                         HTML entry point
│
├── 📁 backend/                               Express.js API
│   ├── 📄 server.js                          Main server file
│   ├── 📄 auth.js
│   ├── 📄 services.js
│   ├── 📄 consultations.js
│   ├── 📄 payments.js
│   ├── 📄 middleware.js
│   └── 📁 migrations/                        Database migrations
│
├── 📁 pages/                                 OLD: Legacy HTML pages
│   ├── 📄 index.html
│   ├── 📄 services.html
│   └── ... (keep for reference, migrate as needed)
│
├── 📁 assets/                                Static assets
│   ├── 📁 images/
│   └── 📁 uploads/
│
├── 📄 .env.local                             Environment variables (local)
├── 📄 .env.example                           Environment template
├── 📄 .gitignore                             Git ignore rules
├── 📄 tailwind.config.js                     Tailwind configuration
├── 📄 postcss.config.js                      PostCSS configuration
├── 📄 package.json                           Node.js dependencies & scripts
├── 📄 package-lock.json                      Locked dependency versions
│
├── 📄 README.md                              Project overview
├── 📄 REACT_QUICKSTART.md                    Quick start guide ⭐
├── 📄 REACT_MIGRATION.md                     Full React guide
├── 📄 PROJECT_STRUCTURE.md                   Structure explanation
├── 📄 STRUCTURE.md                           Advanced structure guide
└── 📄 server.js                              Express server startup
```

---

## Key File Descriptions

### Entry Points
- **`public/index.html`** - Static HTML root (mounting point for React)
- **`src/index.jsx`** - React root, renders App component
- **`src/App.jsx`** - Main component with router and layout

### Pages (Routes)
- **`src/pages/Home.jsx`** - Home page (/)
- **`src/pages/Services.jsx`** - Services listing (/services)
- **`src/pages/Consultation.jsx`** - Booking form (/consultation)
- **`src/pages/Dashboard.jsx`** - User dashboard (/dashboard)
- **`src/pages/Auth.jsx`** - Login/Register (/auth)
- **`src/pages/Checkout.jsx`** - Cart checkout (/checkout)
- **`src/pages/AdminPanel.jsx`** - Admin section (/admin)
- **`src/pages/NotFound.jsx`** - 404 page (/404)

### Layout Components
- **`src/components/Header.jsx`** - Navigation & top bar (used on all pages)
- **`src/components/Footer.jsx`** - Footer (used on all pages)

### State Management
- **`src/context/AuthContext.jsx`** - Manages auth state globally
- **`src/hooks/useAuth.js`** - Hook to access auth context

### API Communication
- **`src/services/api.js`** - Axios API client with methods for:
  - `authService` - Login, register, verify email
  - `servicesService` - List, get, search services
  - `consultationsService` - Create, update consultations
  - `paymentsService` - Stripe payments
  - `userService` - User profile
  - `adminService` - Admin dashboard

### Configuration
- **`tailwind.config.js`** - Tailwind theme (colors, spacing, etc)
- **`postcss.config.js`** - CSS processing pipeline
- **`.env.local`** - Local environment variables
- **`package.json`** - Dependencies and npm scripts

### Styling
- **`src/index.css`** - Global styles
  - Tailwind imports (@tailwind directives)
  - HTML/body reset and base styles
  - Custom component classes (@layer components)

### Backend
- **`server.js`** - Express server startup
- **`backend/`** - API routes and logic
  - `auth.js` - Authentication routes
  - `services.js` - Services API
  - `consultations.js` - Bookings API
  - `payments.js` - Payment processing
  - `middleware.js` - Express middleware

### Documentation
- **`REACT_QUICKSTART.md`** - Quick start guide (⭐ START HERE)
- **`REACT_MIGRATION.md`** - Complete React guide
- **`PROJECT_STRUCTURE.md`** - Structure explanation
- **`STRUCTURE.md`** - Old advanced structure guide
- **`README.md`** - Project overview

---

## Component Structure Example

Each component is a single `.jsx` file with:

```jsx
// src/components/ServiceCard.jsx

function ServiceCard({ service }) {
  return (
    <div className="card">
      {/* Content here using Tailwind classes */}
    </div>
  );
}

export default ServiceCard;
```

- **No separate CSS files** - Tailwind classes in JSX
- **One file per component** - Easy to locate and modify
- **Functional components** - Uses React hooks (useState, useEffect)

---

## Routing Overview

All routes defined in `src/App.jsx`:

| Route | Page | Component |
|-------|------|-----------|
| `/` | Home | `Home.jsx` |
| `/services` | Services | `Services.jsx` |
| `/consultation` | Book | `Consultation.jsx` |
| `/dashboard` | Dashboard | `Dashboard.jsx` |
| `/auth` | Login/Register | `Auth.jsx` |
| `/checkout` | Cart | `Checkout.jsx` |
| `/admin` | Admin Panel | `AdminPanel.jsx` |
| `/404` | Not Found | `NotFound.jsx` |
| `*` | 404 (catch-all) | Redirects to `/404` |

---

## Adding New Files

### Add a New Page
1. Create `src/pages/MyPage.jsx`
2. Add route in `src/App.jsx`:
   ```jsx
   <Route path="/mypage" element={<MyPage />} />
   ```

### Add a New Component
1. Create `src/components/MyComponent.jsx`
2. Import in a page:
   ```jsx
   import MyComponent from '../components/MyComponent';
   ```

### Add New API Methods
1. Open `src/services/api.js`
2. Add new service object or method:
   ```js
   export const myService = {
     getAll: () => apiClient.get('/my-endpoint'),
     create: (data) => apiClient.post('/my-endpoint', data),
   };
   ```
3. Use in a component:
   ```jsx
   const result = await myService.getAll();
   ```

---

## File Count & Size

```
Total Files:
├── JS/JSX files: 20
├── CSS files: 1 (index.css only)
├── HTML files: 1 (public/index.html)
├── Config files: 4 (tailwind, postcss, .env, package.json)
└── Documentation: 5

Total Organized:
✅ All code in 'src/' directory
✅ All styling via Tailwind (no separate CSS)
✅ Clear component hierarchy
✅ Centralized API service
✅ Global state management
```

---

## From Vanilla JS to React

### Before (Old Structure)
```
style.css                    (Global CSS)
script.js                    (Global JS)
pages/
  ├── index.html
  ├── services.html
  └── ...
```

### After (React Structure)
```
src/
├── App.jsx                  (Router + Layout)
├── index.css               (Tailwind imports)
├── components/             (Reusable UI)
├── pages/                  (Route pages)
├── services/api.js         (API client)
└── context/               (Global state)
```

**Benefits:**
✅ Components are reusable  
✅ No CSS conflicts (Tailwind)  
✅ Clear data flow (Context API)  
✅ Single source of API methods  
✅ Easy to maintain and extend  

---

## Tree Legend

| Symbol | Meaning |
|--------|---------|
| 📁 | Directory/Folder |
| 📄 | File |
| ⭐ | Important/Essential |
| ✅ | Created/Ready |

---

**Total Project Size: ~2-3 MB** (before node_modules)

**Start here:** Read `REACT_QUICKSTART.md` for getting started! 🚀
