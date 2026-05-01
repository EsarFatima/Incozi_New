# Backend API - INCOZI Consultation Platform

Express.js REST API server handling all business logic, database operations, and external integrations.

## Overview

This backend provides RESTful endpoints for:
- User authentication and authorization
- Service management and discovery
- Consultation booking and scheduling
- Stripe payment processing
- Real-time messaging with Socket.IO
- Document management and storage
- Admin dashboard and reporting

---

## Core Modules

| Module | Purpose |
|--------|---------|
| `auth.js` | User registration, login, JWT token validation, password reset |
| `services.js` | Create, read, update, delete consultation services |
| `consultations.js` | Book, cancel, reschedule, retrieve consultations |
| `payments.js` | Process Stripe payments, manage payment history |
| `paymentService.js` | Payment utilities and Stripe API helpers |
| `chat.js` | Real-time messaging with Socket.IO events |
| `documents.js` | File upload, retrieval, deletion |
| `dashboard.js` | Analytics, statistics, reporting data |
| `admin.js` | User management, moderation, system administration |
| `emailService.js` | Email notifications and transactional emails |

---

## Infrastructure

- `infrastructure/` - Database connection, MongoDB models, configuration
- `migrations/` - Database schema definitions and seed data

---

## API Endpoints

### Authentication
```
POST   /api/auth/register       - Register new user
POST   /api/auth/login          - User login (returns JWT)
POST   /api/auth/logout         - User logout
GET    /api/auth/profile        - Get current user profile
PUT    /api/auth/profile        - Update user profile
POST   /api/auth/forgot-password - Request password reset
POST   /api/auth/reset-password  - Reset password with token
```

### Services
```
GET    /api/services             - List all services (paginated)
GET    /api/services/:id         - Get service details
POST   /api/services             - Create new service (consultant)
PUT    /api/services/:id         - Update service (consultant)
DELETE /api/services/:id         - Delete service (consultant)
GET    /api/services/:id/reviews - Get service reviews
```

### Consultations
```
GET    /api/consultations                - List user's consultations
GET    /api/consultations/:id            - Get consultation details
POST   /api/consultations                - Book new consultation
PUT    /api/consultations/:id            - Update consultation
DELETE /api/consultations/:id            - Cancel consultation
GET    /api/consultations/:id/availability - Get consultant availability
```

### Payments
```
POST   /api/payments/create-intent       - Create Stripe payment intent
POST   /api/payments/confirm             - Confirm and process payment
GET    /api/payments/history             - Get user payment history
GET    /api/payments/:id                 - Get payment details
```

### Chat (Socket.IO)
```
socket.on('send_message')      - Send message to recipient
socket.on('receive_message')   - Receive incoming message
socket.on('typing')            - Typing indicator
socket.on('user_online')       - User online status
```

### Documents
```
GET    /api/documents                    - List user documents
POST   /api/documents/upload             - Upload new document
GET    /api/documents/:id                - Download document
DELETE /api/documents/:id                - Delete document
```

### Admin
```
GET    /api/admin/dashboard              - Admin dashboard statistics
GET    /api/admin/users                  - List all users
GET    /api/admin/users/:id              - User details
PUT    /api/admin/users/:id              - Edit user (admin)
DELETE /api/admin/users/:id              - Deactivate user (admin)
GET    /api/admin/consultations          - List all consultations
GET    /api/admin/payments               - Payment reports
GET    /api/admin/tickets                - Support tickets
POST   /api/admin/tickets/:id/resolve    - Resolve ticket
```

---

## Middleware

Located in `middleware.js`:

- **JWT Authentication** - Validates and decodes JWT tokens from Authorization header
- **Error Handler** - Centralized error handling with proper HTTP status codes
- **CORS** - Cross-Origin Resource Sharing configuration
- **Request Logging** - Logs incoming requests for debugging

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | Secret key for JWT signing |
| `STRIPE_SECRET_KEY` | Yes | Stripe API secret key |
| `EMAIL_SERVICE` | No | Email service provider (Nodemailer config) |
| `PORT` | No | Server port (default: 5000) |
| `NODE_ENV` | No | Environment type (development/production) |

---

## Database Models

MongoDB collections managed through Mongoose schemas:

- `User` - User accounts and profiles
- `Service` - Consultation services
- `Consultation` - Bookings and appointments
- `Payment` - Transaction records
- `Message` - Chat messages
- `Document` - Uploaded files
- `Review` - Service reviews
- `Subscription` - Plan subscriptions
- `Ticket` - Support tickets

---

## Error Handling

API returns standard JSON error responses:

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found
- `500` - Server error

---

## Development

### Start Server
```bash
npm run dev
```

### Run Tests
```bash
npm test
```

### Database Connection Test
```bash
node scripts/testMongoConnection.js
```

---

## Security

- JWT tokens expire after 24 hours
- Passwords hashed with bcrypt
- Sensitive data never logged
- SQL injection prevention through Mongoose ODM
- CORS enabled for frontend domain only
- Rate limiting on authentication endpoints

---

## Performance

- MongoDB indexes on frequently queried fields
- Pagination for large result sets
- Socket.IO connection pooling for real-time chat
- Email operations handled asynchronously
- Response caching where applicable