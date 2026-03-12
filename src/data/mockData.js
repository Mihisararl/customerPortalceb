// Mock bills data
// Note: Customer data is now fetched from real CEB API
// Using 10-digit account numbers for testing
// You can test with account number: 1234567890 (from API documentation)
export const bills = {
    '1234567890': [
        {
            id: 'BILL-2026-02-001',
            accountNumber: '1234567890',
            billingPeriod: 'February 2026',
            month: 2,
            year: 2026,
            readingDate: '2026-02-15',
            dueDate: '2026-03-05',
            previousReading: 1250,
            currentReading: 1480,
            unitsConsumed: 230,
            fixedCharge: 120.00,
            energyCharge: 3450.00,
            fuelAdjustment: 345.00,
            subtotal: 3915.00,
            tax: 391.50,
            totalAmount: 4306.50,
            status: 'unpaid',
            isPaid: false
        },
        {
            id: 'BILL-2026-01-001',
            accountNumber: '1234567890',
            billingPeriod: 'January 2026',
            month: 1,
            year: 2026,
            readingDate: '2026-01-15',
            dueDate: '2026-02-05',
            previousReading: 1020,
            currentReading: 1250,
            unitsConsumed: 230,
            fixedCharge: 120.00,
            energyCharge: 3450.00,
            fuelAdjustment: 345.00,
            subtotal: 3915.00,
            tax: 391.50,
            totalAmount: 4306.50,
            status: 'paid',
            isPaid: true,
            paidDate: '2026-02-01',
            paidAmount: 4306.50
        },
        {
            id: 'BILL-2025-12-001',
            accountNumber: '1234567890',
            billingPeriod: 'December 2025',
            month: 12,
            year: 2025,
            readingDate: '2025-12-15',
            dueDate: '2026-01-05',
            previousReading: 850,
            currentReading: 1020,
            unitsConsumed: 170,
            fixedCharge: 120.00,
            energyCharge: 2550.00,
            fuelAdjustment: 255.00,
            subtotal: 2925.00,
            tax: 292.50,
            totalAmount: 3217.50,
            status: 'paid',
            isPaid: true,
            paidDate: '2025-12-28',
            paidAmount: 3217.50
        }
    ]
};

// Mock payment history
export const payments = {
    '1234567890': [
        {
            id: 'PAY-2026-02-001',
            billId: 'BILL-2026-01-001',
            accountNumber: '1234567890',
            paymentDate: '2026-02-01',
            amount: 4306.50,
            method: 'Online Banking',
            referenceNumber: 'REF20260201123456',
            status: 'completed'
        },
        {
            id: 'PAY-2025-12-001',
            billId: 'BILL-2025-12-001',
            accountNumber: '1234567890',
            paymentDate: '2025-12-28',
            amount: 3217.50,
            method: 'Credit Card',
            referenceNumber: 'REF20251228987654',
            status: 'completed'
        }
    ]
};

// Mock notifications
export const notifications = {
    '1234567890': [
        {
            id: 'NOTIF-001',
            accountNumber: '1234567890',
            type: 'info',
            title: 'New Bill Available',
            message: 'Your February 2026 bill is now available.',
            date: '2026-02-15',
            isRead: false
        }
    ]
};

