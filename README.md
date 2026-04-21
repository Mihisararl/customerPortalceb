# CEB Customer Information Self Inquiry System

A modern, user-friendly React web application for viewing electricity bill information, making inquiries, and printing/downloading bill and payment slips.

## Features

- 🔐 Customer Login/Account Selection
- 📊 Dashboard Overview with key account information
- 📄 Bill Inquiry (current and historical bills)
- 🖨️ Print/Download Bill and Payment Slips (PDF)
- 💳 Last Bill Payment with detailed records
- 🔔 Notifications and Alerts for overdue payments
- 📱 Fully responsive design (desktop and mobile)

## Tech Stack

- **React 18** - UI framework
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **jsPDF** - PDF generation
- **Axios** - HTTP client

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Login Testing

Use a real 10-digit account number available in the connected CEB API environment.
The login flow sends OTP to the account's registered mobile number via SharedService OTP APIs.

## Project Structure

```
src/
├── components/        # Reusable components
├── pages/            # Page components
├── context/          # Context providers
├── data/             # Mock data
├── utils/            # Utility functions
└── styles/           # Global styles
```

## License

MIT
