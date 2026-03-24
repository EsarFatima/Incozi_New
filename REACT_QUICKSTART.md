# INCOZI React App - Quick Start Guide

## 📦 Project Setup

Your INCOZI project has been converted to **React 18+ with Tailwind CSS**! Here's everything you need to know.

---

## ⚡ Quick Start (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

This starts:
- **React Frontend**: http://localhost:3000
- **Express Backend**: http://localhost:3000/api

### 3. Open in Browser
Navigate to `http://localhost:3000`

---

## 📂 File Structure Overview

```
Incozi/
├── src/
│   ├── index.jsx               ← React entry point
│   ├── App.jsx                 ← Main router
│   ├── index.css               ← Tailwind + global styles
│   │
│   ├── components/
│   │   ├── Header.jsx          ← Navigation
│   │   └── Footer.jsx          ← Footer
│   │
│   ├── pages/
│   │   ├── Home.jsx            ← Home page
│   │   ├── Services.jsx        ← Services page
│   │   ├── Consultation.jsx    ← Booking
│   │   ├── Dashboard.jsx       ← User dashboard
│   │   ├── Auth.jsx            ← Login/Register
│   │   ├── Checkout.jsx        ← Cart
│   │   ├── AdminPanel.jsx      ← Admin
│   │   └── NotFound.jsx        ← 404
│   │
│   ├── context/
│   │   └── AuthContext.jsx     ← Auth state
│   │
│   ├── hooks/
│   │   └── useAuth.js          ← Auth hook
│   │
│   └── services/
│       └── api.js              ← API client
│
├── public/
│   └── index.html              ← HTML entry point
│
├── tailwind.config.js          ← Tailwind theme
├── postcss.config.js           ← CSS processing
├── .env.local                  ← Environment vars
└── package.json                ← Dependencies
```

---

## 🎨 Tailwind CSS Colors

All styling uses Tailwind - no custom CSS files!

### Available Colors
```jsx
className="bg-primary-500"      // Brand color (blue-purple)
className="bg-accent-500"       // Secondary color (magenta)
className="text-success"        // Green for success
className="text-error"          // Red for errors
className="text-warning"        // Amber for warnings
className="bg-dark-900"         // Dark backgrounds
className="text-dark-600"       // Gray text
```

### Common Classes
```jsx
// Buttons
className="btn-primary"         // Blue button
className="btn-secondary"       // Magenta button
className="btn-outline"         // Outlined button

// Cards
className="card"                // White card with shadow

// Container
className="container-custom"    // Centered max-width container
```

### Responsive Design
```jsx
// Hidden on mobile, visible on desktop
className="hidden md:block"

// Different sizes at different screens
className="text-sm md:text-lg lg:text-xl"

// Responsive grid
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

---

## 🔐 Authentication

### Check User Login Status
```jsx
import { useAuth } from './hooks/useAuth';

function MyComponent() {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <p>Please log in</p>;
  }
  
  return <p>Welcome, {user.name}!</p>;
}
```

### Login Users
```jsx
const { login } = useAuth();

const handleLogin = async () => {
  const result = await login(email, password);
  if (result.success) {
    // User is logged in!
  }
};
```

---

## 📡 API Calls

### Fetch Services
```jsx
import { servicesService } from './services/api';

const response = await servicesService.list();
const services = response.data;
```

### Create Consultation
```jsx
import { consultationsService } from './services/api';

const result = await consultationsService.create({
  serviceId: 123,
  date: '2026-03-20',
  time: '10:00'
});
```

### Full API Reference
See `REACT_MIGRATION.md` for complete API methods.

---

## 🛣️ Adding New Pages

### 1. Create the Page Component
```jsx
// src/pages/MyPage.jsx

function MyPage() {
  return (
    <div>
      <section className="bg-dark-50 py-12">
        <div className="container-custom">
          <h1 className="text-4xl font-bold">My Page</h1>
        </div>
      </section>
    </div>
  );
}

export default MyPage;
```

### 2. Add Route in App.jsx
```jsx
import MyPage from './pages/MyPage';

