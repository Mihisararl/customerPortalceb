# CEB Customer Portal - Frontend

Modern React frontend for CEB Customer Portal with Vite, Tailwind CSS, and Context API.

## Features

✅ Modern React with Hooks
✅ Vite for fast development
✅ Tailwind CSS for styling
✅ JWT Authentication
✅ OTP-based 2FA
✅ Bill Inquiry
✅ Payment History
✅ Protected Routes
✅ Responsive Design

## Tech Stack

- **React** 18+ - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS
- **Context API** - State management
- **Fetch API** - HTTP client

## Prerequisites

- Node.js 16+ and npm 8+
- Backend running on http://localhost:8080

## Installation

```bash
# Install dependencies
npm install
```

## Configuration

Create `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## Running Development Server

```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

## Building for Production

```bash
npm run build
```

Output will be in `dist/` folder.

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Alert.jsx
│   ├── BillCard.jsx
│   ├── Footer.jsx
│   ├── LoadingSpinner.jsx
│   ├── Navbar.jsx
│   ├── PaymentModal.jsx
│   └── ProtectedRoute.jsx
├── context/
│   └── AppContext.jsx   # Global state management
├── pages/               # Page components
│   ├── BillInquiry.jsx
│   ├── Dashboard.jsx
│   ├── Login.jsx
│   ├── PaymentHistory.jsx
│   └── PrintBill.jsx
├── services/
│   └── cebApi.js        # API service (calls backend)
├── utils/
│   └── helpers.js       # Utility functions
├── App.jsx              # Main app component
├── main.jsx             # Entry point
└── index.css            # Global styles
```

## Key Files

### cebApi.js
API service that communicates with the backend:

```javascript
// Authentication
import { login, logout } from './services/cebApi';

// OTP
import { sendLoginOtp, validateLoginOtp } from './services/cebApi';

// Customer
import { validateAccountNumber, getMobileNumberByAccount } from './services/cebApi';
```

### AppContext.jsx
Global state management for:
- Authentication state
- User information
- Customer details
- Loading states

### ProtectedRoute.jsx
Wraps routes that require authentication:

```jsx
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

## API Integration

The frontend communicates with the backend via the `cebApi.js` service:

```javascript
// Login
const loginResponse = await login(username, password);
// Response: { token, username, expiresIn }

// Get mobile number
const mobileResponse = await getMobileNumberByAccount(accountNumber);
// Response: { mobileNo, maskedMobileNo }

// Send OTP
const otpResponse = await sendLoginOtp(mobileNo, { accountNumber });
// Response: { success, mobileNo, maskedMobileNo }

// Validate OTP
const isValid = await validateLoginOtp({ mobileNo, otp });
// Response: true/false

// Validate account
const customerDetails = await validateAccountNumber(accountNumber);
// Response: { accountNumber, customerName, balance, ... }
```

## Authentication Flow

1. **User navigates to login page**
2. **Enters credentials and clicks login**
3. **Frontend calls `/api/auth/login` with username/password**
4. **Backend validates and returns JWT token**
5. **Frontend stores token in localStorage**
6. **Subsequent API calls include token in Authorization header**
7. **Backend validates token on protected endpoints**

## Token Management

```javascript
// Token is automatically:
// - Stored in localStorage on login
// - Retrieved from localStorage for each request
// - Sent in Authorization header
// - Cleared on logout or session expiry
```

## Error Handling

The API service automatically:
- Catches network errors
- Handles HTTP status codes
- Displays user-friendly error messages
- Redirects to login on 401 (unauthorized)
- Clears token on authentication failure

## Development Workflow

### 1. Start Backend
```bash
cd backend
mvn spring-boot:run
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Access Application
- Open http://localhost:5173 in browser
- Login with test credentials: `customer` / `customer@123`

### 4. Make Changes
- Edit React components in `src/`
- Changes hot-reload automatically

### 5. Debug
- Use React DevTools browser extension
- Check Network tab in DevTools for API calls
- Verify JWT token in localStorage

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:8080/api` | Backend API URL |

## Production Build

```bash
# Build the app
npm run build

# Preview production build locally
npm run preview

# Deploy dist/ folder to your hosting service
```

### Deployment Options

- **Netlify**: Connect GitHub repo, set build command to `npm run build`
- **Vercel**: Similar to Netlify
- **AWS S3 + CloudFront**: Upload dist/ to S3 bucket
- **Any static hosting**: Upload dist/ folder

## Troubleshooting

### "Cannot connect to backend"
- Verify backend is running on port 8080
- Check `VITE_API_BASE_URL` in `.env`
- Check browser console for CORS errors

### "Login not working"
- Verify backend API is reachable: `curl http://localhost:8080/api/auth/health`
- Check credentials are correct
- Clear localStorage: `localStorage.clear()`
- Reload page

### "Blank page or errors"
- Check browser console for JavaScript errors
- Clear browser cache: Ctrl+Shift+Delete
- Run `npm install` to ensure dependencies are correct

### "Styles not loading"
- Ensure Tailwind CSS is compiled: `npm run build`
- Check `tailwind.config.js` includes src path
- Clear dist/ folder and rebuild

## Testing

Test the application manually:

1. **Login Flow**
   - Navigate to /login
   - Enter valid credentials
   - Verify redirect to dashboard

2. **Bill Inquiry**
   - Enter 10-digit account number
   - Verify account details load

3. **OTP Flow**
   - Trigger OTP send
   - Check console for test OTP (in dev mode)
   - Enter OTP and validate

4. **Protected Routes**
   - Try accessing protected routes without login
   - Verify redirect to login

## Performance Tips

- Use React DevTools Profiler to identify bottlenecks
- Implement code splitting for large pages
- Lazy load components with `React.lazy()`
- Use memoization for expensive calculations

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Create a new branch: `git checkout -b feature/your-feature`
2. Make changes and commit
3. Push to branch
4. Create a Pull Request

## License

This project is proprietary software.

## Support

For issues or questions:
- Check `../SETUP.md` for full setup guide
- Check `../MIGRATION_GUIDE.md` for backend integration details
- Refer to `../backend/API_DOCUMENTATION.md` for API details
