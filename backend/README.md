# CEB Customer Portal Backend

Spring Boot backend for CEB Customer Portal with JWT authentication and OTP management.

## Features

- JWT-based authentication and authorization
- OTP generation and validation for 2FA
- Customer account validation and details retrieval
- CORS support for frontend integration
- Comprehensive error handling and logging
- RESTful API design

## Prerequisites

- Java 17 or higher
- Maven 3.8.1 or higher
- Spring Boot 3.1.5

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/ceb/portal/
│   │   │   ├── config/           # Configuration classes
│   │   │   ├── controller/       # REST Controllers
│   │   │   ├── service/          # Business logic
│   │   │   ├── dto/              # Data Transfer Objects
│   │   │   ├── model/            # Entity models
│   │   │   ├── security/         # Security & JWT
│   │   │   └── CebPortalApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── pom.xml
└── README.md
```

## Configuration

### Environment Variables

Update `src/main/resources/application.properties`:

```properties
# Server
server.port=8080

# JWT
security.jwt.secret=your-super-secret-jwt-key-change-this-in-production
security.jwt.expiration=3600000

# External API (CEB API)
external.api.base-url=http://10.128.1.59:6001
external.api.username=CEBkiosk
external.api.password=kiosk#$CEB

# CORS
app.cors.allowed-origins=http://localhost:5173,http://localhost:3000
```

## Building

```bash
mvn clean install
```

## Running

```bash
mvn spring-boot:run
```

Or:

```bash
java -jar target/customer-portal-backend-1.0.0.jar
```

The backend will be available at `http://localhost:8080/api`

## API Endpoints

### Authentication

- **POST** `/api/auth/login` - User login
- **GET** `/api/auth/health` - Health check

### OTP Management

- **POST** `/api/otp/send` - Send OTP to mobile
- **POST** `/api/otp/validate` - Validate OTP

### Customer

- **POST** `/api/customer/validate` - Validate account and get details (requires authentication)
- **POST** `/api/customer/mobile-number` - Get mobile number by account (requires authentication)
- **GET** `/api/customer/validate-format/{accountNumber}` - Validate account format

## Authentication

Most endpoints (except `/auth/login`, `/auth/health`, `/otp/*`) require JWT authentication.

Include the JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

### Default Credentials

For testing, use:
- Username: `customer` / Password: `customer@123`
- Username: `admin` / Password: `admin@123`

**⚠️ Change these credentials in production and use database-backed authentication**

## Security Features

1. **JWT Authentication** - Stateless authentication with JWT tokens
2. **Password Encoding** - BCrypt password hashing
3. **CORS** - Configured CORS for frontend integration
4. **Authorization** - Role-based access control
5. **Input Validation** - Request validation on all endpoints

## API Response Format

All responses follow a standard format:

```json
{
  "success": true|false,
  "message": "Response message",
  "data": {},
  "errorCode": "optional_error_code"
}
```

## Error Handling

- **400** - Bad Request (validation error)
- **401** - Unauthorized (invalid token)
- **500** - Internal Server Error

## Development

### Logging

Logs are configured in `application.properties`:

```properties
logging.level.com.ceb.portal=DEBUG
```

## Next Steps

1. Integrate with actual database for user management
2. Implement refresh token mechanism
3. Add comprehensive audit logging
4. Set up CI/CD pipeline
5. Add unit tests
6. Deploy to production environment

## Support

For issues or questions, contact the development team.
