# INCOZI React + Tailwind CSS Migration Guide

## ✅ Conversion Complete

The INCOZI project has been successfully converted from vanilla JavaScript to **React 18+ with Tailwind CSS**, featuring:
- 📦 React functional components with hooks
- 🎨 Tailwind CSS for styling (no custom CSS files)
- 🛣️ React Router for page navigation
- 🔐 Context API for global state management
- 📡 Axios for API client
- ⚙️ Environment-based configuration

---

## 📁 New Project Structure

```
Incozi/
├── public/
│   └── index.html                    ← React entry point
├── src/
│   ├── index.jsx                     ← React root
│   ├── index.css                     ← Tailwind imports + global styles
│   ├── App.jsx                       ← Main router component
│   │
│   ├── components/
│   │   ├── Header.jsx                ← Navigation header
│   │   ├── Footer.jsx                ← Page footer
│   │   └── ...                       ← Other UI components
│   │
│   ├── pages/
│   │   ├── Home.jsx                  ← Home page
│   │   ├── Services.jsx              ← Services listing
│   │   ├── Consultation.jsx          ← Booking page
│   │   ├── Dashboard.jsx             ← User dashboard
│   │   ├── AdminPanel.jsx            ← Admin section
│   │   ├── Auth.jsx                  ← Login/Register
│   │   ├── Checkout.jsx              ← Cart checkout
│   │   └── NotFound.jsx              ← 404 page
│   │
│   ├── context/
│   │   └── AuthContext.jsx           ← Auth global state
│   │
│   ├── hooks/
│   │   └── useAuth.js                ← Custom auth hook
│   │
│   ├── services/
│   │   └── api.js                    ← API client with methods
│   │
│   ├── styles/
│   │   └── (None needed - Tailwind only)
│   │
│   └── assets/
│       └── (Images, fonts, etc.)
│
├── tailwind.config.js                ← Tailwind theme configuration
├── postcss.config.js                 ← PostCSS configuration
├── .env.local                        ← Environment variables
├── package.json                      ← React + dependencies
├── server.js                         ← Express backend (unchanged)
└── backend/                          ← Node.js API (unchanged)
```

---

## 🚀 Getting Started

### Install Dependencies
```bash
npm install
```

### Run Development Server (Both Frontend & Backend)
```bash
npm run dev
```

This starts:
- React dev server on `http://localhost:3000`
- Express backend on `http://localhost:3000` (API routes)

### Build for Production
```bash
npm run build
```

### Run Backend Only
```bash
npm run server
```

### Run React Frontend Only
```bash
npm run dev:frontend
```

---

## 🎨 Tailwind CSS Setup

### Pre-configured Colors
Colors are defined in `tailwind.config.js`:

```js
// Usage in JSX
<div className="bg-primary-500 text-white">
  Primary color button
</div>

<div className="text-accent-600">
  Accent color text
</div>

<div className="text-success">
  Success message
</div>
```

**Color Palette:**
- **Primary**: #667eea (blue-purple) - Main brand color
- **Accent**: #d946ef (magenta) - Secondary brand color
- **Secondary**: #764ba2 (purple)
- **Success**: #10b981 (green)
- **Warning**: #f59e0b (amber)
- **Error**: #ef4444 (red)
- **Dark**: Various shades for text/backgrounds

### Responsive Breakpoints
```jsx
<div className="text-sm md:text-lg lg:text-xl">
  Responsive text size
</div>

<div className="w-full md:w-1/2 lg:w-1/3">
  Responsive width
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  Responsive grid
</div>
```

**Breakpoints:**
- **sm**: 640px
- **md**: 768px (tablet)
- **lg**: 1024px (desktop)
- **xl**: 1280px
- **2xl**: 1536px

### Pre-built Component Classes

```jsx
// Buttons
<button className="btn-primary">Primary Button</button>
<button className="btn-secondary">Secondary Button</button>
<button className="btn-outline">Outline Button</button>

// Cards
<div className="card">
  Content here
</div>

// Container
<div className="container-custom">
  Max-width 7xl with responsive padding
</div>
```

---

## 🔧 Component Structure

### Creating a New Component

```jsx
// src/components/ServiceCard.jsx

function ServiceCard({ service }) {
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <img 
        src={service.image} 
        alt={service.name}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h3 className="text-xl font-bold mb-2">{service.name}</h3>
      <p className="text-dark-600 mb-4">{service.description}</p>
      <button className="btn-primary w-full">
        Learn More
      </button>
    </div>
  );
}

export default ServiceCard;
```

### Creating a New Page

```jsx
// src/pages/Blog.jsx

import React, { useEffect, useState } from 'react';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data
    setLoading(false);
  }, []);

  if (loading) return <div className="flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div></div>;

  return (
    <div>
      <section className="bg-dark-50 py-12">
        <div className="container-custom">
          <h1 className="text-4xl font-bold">Blog</h1>
        </div>
      </section>

      <section className="py-16">
        <div className="container-custom">
          {/* Content here */}
        </div>
      </section>
    </div>
  );
}

export default Blog;
```

---

## 🔐 Authentication

### Using the Auth Context

```jsx
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { isAuthenticated, user, login, logout } = useAuth();

  const handleLogin = async () => {
    const result = await login(email, password);
    if (result.success) {
      // User logged in
    }
  };

  if (!isAuthenticated) {
    return <p>Please log in</p>;
  }

  return (
    <div>
      Welcome, {user.name}!
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protected Routes

```jsx
// In App.jsx