<Routes>
  <Route path="/mypage" element={<MyPage />} />
</Routes>
```

### 3. Link to It
```jsx
import { Link } from 'react-router-dom';

<Link to="/mypage" className="btn-primary">
  Go to My Page
</Link>
```

---

## 🎯 Adding New Components

### Create Component
```jsx
// src/components/ServiceCard.jsx

function ServiceCard({ service }) {
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <img src={service.image} alt={service.name} className="w-full h-48 object-cover rounded-lg mb-4" />
      <h3 className="text-xl font-bold">{service.name}</h3>
      <p className="text-dark-600">{service.description}</p>
      <button className="btn-primary w-full mt-4">
        Learn More
      </button>
    </div>
  );
}

export default ServiceCard;
```

### Use in Page
```jsx
import ServiceCard from '../components/ServiceCard';

function Services() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {services.map(service => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}
```

---

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Both frontend & backend
npm run dev:frontend    # React only (port 3000)
npm run dev:backend     # Express only
npm run server          # Express production

# Production
npm run build           # Build React app
npm run eject           # (Advanced) Eject from Create React App

# Testing
npm test                # Run tests
```

---

## 🚀 Environment Variables

Create `.env.local` in the project root:

```
REACT_APP_API_URL=http://localhost:3000/api
```

Access in React:
```jsx
const apiUrl = process.env.REACT_APP_API_URL;
```

---

## 📚 Documentation Files

- **REACT_MIGRATION.md** - Complete React setup guide
- **README.md** - Project overview
- **package.json** - Dependencies and scripts

---

## ❓ Common Questions

### Q: How do I style a component?
**A:** Use Tailwind CSS classes only. No CSS files needed!

```jsx
<div className="flex items-center justify-between gap-4 p-6 bg-white rounded-lg shadow-base">
  Content
</div>
```

### Q: How do I make things responsive?
**A:** Use Tailwind's responsive prefixes:

```jsx
<div className="w-full md:w-1/2 lg:w-1/3">
  Responsive width
</div>
```

### Q: How do I call the backend API?
**A:** Use the API service:

```jsx
import { apiClient, servicesService } from './services/api';

const services = await servicesService.list();
```

### Q: How do I protect a page (require login)?
**A:** Use the useAuth hook:

```jsx
import { useAuth } from './hooks/useAuth';

function Dashboard() {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  
  return <div>Dashboard content</div>;
}
```

### Q: Can I use custom CSS?
**A:** Tailwind is recommended, but you can add styles in `src/index.css`:

```css
/* src/index.css */
.my-custom-class {
  /* Your styles */
}
```

---

## 🐛 Troubleshooting

### App won't start
1. Delete `node_modules`: `rm -r node_modules`
2. Clear cache: `npm cache clean --force`
3. Reinstall: `npm install`
4. Start: `npm run dev`

### Styles not showing
1. Check `tailwind.config.js` has correct file paths
2. Clear browser cache (Ctrl+Shift+Delete)
3. Restart dev server

### API calls failing
1. Check `.env.local` has correct URL
2. Ensure backend is running on port 3000/3001
3. Check network tab in DevTools for errors

---

## ✨ Next Steps

**Recommended Flow:**
1. ✅ Install dependencies (`npm install`)
2. ✅ Start dev server (`npm run dev`)
3. ✅ Explore the app in your browser
4. ✅ Look at `src/pages/Home.jsx` to understand structure
5. ✅ Create your first new component in `src/components/`
6. ✅ Add a new route in `src/App.jsx`
7. ✅ Read `REACT_MIGRATION.md` for advanced topics

---

## 📖 Learn More

- **React Docs**: https://react.dev
- **React Router**: https://reactrouter.com
- **Tailwind CSS**: https://tailwindcss.com
- **Axios**: https://axios-http.com

---

**Ready to build something amazing!** 🚀

Feel free to ask for help with:
- Adding new pages
- Creating components
- Styling elements
- API integration
- Authentication flows
- Deployment
