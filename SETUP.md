# CEB Customer Portal - Project Structure

## Overview

This project is now split into **Frontend** and **Backend** for better maintainability and scalability.

```
Customer Portal/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── context/         # Context API
│   │   ├── services/        # API service (cebApi.js)
│   │   ├── utils/           # Utility functions
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── README.md
│
├── backend/                  # Spring Boot backend
│   ├── src/
│   │   ├── main/java/com/ceb/portal/
│   │   │   ├── config/      # Spring configuration
│   │   │   ├── controller/  # REST endpoints
│   │   │   ├── service/     # Business logic
│   │   │   ├── dto/         # Data transfer objects
│   │   │   ├── security/    # JWT & security
│   │   │   └── CebPortalApplication.java
│   │   └── resources/
│   │       └── application.properties
│   ├── pom.xml
│   └── README.md
│
└── SETUP.md                  # This file
```

## Quick Start

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Update API configuration in src/services/cebApi.js
# Change API_BASE_URL to your backend URL

# Run development server
npm run dev
```

**Frontend runs on:** `http://localhost:5173`

### Backend Setup

```bash
cd backend

# Build with Maven
mvn clean install

# Run application
mvn spring-boot:run
```

**Backend runs on:** `http://localhost:8080/api`

## Architecture

### Frontend (React + Vite)
- Modern React with hooks
- Tailwind CSS for styling
- Axios/Fetch for API calls
- Context API for state management
- Vite for fast development

### Backend (Spring Boot)
- RESTful API design
- JWT authentication
- OTP management
- External API integration
- CORS support
- Comprehensive error handling

## Key Features

✅ User Authentication (JWT)
✅ OTP-based 2FA
✅ Account Management
✅ Bill Inquiry
✅ Payment History
✅ Secure API Communication
✅ Role-based Authorization

## Security Implementation

### Frontend
- JWT token storage (localStorage)
- Automatic token refresh
- Protected routes
- CSRF prevention
- Input validation

### Backend
- JWT validation on all protected endpoints
- Password encryption (BCrypt)
- CORS configuration
- Role-based access control
- Input sanitization

## Configuration

### Frontend Environment Variables

Create `.env` file in frontend root:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### Backend Environment Variables

Update `backend/src/main/resources/application.properties`:

```properties
server.port=8080
security.jwt.secret=your-secret-key-here
security.jwt.expiration=3600000
```

## API Communication Flow

```
Frontend Request
    ↓
[Include JWT Token in Authorization Header]
    ↓
Backend Security Filter (JwtAuthenticationFilter)
    ↓
JWT Validation (JwtTokenProvider)
    ↓
Controller/Service Processing
    ↓
Response with standardized format
    ↓
Frontend Error Handling & State Update
```

## Development Workflow

1. **Frontend Development**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Backend Development**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

3. **Testing API Endpoints**
   - Use Postman, Insomnia, or curl
   - Include JWT token in Authorization header
   - Follow API response format

## Deployment

### Frontend
```bash
npm run build
# Deploy dist/ folder to static hosting (Netlify, Vercel, AWS S3)
```

### Backend
```bash
mvn clean package
# Deploy jar file to server with Java 17 runtime
java -jar target/customer-portal-backend-1.0.0.jar
```

## Testing

### Login Credentials (Development Only)

| Username | Password | Role |
|----------|----------|------|
| customer | customer@123 | CUSTOMER |
| admin | admin@123 | ADMIN |

**⚠️ Change these credentials before production deployment**

## Troubleshooting

### Frontend can't connect to backend
- Verify backend is running on `http://localhost:8080`
- Check CORS configuration in `backend/src/main/java/com/ceb/portal/config/SecurityConfig.java`
- Clear browser cache and localStorage

### JWT Token Expired
- Token automatically refreshes on next request
- User is logged out if token cannot be refreshed
- Credentials need to be valid to log in again

### Port Already in Use
- Frontend: Change port in `vite.config.js`
- Backend: Change `server.port` in `application.properties`

## Next Steps

1. Configure production database for user management
2. Set up proper environment variable management
3. Implement comprehensive logging
4. Add unit and integration tests
5. Set up CI/CD pipeline
6. Configure SSL/HTTPS for production
7. Implement rate limiting
8. Add API documentation (Swagger/OpenAPI)

## Support

For help or issues, refer to:
- Frontend: `frontend/README.md`
- Backend: `backend/README.md`