import ProtectedRoute from './components/ProtectedRoute';

<Routes>
  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
  <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminPanel /></ProtectedRoute>} />
</Routes>
```

*(Create ProtectedRoute component as needed)*

---

## 📡 API Calls

### Using the API Service

```jsx
import { servicesService, consultationsService } from '../services/api';

function MyComponent() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await servicesService.list();
        setServices(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    loadServices();
  }, []);

  return (
    // Render services
  );
}
```

### Available API Methods

**Authentication:**
```js
authService.login(email, password)
authService.register(userData)
authService.logout()
authService.verifyEmail(code)
authService.resetPassword(email)
```

**Services:**
```js
servicesService.list(filters)
servicesService.get(id)
servicesService.create(data)
servicesService.update(id, data)
servicesService.delete(id)
servicesService.search(query)
```

**Consultations:**
```js
consultationsService.list(filters)
consultationsService.get(id)
consultationsService.create(data)
consultationsService.updateStatus(id, status)
consultationsService.cancel(id)
```

**Payments:**
```js
paymentsService.checkout(data)
paymentsService.confirm(paymentIntentId)
paymentsService.history()
paymentsService.refund(id)
```

**User:**
```js
userService.getProfile()
userService.updateProfile(data)
userService.changePassword(data)
userService.getServices()
```

**Admin:**
```js
adminService.getDashboard()
adminService.getUsers(filters)
adminService.getConsultations(filters)
adminService.getPayments(filters)
```

---

## 🛣️ Routing

### Define Routes in App.jsx

```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/services" element={<Services />} />
  <Route path="/consultation" element={<Consultation />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/admin" element={<AdminPanel />} />
  <Route path="/auth" element={<Auth />} />
  <Route path="/checkout" element={<Checkout />} />
  <Route path="*" element={<Navigate to="/404" replace />} />
</Routes>
```

### Navigate Between Pages

```jsx
import { Link, useNavigate } from 'react-router-dom';

// Using Link (no page reload)
<Link to="/services" className="btn-primary">
  View Services
</Link>

// Using navigate (programmatic)
const navigate = useNavigate();

const handleClick = () => {
  navigate('/dashboard');
};
```

---

## 🎯 Key Features

### Modal/Dialog Example
```jsx
const [isOpen, setIsOpen] = useState(false);

return (
  <>
    <button onClick={() => setIsOpen(true)}>Open Dialog</button>
    
    {isOpen && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="card max-w-md">
          <h2 className="text-2xl font-bold mb-4">Dialog Title</h2>
          <p className="text-dark-600 mb-6">Dialog content</p>
          <button 
            onClick={() => setIsOpen(false)}
            className="btn-primary"
          >
            Close
          </button>
        </div>
      </div>
    )}
  </>
);
```

### Loading States
```jsx
const [loading, setLoading] = useState(false);

if (loading) {
  return (
    <div className="flex justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>
  );
}
```

### Form Handling
```jsx
const [formData, setFormData] = useState({
  name: '',
  email: '',
});

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e) => {
  e.preventDefault();
  // Submit form
};

return (
  <form onSubmit={handleSubmit} className="space-y-4">
    <div>
      <label className="block text-sm font-semibold mb-1">Name</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
    </div>
    <button type="submit" className="btn-primary">
      Submit
    </button>
  </form>
);
```

---

## 📋 Migration Checklist

If migrating old content to React:

- [ ] Convert HTML pages to React components in `src/pages/`
- [ ] Extract CSS classes and convert to Tailwind
- [ ] Move JavaScript event handlers to React state/hooks
- [ ] Update API calls to use the API service
- [ ] Implement authentication with useAuth hook
- [ ] Test all routes with React Router
- [ ] Update environment variables in `.env.local`
- [ ] Build and test production build
- [ ] Deploy to Vercel (frontend) or your hosting provider

---

## 🚢 Deployment

### Frontend (Vercel)

1. **Build the React app:**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel:**
   ```bash
   npm i -g vercel
   vercel
   ```

3. **Set environment variables in Vercel:**
   ```
   REACT_APP_API_URL=https://your-backend.com/api
   ```

### Backend (Render/Heroku)

Backend remains unchanged - deploy `server.js` as usual.

---

## 🎓 Learning Resources

- **React Docs**: https://react.dev
- **React Router**: https://reactrouter.com
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Axios**: https://axios-http.com/docs

---

## 🆘 Common Issues

### Port conflict
If port 3000 is busy:
```bash
PORT=3001 npm run dev
```

### CSS not loading
Ensure `tailwind.config.js` content paths are correct:
```js
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
]
```

### API errors
Check `.env.local`:
```
REACT_APP_API_URL=http://localhost:3000/api
```

### Build size too large
Use production build and code splitting:
```bash
npm run build
npm install -g serve
serve -s build
```

---

## ✨ What's Next?

- [ ] Add more components (modals, carousels, etc.)
- [ ] Implement Socket.IO for real-time chat
- [ ] Add form validation library
- [ ] Implement error boundary
- [ ] Add unit & integration tests
- [ ] Set up CI/CD pipeline
- [ ] Optimize images and bundle size
- [ ] Add PWA support

**Happy coding!** 🎉
