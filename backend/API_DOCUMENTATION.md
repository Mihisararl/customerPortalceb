# API Documentation

## Base URL

```
http://localhost:8080/api
```

## Authentication

All protected endpoints require JWT token in the Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

## Response Format

All API responses follow this format:

```json
{
  "success": true|false,
  "message": "Response message",
  "data": {},
  "errorCode": "Optional error code"
}
```

## Endpoints

### 1. Authentication

#### POST /auth/login

Login user and get JWT token.

**Request:**
```json
{
  "username": "customer",
  "password": "customer@123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGc...",
    "username": "customer",
    "expiresIn": 3600000
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Invalid credentials
- `400` - Missing username/password

---

#### GET /auth/health

Health check endpoint (no authentication required).

**Response:**
```json
{
  "success": true,
  "message": "Backend is running"
}
```

**Status Codes:**
- `200` - Backend is running

---

### 2. OTP Management

#### POST /otp/send

Send OTP to mobile number (no authentication required).

**Request:**
```json
{
  "mobileNo": "0771234567",
  "accountNumber": "1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "mobileNo": "0771234567",
    "maskedMobileNo": "077***4567"
  }
}
```

**Status Codes:**
- `200` - OTP sent successfully
- `400` - Invalid mobile number
- `500` - Server error

---

#### POST /otp/validate

Validate OTP (no authentication required).

**Request:**
```json
{
  "mobileNo": "0771234567",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP validated successfully"
}
```

**Status Codes:**
- `200` - OTP is valid
- `400` - Invalid OTP or expired
- `500` - Server error

---

### 3. Customer Management

#### POST /customer/validate

Validate account number and get customer details (**requires authentication**).

**Request:**
```json
{
  "accountNumber": "1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Customer details retrieved successfully",
  "data": {
    "accountNumber": "1234567890",
    "customerName": "John Doe",
    "address": "123 Main St, Colombo",
    "tariff": "Domestic",
    "customerType": "Residential",
    "billingMonth": "January 2024",
    "currentBalance": 5500.00,
    "units": 150.5,
    "phone": "0771234567",
    "email": "john@example.com",
    "status": "active",
    "lastPaymentAmount": 5000.00,
    "lastPaymentDate": "2024-01-15",
    "previousReading": 1000,
    "currentReading": 1150.5,
    "recentPayments": [
      {
        "paidAmount": 5000.00,
        "paidDate": "2024-01-15"
      }
    ]
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid account number format
- `401` - Unauthorized (invalid/missing token)
- `404` - Account not found
- `500` - Server error

**Required Role:** `CUSTOMER` or `ADMIN`

---

#### POST /customer/mobile-number

Get registered mobile number for account (**requires authentication**).

**Request:**
```json
{
  "accountNumber": "1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Mobile number retrieved successfully",
  "data": "0771234567"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid account number
- `401` - Unauthorized
- `404` - Mobile number not found
- `500` - Server error

**Required Role:** `CUSTOMER` or `ADMIN`

---

#### GET /customer/validate-format/{accountNumber}

Check if account number format is valid (no authentication required).

**Response:**
```json
{
  "success": true,
  "message": "Account number format is valid",
  "data": true
}
```

**Status Codes:**
- `200` - Format check completed
- `400` - Invalid input

---

## Error Responses

### 400 - Bad Request
```json
{
  "success": false,
  "message": "Account number must be exactly 10 digits",
  "errorCode": "INVALID_FORMAT"
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "message": "Invalid credentials",
  "errorCode": "401"
}
```

### 404 - Not Found
```json
{
  "success": false,
  "message": "Account not found",
  "errorCode": "404"
}
```

### 500 - Internal Server Error
```json
{
  "success": false,
  "message": "Service temporarily unavailable. Please try again later.",
  "errorCode": "500"
}
```

---

## Rate Limiting

Currently not implemented. Recommended for production:
- Login attempts: 5 per minute per IP
- OTP requests: 3 per 10 minutes per mobile
- API requests: 100 per minute per user

---

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "customer",
    "password": "customer@123"
  }'
```

### Send OTP
```bash
curl -X POST http://localhost:8080/api/otp/send \
  -H "Content-Type: application/json" \
  -d '{
    "mobileNo": "0771234567",
    "accountNumber": "1234567890"
  }'
```

### Validate Account (with token)
```bash
curl -X POST http://localhost:8080/api/customer/validate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "accountNumber": "1234567890"
  }'
```

---

## Testing with Postman

1. Import endpoints collection
2. Set `{{base_url}}` to `http://localhost:8080/api`
3. Get token from login endpoint
4. Set `{{token}}` variable from response
5. Add `Authorization: Bearer {{token}}` header to protected endpoints

---

## Changelog

### Version 1.0.0 (Current)
- JWT authentication
- OTP management
- Customer validation
- Account lookup
- CORS support

---

## Support

For API issues or questions, contact the backend team.
