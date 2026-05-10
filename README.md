# CEB Customer Portal - Frontend-Backend Architecture

## 📁 Clean Project Structure

```
Customer Portal/
│
├── frontend/                    ← React Application
│   ├── src/                    ✅ All source code
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   │   └── cebApi.js       (UPDATED: Backend API calls)
│   │   ├── utils/
│   │   └── ...
│   ├── index.html              ✅ Entry HTML
│   ├── package.json            ✅ Dependencies
│   ├── vite.config.js          ✅ Vite config
│   ├── tailwind.config.js      ✅ Tailwind config
│   ├── postcss.config.js       ✅ PostCSS config
│   ├── .gitignore              ✅ Git exclusions
│   └── README.md               ✅ Frontend guide
│
├── backend/                     ← Spring Boot Application
│   ├── src/main/java/com/ceb/portal/
│   │   ├── config/             ✅ Security & CORS
│   │   ├── controller/         ✅ API endpoints
│   │   ├── service/            ✅ Business logic
│   │   ├── security/           ✅ JWT auth
│   │   └── dto/                ✅ Data models
│   ├── src/main/resources/
│   │   └── application.properties ✅ Configuration
│   ├── pom.xml                 ✅ Maven config
│   ├── .gitignore              ✅ Git exclusions
│   ├── README.md               ✅ Backend guide
│   └── API_DOCUMENTATION.md    ✅ API reference
│
├── 📚 Documentation Files
│   ├── README.md               ← You are here
│   ├── SETUP.md                ← Complete setup guide
│   ├── MIGRATION_GUIDE.md      ← From monolithic to separated
│   ├── FRONTEND_SETUP.md       ← Frontend configuration
│   ├── ENV_CONFIG.md           ← Environment & deployment
│   ├── PROJECT_COMPLETE.md     ← Restructuring summary
│   └── .env.example            ← Environment template
│
└── 🛠️ Configuration
    └── .gitignore              ← Git exclusions
```

## ✅ What's Inside

### Frontend Folder
- **All React source code** in `src/`
- **Configuration files** (vite, tailwind, postcss)
- **package.json** with dependencies
- **Updated cebApi.js** - calls backend API with JWT auth
- **Completely independent** - run `npm install && npm run dev`

### Backend Folder
- **Spring Boot application** ready to run
- **Maven configuration** (pom.xml)
- **3 Controllers** - Auth, OTP, Customer
- **3 Services** - Authentication, OTP, Customer
- **Security** - JWT + CORS + validation
- **Completely independent** - run `mvn spring-boot:run`

## 🚀 Quick Start

### Start Backend (Terminal 1)
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
📍 http://localhost:8080/api

### Start Frontend (Terminal 2)
```bash
cd frontend
npm install

# Create .env file
echo "VITE_API_BASE_URL=http://localhost:8080/api" > .env

npm run dev
```
📍 http://localhost:5173

### Login
```
Username: customer
Password: customer@123
```

## 🔐 Security Features

✅ **JWT Authentication** - Secure token-based auth
✅ **BCrypt Passwords** - Server-side hashing
✅ **CORS Configured** - Frontend-backend communication
✅ **Role-Based Auth** - CUSTOMER & ADMIN roles
✅ **Input Validation** - Server-side checks
✅ **Auto Session Expiry** - Logout on token expiry

## 📋 Project Features

- ✅ User login with JWT tokens
- ✅ OTP-based two-factor authentication
- ✅ Account inquiry and details
- ✅ Payment history
- ✅ Bill viewing and printing
- ✅ Mobile number lookup
- ✅ Comprehensive error handling

## 📚 Documentation

| File | Purpose |
|------|---------|
| [SETUP.md](./SETUP.md) | **START HERE** - Full architecture guide |
| [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) | How files were restructured |
| [FRONTEND_SETUP.md](./FRONTEND_SETUP.md) | Frontend-specific setup |
| [ENV_CONFIG.md](./ENV_CONFIG.md) | Environment variables & deployment |
| [PROJECT_COMPLETE.md](./PROJECT_COMPLETE.md) | What was created |
| [backend/README.md](./backend/README.md) | Backend overview |
| [backend/API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md) | All API endpoints |
| [frontend/README.md](./frontend/README.md) | Frontend overview |

