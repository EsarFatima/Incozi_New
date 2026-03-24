# INCOZI Architecture Documentation

## Overview

Incozi is built using **Hexagonal Architecture** (Ports & Adapters pattern), which ensures clean separation of concerns and makes the codebase scalable, testable, and maintainable.

---

## Architecture Layers

### 1. **Domain Layer** (Core Business Logic)
- Pure business rules independent of frameworks
- No external dependencies
- Example: "A consultation can only be booked during consultant's available hours"

**Location:** Logic is embedded in service methods across application layer

---

### 2. **Application Layer** (Use Cases & Services)

This is where all business workflows are implemented. Each service handles a specific domain:

#### `backend/application/auth.js`
- User registration & login
- Email verification
- JWT token generation
- Password reset flows

#### `backend/application/consultations.js`
- Create consultation bookings
- Update booking status
- Cancel consultations
- Generate booking confirmations
- Send reminder emails

#### `backend/application/payments.js`
- Process payments via Stripe
- Generate invoices
- Track transactions
- Handle refunds

#### `backend/application/services.js`
- Manage service catalog
- Update availability
- Handle pricing

#### `backend/application/chat.js`
- Create conversations
- Send messages
- Manage file attachments
- Track read status

#### `backend/application/dashboard.js`
- Gather analytics
- Generate reports
- Track user metrics

---

### 3. **Adapter Layer** (External Systems)

Adapters convert between external systems and the application layer:

#### Database Adapter (`backend/infrastructure/database/`)
```javascript
// Abstract database operations
const User = require('./models/User');
await User.create({ email, password, ...});
```

**Why:** If you switch from Supabase to MongoDB later, you only change this layer, not the application logic.

#### Payment Adapter (`backend/infrastructure/payments/`)
```javascript
// Stripe integration
const stripe = require('stripe')(STRIPE_SECRET_KEY);
await stripe.paymentIntents.create({...});
```

**Why:** Can swap Stripe for Square without changing application code

#### Email Adapter (`backend/infrastructure/email/`)
```javascript
// Nodemailer integration
await sendEmail({ to, subject, html });
```

**Why:** Can switch to SendGrid without touching business logic

#### File Storage Adapter (`backend/infrastructure/storage/`)
```javascript
// Supabase storage
await supabase.storage.from('documents').upload(path, file);
```

**Why:** Can migrate to AWS S3 independently

#### Real-Time Adapter (`backend/infrastructure/realtime/`)
```javascript
// Socket.IO for WebSocket connections
io.on('connection', (socket) => {...});
```

**Why:** Could swap to WebSockets or other real-time solutions

---

### 4. **Controller/Route Layer** (HTTP Entry Points)

Exposes application services via REST API endpoints:

```
GET  /api/services           → services.listServices()
POST /api/consultations      → consultations.createBooking()
POST /api/payments/checkout  → payments.createPaymentIntent()
```

**Location:** Routes are defined in `server.js` and route handlers call application services

---

## Request Flow Diagram

```
┌─────────────────┐
│  HTTP Request   │
└────────┬────────┘
         │
         ▼
┌──────────────────────┐
│  Express Router      │  ← Receives request
│  (server.js)         │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  Middleware Layer    │  ← JWT verification
│  (middleware.js)     │  ← Error handling
└────────┬─────────────┘
         │
         ▼
┌──────────────────────────┐
│  Application Service     │  ← Contains business logic
│  (consultations.js)      │
└────────┬─────────────────┘
         │
    ┌────┴──────────────────────┬──────────────┐
    │                            │              │
    ▼                            ▼              ▼
┌────────────┐         ┌──────────────┐  ┌──────────────┐
│ Database   │         │ Stripe API   │  │ Email        │
│ Adapter    │         │ Adapter      │  │ Adapter      │
│(Supabase)  │         │ (payments)   │  │ (Nodemailer) │
└────────────┘         └──────────────┘  └──────────────┘
    │                            │              │
    └────┬──────────────────────┬──────────────┘
         │
         ▼
┌──────────────────────┐
│  HTTP Response       │  ← JSON response to client
└──────────────────────┘
```

---

## File Organization

```
backend/
│
├── infrastructure/                    # ADAPTER LAYER
│   ├── database/
│   │   ├── supabaseClient.js        # Supabase connection
│   │   └── queries.js                # Database helper functions
│   ├── payments/
│   │   └── stripeService.js          # Stripe integration
│   ├── email/
│   │   └── emailService.js           # Email service
│   ├── storage/
│   │   └── fileService.js            # File upload service
│   └── realtime/
│       └── socketIO.js               # WebSocket setup
│
├── application/                       # APPLICATION LAYER
│   ├── auth.js                       # Authentication logic
│   ├── consultations.js              # Booking workflows
│   ├── payments.js                   # Payment processing
│   ├── services.js                   # Service management
│   ├── chat.js                       # Messaging logic
│   ├── dashboard.js                  # Analytics
│   └── reviews.js                    # Review management
│
├── middleware.js                      # MIDDLEWARE LAYER
├── server.js                          # EXPRESS APP + ROUTES
├── migrations/                        # DATABASE SETUP
│   └── supabase_schema.sql
│
└── README.md
```

---

## Design Patterns Used

### 1. **Dependency Injection**
Services receive dependencies through parameters, not by importing them:

