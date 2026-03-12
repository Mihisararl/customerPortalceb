import jsPDF from 'jspdf';
import cebLogo from '../assets/ceb-1.png';

export const formatCurrency = (amount) => {
    return `Rs. ${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
};

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const formatShortDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export const isOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    return due < today;
};

export const getDaysDifference = (date1, date2) => {
    const diffTime = Math.abs(new Date(date2) - new Date(date1));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

export const getStatusColor = (status) => {
    switch (status) {
        case 'paid':
            return 'text-green-600 bg-green-100';
        case 'unpaid':
            return 'text-yellow-600 bg-yellow-100';
        case 'overdue':
            return 'text-red-600 bg-red-100';
        default:
            return 'text-gray-600 bg-gray-100';
    }
};

export const generateBillPDF = (bill, customer) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Add CEB Logo - horizontally scaled
    const logoWidth = 30;
    const logoHeight = 18;
    const logoX = 10;
    const logoY = 12;
    doc.addImage(cebLogo, 'PNG', logoX, logoY, logoWidth, logoHeight);

    // Header - aligned with logo
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('Electricity Distribution Lanka (Pvt) Ltd', logoX + logoWidth + 5, 20);

    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text('Customer Bill Statement', logoX + logoWidth + 5, 27);

    // Line separator
    doc.setLineWidth(0.5);
    doc.line(15, 35, pageWidth - 15, 35);

    // Bill Information
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('Bill Information', 15, 43);
    doc.setFont(undefined, 'normal');
    doc.text(`Bill ID: ${bill.id}`, 15, 49);
    doc.text(`Billing Period: ${bill.billingPeriod}`, 15, 55);
    doc.text(`Reading Date: ${formatDate(bill.readingDate)}`, 15, 61);
    doc.text(`Due Date: ${formatDate(bill.dueDate)}`, 15, 67);

    // Customer Information
    doc.setFont(undefined, 'bold');
    doc.text('Customer Information', 15, 78);
    doc.setFont(undefined, 'normal');
    doc.text(`Account Number: ${customer.accountNumber}`, 15, 84);
    doc.text(`Name: ${customer.customerName}`, 15, 90);
    doc.text(`Address: ${customer.address}`, 15, 96);
    doc.text(`Phone: ${customer.phone}`, 15, 102);

    // Reading Details
    doc.setFont(undefined, 'bold');
    doc.text('Reading Details', 15, 113);
    doc.setFont(undefined, 'normal');
    doc.text(`Previous Reading: ${bill.previousReading} kWh`, 15, 119);
    doc.text(`Current Reading: ${bill.currentReading} kWh`, 15, 125);
    doc.text(`Units Consumed: ${bill.unitsConsumed} kWh`, 15, 131);

    // Charges Table
    doc.setFont(undefined, 'bold');
    doc.text('Charges Breakdown', 15, 139);

    const startY = 145;
    const lineHeight = 6;

    doc.setFont(undefined, 'normal');
    doc.text('Fixed Charge', 20, startY);
    doc.text(formatCurrency(bill.fixedCharge), pageWidth - 50, startY, { align: 'right' });

    doc.text('Energy Charge', 20, startY + lineHeight);
    doc.text(formatCurrency(bill.energyCharge), pageWidth - 50, startY + lineHeight, { align: 'right' });

    doc.text('Fuel Adjustment', 20, startY + lineHeight * 2);
    doc.text(formatCurrency(bill.fuelAdjustment), pageWidth - 50, startY + lineHeight * 2, { align: 'right' });

    // Line before subtotal
    doc.setLineWidth(0.3);
    doc.line(20, startY + lineHeight * 3, pageWidth - 50, startY + lineHeight * 3);

    doc.text('Subtotal', 20, startY + lineHeight * 4);
    doc.text(formatCurrency(bill.subtotal), pageWidth - 50, startY + lineHeight * 4, { align: 'right' });

    doc.text('Tax (10%)', 20, startY + lineHeight * 5);
    doc.text(formatCurrency(bill.tax), pageWidth - 50, startY + lineHeight * 5, { align: 'right' });

    // Line before total
    doc.setLineWidth(0.5);
    doc.line(20, startY + lineHeight * 6, pageWidth - 50, startY + lineHeight * 6);

    // Total
    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.text('Total Amount', 20, startY + lineHeight * 7);
    doc.text(formatCurrency(bill.totalAmount), pageWidth - 50, startY + lineHeight * 7, { align: 'right' });

    // Payment Status
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const statusY = startY + lineHeight * 9;
    doc.text(`Status: ${bill.status.toUpperCase()}`, 20, statusY);

    if (bill.isPaid) {
        doc.text(`Paid Date: ${formatDate(bill.paidDate)}`, 20, statusY + 6);
        doc.text(`Paid Amount: ${formatCurrency(bill.paidAmount)}`, 20, statusY + 12);
    }

    // Footer
    doc.setFontSize(8);
    doc.setFont(undefined, 'italic');
    const footerY = doc.internal.pageSize.height - 20;
    doc.text('Thank you for being a valued customer of Electricity Distribution Lanka (Pvt) Ltd', pageWidth / 2, footerY, { align: 'center' });
    doc.text('For inquiries, call: 1987 | Email: customercare@ceb.lk', pageWidth / 2, footerY + 5, { align: 'center' });

    // Save the PDF
    doc.save(`CEB_Bill_${bill.id}.pdf`);
};

export const generatePaymentSlipPDF = (payment, bill, customer) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Add CEB Logo - horizontally scaled
    const logoWidth = 35;
    const logoHeight = 18;
    const logoX = 15;
    const logoY = 12;
    doc.addImage(cebLogo, 'PNG', logoX, logoY, logoWidth, logoHeight);

    // Header - aligned with logo
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('Electricity Distribution Lanka (Pvt) Ltd', logoX + logoWidth + 5, 20);

    doc.setFontSize(13);
    doc.setFont(undefined, 'normal');
    doc.text('Payment Receipt', logoX + logoWidth + 5, 27);

    // Line separator
    doc.setLineWidth(0.5);
    doc.line(15, 35, pageWidth - 15, 35);

    // Payment Information
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('Payment Information', 15, 43);
    doc.setFont(undefined, 'normal');
    doc.text(`Payment ID: ${payment.id}`, 15, 49);
    doc.text(`Payment Date: ${formatDate(payment.paymentDate)}`, 15, 55);
    doc.text(`Payment Method: ${payment.method}`, 15, 61);
    doc.text(`Reference Number: ${payment.referenceNumber}`, 15, 67);

    // Customer Information
    doc.setFont(undefined, 'bold');
    doc.text('Customer Information', 15, 78);
    doc.setFont(undefined, 'normal');
    doc.text(`Account Number: ${customer.accountNumber}`, 15, 84);
    doc.text(`Name: ${customer.customerName}`, 15, 90);
    doc.text(`Address: ${customer.address}`, 15, 96);

    // Bill Information
    doc.setFont(undefined, 'bold');
    doc.text('Bill Information', 15, 107);
    doc.setFont(undefined, 'normal');
    doc.text(`Bill ID: ${bill.id}`, 15, 113);
    doc.text(`Billing Period: ${bill.billingPeriod}`, 15, 119);
    doc.text(`Units Consumed: ${bill.unitsConsumed} kWh`, 15, 125);

    // Payment Details
    doc.setLineWidth(0.5);
    doc.line(15, 140, pageWidth - 15, 140);

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Amount Paid', 20, 150);
    doc.text(formatCurrency(payment.amount), pageWidth - 50, 150, { align: 'right' });

    doc.setLineWidth(0.5);
    doc.line(15, 155, pageWidth - 15, 155);

    // Status
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0, 128, 0);
    doc.text(`Status: ${payment.status.toUpperCase()}`, pageWidth / 2, 168, { align: 'center' });
    doc.setTextColor(0, 0, 0);

    // Footer
    doc.setFontSize(8);
    doc.setFont(undefined, 'italic');
    const footerY = doc.internal.pageSize.height - 20;
    doc.text('This is a computer-generated receipt and does not require a signature', pageWidth / 2, footerY, { align: 'center' });
    doc.text('For inquiries, call: 1987 | Email: customercare@ceb.lk', pageWidth / 2, footerY + 5, { align: 'center' });

    // Save the PDF
    doc.save(`CEB_Payment_Receipt_${payment.id}.pdf`);
};