## 🔧 Configuration

### Frontend: `frontend/.env`
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### Backend: `backend/src/main/resources/application.properties`
```properties
server.port=8080
security.jwt.secret=your-secret-key-here
security.jwt.expiration=3600000
app.cors.allowed-origins=http://localhost:5173
```

## 🎯 Architecture

```
┌─────────────────────────────────────────────────────┐
│  Browser (http://localhost:5173)                    │
│  ├─ React Frontend with Vite                        │
│  └─ Tailwind CSS + Context API                      │
└──────────────────┬──────────────────────────────────┘
                   │ HTTP/HTTPS
                   │ JWT Token in header
                   ↓
┌─────────────────────────────────────────────────────┐
│  Spring Boot Backend (http://localhost:8080/api)    │
│  ├─ JWT Authentication                              │
│  ├─ CORS Configuration                              │
│  ├─ REST Endpoints                                  │
│  └─ Business Logic                                  │
└──────────────────┬──────────────────────────────────┘
                   │ HTTP
                   ↓
┌─────────────────────────────────────────────────────┐
│  External CEB API (10.128.1.59:6001)                │
│  ├─ Customer details                                │
│  ├─ OTP services                                    │
│  └─ Authentication                                  │
└─────────────────────────────────────────────────────┘
```

## 📖 API Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | /auth/login | No | User login |
| GET | /auth/health | No | Health check |
| POST | /otp/send | No | Send OTP |
| POST | /otp/validate | No | Validate OTP |
| POST | /customer/validate | Yes | Get details |
| POST | /customer/mobile-number | Yes | Get mobile |
| GET | /customer/validate-format/{id} | No | Validate format |

**Full reference:** [backend/API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md)

## 🌐 Deployment

### Frontend
```bash
cd frontend
npm run build
# Deploy dist/ folder to Netlify, Vercel, or AWS S3
```

### Backend
```bash
cd backend
mvn clean package
java -jar target/customer-portal-backend-1.0.0.jar
```

## 🔄 Project Structure Improvements

| Aspect | Before | After |
|--------|--------|-------|
| Layout | Monolithic | **Separated** ✅ |
| Authentication | None | **JWT** ✅ |
| Security | Credentials in frontend | **Server-side** ✅ |
| Scalability | Limited | **Highly scalable** ✅ |
| Testing | Difficult | **Easy** ✅ |
| Deployment | Complex | **Simple** ✅ |
| Maintainability | Low | **High** ✅ |

## 📦 What's Included

- ✅ Complete Spring Boot backend
- ✅ React frontend with updated API service
- ✅ JWT authentication & authorization
- ✅ OTP management
- ✅ CORS configuration
- ✅ Input validation & error handling
- ✅ Comprehensive documentation
- ✅ Environment configuration
- ✅ Deployment guides

## ⚡ Next Steps

1. **Read [SETUP.md](./SETUP.md)** - Full architecture details
2. **Start backend** - `cd backend && mvn spring-boot:run`
3. **Start frontend** - `cd frontend && npm install && npm run dev`
4. **Test login** - Use `customer:customer@123`
5. **Test features** - Bill inquiry, OTP, etc.
6. **Deploy** - Follow deployment guides for production

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 8080 in use | Kill process: `lsof -ti:8080 \| xargs kill -9` |
| Can't connect to backend | Verify backend running: `curl http://localhost:8080/api/auth/health` |
| Token not saving | Check localStorage enabled in browser |
| Login fails | Verify backend responds, check credentials |

**More help:** See [SETUP.md](./SETUP.md#troubleshooting)

## 📞 Support

- 📖 Check documentation files
- 🔍 Review API_DOCUMENTATION.md for endpoints
- 🛠️ See ENV_CONFIG.md for configuration
- 📋 Check MIGRATION_GUIDE.md for structure details

---

**Status:** ✅ Project reorganized and ready
**Version:** 1.0.0  
**Structure:** Clean Frontend-Backend separation

**→ Start with [SETUP.md](./SETUP.md) for complete instructions**
