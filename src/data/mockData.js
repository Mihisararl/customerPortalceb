// Mock customer data
export const customers = [
    {
        accountNumber: 'ACC001',
        customerName: 'John Doe',
        address: '123 Main Street, Colombo 05',
        email: 'john.doe@email.com',
        phone: '+94 77 123 4567',
        mobileNumber: '0771234567',
        nic: '199012345678',
        status: 'active',
        tariff: 'Domestic'
    },
    {
        accountNumber: 'ACC002',
        customerName: 'Jane Smith',
        address: '456 Park Avenue, Kandy',
        email: 'jane.smith@email.com',
        phone: '+94 76 987 6543',
        mobileNumber: '0769876543',
        nic: '198567890123',
        status: 'active',
        tariff: 'Domestic'
    },
    {
        accountNumber: 'ACC003',
        customerName: 'David Fernando',
        address: '789 Lake Road, Galle',
        email: 'david.fernando@email.com',
        phone: '+94 75 555 1234',
        mobileNumber: '0769876543',
        nic: '198567890123',
        status: 'active',
        tariff: 'Commercial'
    }
];

// Helper function to get accounts by mobile number
export const getAccountsByMobile = (mobileNumber) => {
    // Remove spaces and leading zero, then match
    const normalized = mobileNumber.replace(/\s/g, '').replace(/^0/, '');
    return customers.filter(c => {
        const customerMobile = c.mobileNumber.replace(/\s/g, '').replace(/^0/, '');
        return customerMobile === normalized || c.mobileNumber === mobileNumber;
    });
};

// Helper function to get accounts by NIC
export const getAccountsByNIC = (nic) => {
    // Remove spaces and match
    const normalized = nic.replace(/\s/g, '').toUpperCase();
    return customers.filter(c => {
        const customerNIC = c.nic.replace(/\s/g, '').toUpperCase();
        return customerNIC === normalized;
    });
};

// Mock bills data
export const bills = {
    'ACC001': [
        {
            id: 'BILL-2026-02-001',
            accountNumber: 'ACC001',
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
            accountNumber: 'ACC001',
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
            accountNumber: 'ACC001',
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
    ],
    'ACC002': [
        {
            id: 'BILL-2026-02-002',
            accountNumber: 'ACC002',
            billingPeriod: 'February 2026',
            month: 2,
            year: 2026,
            readingDate: '2026-02-15',
            dueDate: '2026-03-05',
            previousReading: 2100,
            currentReading: 2380,
            unitsConsumed: 280,
            fixedCharge: 120.00,
            energyCharge: 4200.00,
            fuelAdjustment: 420.00,
            subtotal: 4740.00,
            tax: 474.00,
            totalAmount: 5214.00,
            status: 'unpaid',
            isPaid: false
        },
        {
            id: 'BILL-2026-01-002',
            accountNumber: 'ACC002',
            billingPeriod: 'January 2026',
            month: 1,
            year: 2026,
            readingDate: '2026-01-15',
            dueDate: '2026-02-05',
            previousReading: 1800,
            currentReading: 2100,
            unitsConsumed: 300,
            fixedCharge: 120.00,
            energyCharge: 4500.00,
            fuelAdjustment: 450.00,
            subtotal: 5070.00,
            tax: 507.00,
            totalAmount: 5577.00,
            status: 'overdue',
            isPaid: false
        }
    ],
    'ACC003': [
        {
            id: 'BILL-2026-02-003',
            accountNumber: 'ACC003',
            billingPeriod: 'February 2026',
            month: 2,
            year: 2026,
            readingDate: '2026-02-15',
            dueDate: '2026-03-05',
            previousReading: 3200,
            currentReading: 3550,
            unitsConsumed: 350,
            fixedCharge: 200.00,
            energyCharge: 6300.00,
            fuelAdjustment: 630.00,
            subtotal: 7130.00,
            tax: 713.00,
            totalAmount: 7843.00,
            status: 'paid',
            isPaid: true,
            paidDate: '2026-02-18',
            paidAmount: 7843.00
        }
    ]
};

// Mock payment history
export const payments = {
    'ACC001': [
        {
            id: 'PAY-2026-02-001',
            billId: 'BILL-2026-01-001',
            accountNumber: 'ACC001',
            paymentDate: '2026-02-01',
            amount: 4306.50,
            method: 'Online Banking',
            referenceNumber: 'REF20260201123456',
            status: 'completed'
        },
        {
            id: 'PAY-2025-12-001',
            billId: 'BILL-2025-12-001',
            accountNumber: 'ACC001',
            paymentDate: '2025-12-28',
            amount: 3217.50,
            method: 'Credit Card',
            referenceNumber: 'REF20251228987654',
            status: 'completed'
        }
    ],
    'ACC002': [
        {
            id: 'PAY-2025-12-002',
            billId: 'BILL-2025-12-002',
            accountNumber: 'ACC002',
            paymentDate: '2025-12-20',
            amount: 4850.00,
            method: 'Cash',
            referenceNumber: 'REF20251220111222',
            status: 'completed'
        }
    ],
    'ACC003': [
        {
            id: 'PAY-2026-02-003',
            billId: 'BILL-2026-02-003',
            accountNumber: 'ACC003',
            paymentDate: '2026-02-18',
            amount: 7843.00,
            method: 'Online Banking',
            referenceNumber: 'REF20260218654321',
            status: 'completed'
        }
    ]
};

// Mock notifications
export const notifications = {
    'ACC001': [
        {
            id: 'NOTIF-001',
            accountNumber: 'ACC001',
            type: 'info',
            title: 'New Bill Available',
            message: 'Your February 2026 bill is now available.',
            date: '2026-02-15',
            isRead: false
        }
    ],
    'ACC002': [
        {
            id: 'NOTIF-002',
            accountNumber: 'ACC002',
            type: 'warning',
            title: 'Overdue Payment',
            message: 'Your January 2026 bill is overdue. Please pay to avoid disconnection.',
            date: '2026-02-06',
            isRead: false
        },
        {
            id: 'NOTIF-003',
            accountNumber: 'ACC002',
            type: 'info',
            title: 'New Bill Available',
            message: 'Your February 2026 bill is now available.',
            date: '2026-02-15',
            isRead: false
        }
    ],
    'ACC003': [
        {
            id: 'NOTIF-004',
            accountNumber: 'ACC003',
            type: 'success',
            title: 'Payment Received',
            message: 'We have received your payment of Rs. 7,843.00.',
            date: '2026-02-18',
            isRead: false
        }
    ]
};
