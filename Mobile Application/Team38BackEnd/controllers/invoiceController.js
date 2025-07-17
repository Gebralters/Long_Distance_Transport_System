const { Booking, Payment, Customer } = require('../models');
const moment = require('moment');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.generateInvoice = async (req, res) => {
  try {
    const { bookingId } = req.query;

    // Fetch booking and related details
    const booking = await Booking.findOne({
      where: { B_ID: bookingId },
      include: [
        { model: Payment },
        { model: Customer }
      ],
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (!booking.Payment || booking.Payment.length === 0) {
      return res.status(404).json({ message: 'Payment details not found for the booking' });
    }

    // Extract necessary information
    const invoice = {
      bookingId: booking.B_ID,
      amount: booking.Payment[0]?.PAY_AMOUNT || 0, // Use the first payment record, handle case where it's missing
      date: moment(booking.B_DATETIME).format('MMMM Do YYYY'),
      status: booking.B_STATUS,
      customerName: `${booking.Customer.U_FIRSTNAME} ${booking.Customer.U_SURNAME}`,
    };

    // Ensure the invoices directory exists
    const invoicesDir = path.resolve(__dirname, '../invoices');
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir);
    }

    // Create a PDF document
    const doc = new PDFDocument({ margin: 50 });
    const filePath = path.join(invoicesDir, `invoice_${invoice.bookingId}.pdf`);

    doc.pipe(fs.createWriteStream(filePath));

    // Add content to the PDF
    doc.image('../assets/Picture1.png', 50, 45, { width: 50 })
      .fillColor('#444444')
      .fontSize(20)
      .text('Invoice', 110, 57)
      .fontSize(10)
      .text(`Invoice No: ${invoice.bookingId}`, 200, 65, { align: 'right' })
      .text(`Date: ${moment().format('MMMM Do YYYY')}`, 200, 80, { align: 'right' })
      .moveDown();

    // Customer Info
    doc.text(`Recipient: ${invoice.customerName}`, 50, 200)
      .text(`Booking ID: ${invoice.bookingId}`, 50, 215)
      .moveDown();

    // Invoice Table
    doc.moveDown()
      .text('Item', 50, 250)
      .text('Amount', 500, 250, { align: 'right' })
      .moveTo(50, 265)
      .lineTo(550, 265)
      .stroke();

    doc.text('Booking Fee', 50, 280)
      .text(`$${invoice.amount}`, 500, 280, { align: 'right' });

    // Total
    doc.moveTo(50, 320)
      .lineTo(550, 320)
      .stroke();

    doc.fontSize(10)
      .text('Total', 50, 340)
      .text(`$${invoice.amount}`, 500, 340, { align: 'right' });

    doc.end();

    // Respond with the invoice data and PDF link
    res.status(200).json({
      invoice,
      pdfLink: `${req.protocol}://${req.get('host')}/invoices/invoice_${invoice.bookingId}.pdf`
    });
  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
