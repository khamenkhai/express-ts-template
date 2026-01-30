# Express TypeScript Starter

A production-ready Express.js starter template with TypeScript, featuring authentication, authorization, comprehensive error handling, and modular architecture.

## 🚀 Features

- ✅ **TypeScript** - Type safety and better developer experience
- ✅ **Modular Architecture** - Feature-based folder structure
- ✅ **Authentication** - JWT-based auth with access and refresh tokens
- ✅ **Authorization** - Role-based access control (RBAC)
- ✅ **Validation** - Request validation using Zod
- ✅ **Error Handling** - Centralized error handling with custom error classes
- ✅ **Logging** - Winston logger with multiple transports
- ✅ **Security** - Helmet, CORS, rate limiting
- ✅ **Environment Config** - Type-safe environment variables with validation

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn or pnpm

## 🛠️ Installation

1. **Clone or use the template**

```bash
cd express-ts-starter
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` and update the values:

```env
NODE_ENV=development
PORT=3000
API_VERSION=v1

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-minimum-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production-minimum-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

4. **Create logs directory**

```bash
mkdir logs
```

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── config/               # Configuration files
│   ├── env.ts           # Environment variables with validation
│   └── logger.ts        # Winston logger configuration
├── modules/             # Feature modules
│   ├── auth/           # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.routes.ts
│   │   └── auth.validation.ts
│   └── users/          # Users module
│       ├── user.controller.ts
│       ├── user.service.ts
│       ├── user.routes.ts
│       └── user.validation.ts
├── shared/             # Shared resources
│   ├── database/       # Database models/repositories
│   ├── errors/         # Custom error classes
│   ├── middleware/     # Express middleware
│   ├── types/          # TypeScript types and interfaces
│   └── utils/          # Utility functions
├── routes/             # Route definitions
├── app.ts              # Express app configuration
└── server.ts           # Server entry point
```

## 🔐 Authentication & Authorization

### User Roles

- `USER` - Regular user
- `MODERATOR` - Moderator with elevated permissions
- `ADMIN` - Administrator with full access

### Authentication Flow

1. **Register**: `POST /api/v1/auth/register`
2. **Login**: `POST /api/v1/auth/login` - Returns access and refresh tokens
3. **Refresh Token**: `POST /api/v1/auth/refresh` - Get new access token
4. **Get Profile**: `GET /api/v1/auth/profile` - Requires authentication
5. **Logout**: `POST /api/v1/auth/logout` - Invalidate token

### Authorization

Use the `authorize` middleware to protect routes:

```typescript
router.get('/admin-only', 
  authenticate, 
  authorize(UserRole.ADMIN), 
  controller.method
);
```

## 📡 API Endpoints

### Health Check

```
GET /api/v1/health
```

### Authentication

```
POST   /api/v1/auth/register      # Register new user
POST   /api/v1/auth/login         # Login user
POST   /api/v1/auth/refresh       # Refresh access token
GET    /api/v1/auth/profile       # Get current user profile (Protected)
POST   /api/v1/auth/logout        # Logout (Protected)
```

### Users (Admin Only)

```
GET    /api/v1/users              # Get all users (Admin)
GET    /api/v1/users/:id          # Get user by ID (Admin)
PATCH  /api/v1/users/me           # Update current user (Protected)
PATCH  /api/v1/users/:id/role     # Update user role (Admin)
DELETE /api/v1/users/:id          # Delete user (Admin)
```

## 📝 API Usage Examples

### Register User

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123"
  }'
```

### Access Protected Route

```bash
curl -X GET http://localhost:3000/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🧪 Validation Rules

### Registration

- Email: Valid email format
- Password: Minimum 8 characters, must contain uppercase, lowercase, and number
- First/Last Name: Minimum 2 characters

### Password Requirements

```
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
```

## 🛡️ Security Features

1. **Helmet** - Sets security-related HTTP headers
2. **CORS** - Configurable cross-origin resource sharing
3. **Rate Limiting** - Prevents abuse (100 requests per 15 minutes by default)
4. **Password Hashing** - Bcrypt with configurable rounds
5. **JWT** - Secure token-based authentication
6. **Input Validation** - Zod schema validation for all inputs

## 🔧 Error Handling

The application uses custom error classes for consistent error responses:

- `BadRequestError` (400)
- `UnauthorizedError` (401)
- `ForbiddenError` (403)
- `NotFoundError` (404)
- `ConflictError` (409)
- `ValidationError` (422)
- `InternalServerError` (500)

Example error response:

```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

## 📊 Logging

Winston logger with multiple levels:

- `error` - Error messages
- `warn` - Warning messages
- `info` - Informational messages
- `http` - HTTP request logs
- `debug` - Debug messages (development only)

Logs are saved to:
- `logs/error.log` - Error logs only
- `logs/all.log` - All logs

## 🗄️ Database

Currently uses an in-memory database for demonstration. Replace `src/shared/database/user.db.ts` with your preferred database:

- **PostgreSQL** with Prisma or TypeORM
- **MongoDB** with Mongoose
- **MySQL** with TypeORM

## 🚀 Deployment

1. Set `NODE_ENV=production` in your environment
2. Update `JWT_SECRET` and `JWT_REFRESH_SECRET` with strong random values
3. Configure `ALLOWED_ORIGINS` for your frontend domains
4. Set up a real database
5. Build the application: `npm run build`
6. Start the server: `npm start`

## 📦 Adding New Modules

1. Create a new folder in `src/modules/`
2. Add controller, service, routes, and validation files
3. Register routes in `src/routes/index.ts`

Example structure:
```
src/modules/products/
├── product.controller.ts
├── product.service.ts
├── product.routes.ts
└── product.validation.ts
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

MIT

## 🙏 Acknowledgments

Built with best practices for production-ready Express.js applications.