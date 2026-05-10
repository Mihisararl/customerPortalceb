import jsPDF from 'jspdf';
import cebLogo from '../assets/ceb-1.png';

const toNumber = (value) => {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : 0;
};

const isValidDateValue = (value) => {
    if (!value) return false;
    const date = new Date(value);
    return !Number.isNaN(date.getTime());
};

export const formatCurrency = (amount) => {
    const value = toNumber(amount);
    return `Rs. ${value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
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

const formatBillDate = (value) => {
    return isValidDateValue(value) ? formatDate(value) : 'N/A';
};

const calculateDueDateFromBillingMonth = (billingMonth) => {
    if (!billingMonth) return null;

    try {
        let date;

        if (billingMonth.includes('-')) {
            const [year, month] = billingMonth.split('-');
            date = new Date(parseInt(year, 10), parseInt(month, 10), 5);
        } else {
            date = new Date(billingMonth);
            if (!Number.isNaN(date.getTime())) {
                date.setMonth(date.getMonth() + 1);
                date.setDate(5);
            }
        }

        return !Number.isNaN(date?.getTime()) ? date.toISOString() : null;
    } catch (error) {
        return null;
    }
};

export const buildPrintableBill = (customer) => {
    const totalAmount = toNumber(customer?.currentBalance ?? customer?.totalAmount);
    const fixedCharge = toNumber(customer?.fixedCharge);
    const energyCharge = toNumber(customer?.energyCharge);
    const fuelAdjustment = toNumber(customer?.fuelAdjustment);
    const subtotal = toNumber(customer?.subtotal ?? (fixedCharge + energyCharge + fuelAdjustment));
    const tax = toNumber(customer?.tax ?? Math.max(totalAmount - subtotal, 0));
    const unitsConsumed = customer?.units ?? customer?.unitsConsumed ?? 0;
    const hasDetailedCharges = fixedCharge > 0 || energyCharge > 0 || fuelAdjustment > 0 || tax > 0;
    const billingPeriod = customer?.billingMonth || new Date().toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long'
    });
    const accountSuffix = customer?.accountNumber?.slice(-3) || '001';
    const normalizedBillingPeriod = billingPeriod.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');

    return {
        id: customer?.billId || `BILL-${normalizedBillingPeriod}-${accountSuffix}`,
        billingPeriod,
        readingDate: customer?.readingDate || null,
        dueDate: customer?.dueDate || calculateDueDateFromBillingMonth(customer?.billingMonth),
        previousReading: customer?.previousReading ?? 'N/A',
        currentReading: customer?.currentReading ?? 'N/A',
        unitsConsumed,
        fixedCharge,
        energyCharge,
        fuelAdjustment,
        subtotal: hasDetailedCharges ? subtotal : totalAmount,
        tax: hasDetailedCharges ? tax : 0,
        totalAmount,
        status: totalAmount > 0 ? 'unpaid' : 'paid',
        isPaid: totalAmount <= 0,
        paidAmount: toNumber(customer?.lastPaymentAmount),
        paidDate: customer?.lastPaymentDate || null,
        hasDetailedCharges
    };
};

const createBillPDFDocument = (bill, customer) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;
    const sectionWidth = pageWidth - (margin * 2);

    doc.setFillColor(242, 194, 0);
    doc.rect(margin, 38, sectionWidth, 1.5, 'F');

    // Add CEB Logo - horizontally scaled
    const logoWidth = 28;
    const logoHeight = 17;
    const logoX = 20;
    const logoY = 17;
    doc.addImage(cebLogo, 'PNG', logoX, logoY, logoWidth, logoHeight);

    // Header - aligned with logo
    doc.setTextColor(122, 0, 38);
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Electricity Distribution Lanka (Pvt) Ltd', logoX + logoWidth + 8, 25);

    doc.setTextColor(55, 65, 81);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('Customer Bill Statement', logoX + logoWidth + 8, 32);

    doc.setTextColor(31, 41, 55);

    const drawSectionHeader = (title, y) => {
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(margin, y - 5, sectionWidth, 10, 2, 2, 'F');
        doc.setTextColor(122, 0, 38);
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text(title, margin + 4, y + 1.5);
        doc.setTextColor(31, 41, 55);
    };

    const drawKeyValueRows = (rows, startY) => {
        let currentY = startY;

        rows.forEach(([label, value], index) => {
            if (index % 2 === 0) {
                doc.setFillColor(255, 255, 255);
            } else {
                doc.setFillColor(249, 250, 251);
            }

            doc.rect(margin, currentY - 4.5, sectionWidth, 8, 'F');
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(75, 85, 99);
            doc.text(label, margin + 4, currentY);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(17, 24, 39);
            doc.text(String(value), pageWidth - margin - 4, currentY, { align: 'right' });
            currentY += 8;
        });

        return currentY;
    };

    // Bill Information
    drawSectionHeader('Bill Information', 51);
    let currentY = drawKeyValueRows([
        ['Bill ID', bill.id],
        ['Billing Period', bill.billingPeriod || 'N/A'],
        ['Reading Date', formatBillDate(bill.readingDate)],
        ['Due Date', formatBillDate(bill.dueDate)],
    ], 60);

    // Customer Information
    currentY += 6;
    drawSectionHeader('Customer Information', currentY);
    currentY = drawKeyValueRows([
        ['Account Number', customer?.accountNumber || 'N/A'],
        ['Name', customer?.customerName || 'N/A'],
        ['Address', customer?.address || 'N/A'],
        ['Tariff', customer?.tariff || 'N/A'],
        ['Customer Type', customer?.customerType || 'N/A'],
    ], currentY + 9);

    // Reading Details
    currentY += 6;
    drawSectionHeader('Reading Details', currentY);
    currentY = drawKeyValueRows([
        ['Previous Reading', `${bill.previousReading} kWh`],
        ['Current Reading', `${bill.currentReading} kWh`],
        ['Units Consumed', `${bill.unitsConsumed} kWh`],
    ], currentY + 9);

    // Charges Table
    currentY += 6;
    drawSectionHeader(bill.hasDetailedCharges ? 'Charges Breakdown' : 'Billing Summary', currentY);

    const summaryRows = bill.hasDetailedCharges
        ? [
            ['Fixed Charge', formatCurrency(bill.fixedCharge)],
            ['Energy Charge', formatCurrency(bill.energyCharge)],
            ['Fuel Adjustment', formatCurrency(bill.fuelAdjustment)],
            ['Subtotal', formatCurrency(bill.subtotal)],
            ['Tax', formatCurrency(bill.tax)],
            ['Total Amount', formatCurrency(bill.totalAmount)],
        ]
        : [
            ['Billing Month', bill.billingPeriod || 'N/A'],
            ['Last Payment', bill.paidAmount > 0 ? formatCurrency(bill.paidAmount) : 'N/A'],
            ['Last Payment Date', formatBillDate(bill.paidDate)],
            ['Current Balance', formatCurrency(bill.totalAmount)],
            ['Amount Payable', formatCurrency(bill.totalAmount)],
        ];

    currentY = drawKeyValueRows(summaryRows, currentY + 9);

    // Payment Status
    currentY += 8;
    doc.setFillColor(bill.isPaid ? 220 : 254, bill.isPaid ? 252 : 243, bill.isPaid ? 231 : 199);
    doc.roundedRect(margin, currentY - 5, sectionWidth, 14, 3, 3, 'F');
    doc.setTextColor(bill.isPaid ? 21 : 146, bill.isPaid ? 128 : 64, bill.isPaid ? 61 : 14);
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text(`Status: ${bill.status.toUpperCase()}`, margin + 4, currentY + 1);

    if (bill.isPaid) {
        doc.setFont(undefined, 'normal');
        doc.text(`Paid Date: ${formatBillDate(bill.paidDate)}`, margin + 4, currentY + 7);
        doc.text(`Paid Amount: ${formatCurrency(bill.paidAmount)}`, pageWidth - margin - 4, currentY + 7, { align: 'right' });
    }

    doc.setTextColor(31, 41, 55);

    // Footer
    doc.setFontSize(8);
    doc.setFont(undefined, 'italic');
    const footerY = pageHeight - 20;
    doc.text('Thank you for being a valued customer of Electricity Distribution Lanka (Pvt) Ltd', pageWidth / 2, footerY, { align: 'center' });
    doc.text('For inquiries, call: 1987 | Email: customercare@ceb.lk', pageWidth / 2, footerY + 5, { align: 'center' });

    return doc;
};

export const generateBillPDFPreview = (bill, customer) => {
    const doc = createBillPDFDocument(bill, customer);
    const fileName = `CEB_Bill_${bill.id}.pdf`;
    return {
        blob: doc.output('blob'),
        fileName
    };
};

export const generateBillPDF = (bill, customer) => {
    const doc = createBillPDFDocument(bill, customer);

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
