# Backend

Node.js + Express API server for Incozi consultation platform.

## Structure

- `auth.js` - Authentication and user management
- `services.js` - Consultation service management
- `consultations.js` - Booking and consultation handling
- `payments.js` - Stripe payment integration
- `paymentService.js` - Payment utilities
- `chat.js` - Real-time chat with Socket.IO
- `documents.js` - Document upload/management
- `dashboard.js` - Dashboard analytics
- `admin.js` - Admin functions
- `middleware.js` - Express middleware (JWT, CORS, error handling)
- `emailService.js` - Email notifications
- `supabaseClient.js` - Supabase database connection
- `infrastructure/` - Database and external service configs
- `migrations/` - Database schema files

## API Routes

All routes start with `/api/`

- `/auth/*` - Authentication endpoints
- `/services/*` - Service management
- `/consultations/*` - Booking management
- `/payments/*` - Payment processing
- `/chat/*` - Messaging
- `/documents/*` - File management
- `/admin/*` - Admin operations

See main server.js for full route configuration.