```javascript
// ❌ Bad - Tight coupling
const paymentService = require('./paymentService');
class Consultation {
  async book() {
    paymentService.charge(...);
  }
}

// ✅ Good - Loose coupling
class Consultation {
  constructor(paymentService) {
    this.paymentService = paymentService;
  }
  async book() {
    this.paymentService.charge(...);
  }
}
```

### 2. **Service Locator Pattern**
Application services handle business logic independently:

```javascript
// consultations.js
async function createBooking(clientId, serviceId, date) {
  // Business logic here - doesn't care about HTTP, DB, Stripe
  const cost = await calculatePrice(serviceId);
  const availability = await checkAvailability(serviceId, date);
  if (!availability) throw new Error('Not available');
  return { bookingId, cost, date };
}
```

### 3. **Repository Pattern** (Adapter Layer)
Abstract database operations:

```javascript
// supabaseClient.js - ONE place to change if switching databases
const consultationRepo = {
  create: async (data) => { /* Supabase call */ },
  findById: async (id) => { /* Supabase query */ },
  update: async (id, data) => { /* Supabase update */ },
};
```

---

## Adding New Features

Example: **Add Consultant Availability Calendar**

### Step 1: Define Domain Logic (Application Layer)
```javascript
// backend/application/availability.js
async function updateAvailability(consultantId, slots) {
  // Business rule: slots must not conflict
  // Business rule: slots must be in future
  validateSlots(slots);
  return store(consultantId, slots);
}
```

### Step 2: Create Adapter if Needed
```javascript
// backend/infrastructure/calendar/calendarService.js
// If using Google Calendar API for sync
```

### Step 3: Expose via Route
```javascript
// server.js
app.put('/api/availability', authenticateToken, async (req, res) => {
  const result = await availability.updateAvailability(req.user.id, req.body);
  res.json(result);
});
```

### Step 4: No changes needed to existing services! ✅

---

## Testing Strategy

Each layer is independently testable:

### Unit Tests (Application Layer)
```javascript
// Test business logic without databases
describe('Consultations', () => {
  it('should not book unavailable slots', () => {
    // Call application function with mock data
    // assert business rules
  });
});
```

### Integration Tests (Full Stack)
```javascript
// Test with real Supabase
describe('Booking API', () => {
  it('should create booking and charge payment', async () => {
    const response = await request(app)
      .post('/api/consultations')
      .send(bookingData);
    expect(response.status).toBe(201);
  });
});
```

---

## Database Schema Alignment

The Supabase schema ensures referential integrity:

```
users (Clients, Consultants, Admins)
  ├── services (Consultants offer services)
  │   ├── consultations (Clients book services)
  │   │   ├── payments (Payment per consultation)
  │   │   └── documents (Files attached)
  │   └── reviews (Ratings)
  ├── messages (Real-time chat)
  ├── subscriptions (Plan info)
  └── profiles (Extended user data)
```

**No orphaned records possible** - Foreign keys enforce consistency

---

## Scaling Considerations

### Horizontal Scaling
- **Database:** Supabase handles auto-scaling
- **API:** Deploy multiple instances, use load balancer
- **Real-time:** Socket.IO adapters (Redis) for cross-instance messaging

### Caching Layer
```javascript
// Could add Redis for frequently accessed data
const cache = require('redis').createClient();
const services = cache.get('services') || fetchFromDB();
```

### API Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
```

---

## Security Architecture

### Authentication Flow
```
Frontend sends (email, password)
    ↓
backend/auth.js: verify password with bcrypt
    ↓
Generate JWT token containing userId, role
    ↓
Return token to client
```

### Authorization Flow
```
Frontend sends request + JWT token
    ↓
middleware.js: verify token signature
    ↓
Extract userId, role from token
    ↓
Check permissions (middleware.requireAdmin, etc.)
    ↓
Allow/Deny request
```

### Row-Level Security (Database Level)
Supabase RLS policies:
```sql
-- Only users can see their own data
CREATE POLICY "Users see own data"
  ON users FOR SELECT
  USING (auth.uid() = id);
```

---

## Environment Configuration

All external system credentials stored in `.env`:

```
.env (development) - Local testing
.env.production - Production deployment
```

**Never commit .env file to Git!**

```bash
# .gitignore
.env
.env.local
.env.production
```

---

## Deployment Architecture

```
┌──────────────┐          ┌────────────────┐
│   Vercel     │ requests │  Render/       │
│   Frontend   │ ◄─────► │  Railway       │
│   Static     │          │  Backend       │
│   HTML/CSS/JS│          │  Node.js       │
└──────────────┘          └────────┬───────┘
       │                           │
       │                    ┌──────▼────────┐
       │                    │  Supabase     │
       │                    │  PostgreSQL   │
       │                    │  Cloud DB     │
       │                    │  + Auth       │
       │                    │  + Storage    │
       │                    └───────────────┘
       │
       └──────────────────────────────────
              Stripe Webhooks
              Email Service
```

---

## Summary: Why Hexagonal Architecture?

| Benefit | Example |
|---------|---------|
| **Testability** | Mock Stripe API without calling real API |
| **Flexibility** | Switch Supabase to MongoDB in adapter layer |
| **Readability** | Business logic separated from technical details |
| **Maintainability** | Changes to one layer don't affect others |
| **Scalability** | Easy to add new features without breaking existing code |
| **Professionalism** | Industry-standard pattern used at top tech companies |

---

**Next:** See [backend/README.md](README.md) for API documentation
