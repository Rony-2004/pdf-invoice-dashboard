const fs = require('fs');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');

async function createSampleInvoice() {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Add a page
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();

  // Header
  page.drawText('INVOICE', {
    x: 50,
    y: height - 50,
    size: 24,
    font: helveticaBoldFont,
    color: rgb(0, 0, 0),
  });

  // Vendor Information
  page.drawText('TechCorp Solutions LLC', {
    x: 50,
    y: height - 100,
    size: 14,
    font: helveticaBoldFont,
  });

  page.drawText('1234 Innovation Drive', {
    x: 50,
    y: height - 120,
    size: 10,
    font: timesRomanFont,
  });

  page.drawText('Silicon Valley, CA 94105', {
    x: 50,
    y: height - 135,
    size: 10,
    font: timesRomanFont,
  });

  page.drawText('Tax ID: 12-3456789', {
    x: 50,
    y: height - 150,
    size: 10,
    font: timesRomanFont,
  });

  // Invoice Details
  page.drawText('Invoice Number: INV-2024-0157', {
    x: 350,
    y: height - 100,
    size: 10,
    font: helveticaFont,
  });

  page.drawText('Invoice Date: 2024-03-15', {
    x: 350,
    y: height - 115,
    size: 10,
    font: helveticaFont,
  });

  page.drawText('Currency: USD', {
    x: 350,
    y: height - 130,
    size: 10,
    font: helveticaFont,
  });

  page.drawText('PO Number: PO-2024-789', {
    x: 350,
    y: height - 145,
    size: 10,
    font: helveticaFont,
  });

  page.drawText('PO Date: 2024-03-10', {
    x: 350,
    y: height - 160,
    size: 10,
    font: helveticaFont,
  });

  // Bill To
  page.drawText('Bill To:', {
    x: 50,
    y: height - 200,
    size: 12,
    font: helveticaBoldFont,
  });

  page.drawText('Digital Innovations Inc', {
    x: 50,
    y: height - 220,
    size: 10,
    font: timesRomanFont,
  });

  page.drawText('567 Business Blvd', {
    x: 50,
    y: height - 235,
    size: 10,
    font: timesRomanFont,
  });

  page.drawText('New York, NY 10001', {
    x: 50,
    y: height - 250,
    size: 10,
    font: timesRomanFont,
  });

  // Line Items Header
  page.drawText('Description', {
    x: 50,
    y: height - 300,
    size: 10,
    font: helveticaBoldFont,
  });

  page.drawText('Qty', {
    x: 300,
    y: height - 300,
    size: 10,
    font: helveticaBoldFont,
  });

  page.drawText('Unit Price', {
    x: 350,
    y: height - 300,
    size: 10,
    font: helveticaBoldFont,
  });

  page.drawText('Total', {
    x: 450,
    y: height - 300,
    size: 10,
    font: helveticaBoldFont,
  });

  // Line Items
  page.drawText('Web Application Development', {
    x: 50,
    y: height - 320,
    size: 10,
    font: timesRomanFont,
  });

  page.drawText('1', {
    x: 300,
    y: height - 320,
    size: 10,
    font: timesRomanFont,
  });

  page.drawText('$8,500.00', {
    x: 350,
    y: height - 320,
    size: 10,
    font: timesRomanFont,
  });

  page.drawText('$8,500.00', {
    x: 450,
    y: height - 320,
    size: 10,
    font: timesRomanFont,
  });

  page.drawText('Database Design & Setup', {
    x: 50,
    y: height - 340,
    size: 10,
    font: timesRomanFont,
  });

  page.drawText('1', {
    x: 300,
    y: height - 340,
    size: 10,
    font: timesRomanFont,
  });

  page.drawText('$2,200.00', {
    x: 350,
    y: height - 340,
    size: 10,
    font: timesRomanFont,
  });

  page.drawText('$2,200.00', {
    x: 450,
    y: height - 340,
    size: 10,
    font: timesRomanFont,
  });

  page.drawText('Quality Assurance Testing', {
    x: 50,
    y: height - 360,
    size: 10,
    font: timesRomanFont,
  });

  page.drawText('1', {
    x: 300,
    y: height - 360,
    size: 10,
    font: timesRomanFont,
  });

  page.drawText('$1,800.00', {
    x: 350,
    y: height - 360,
    size: 10,
    font: timesRomanFont,
  });

  page.drawText('$1,800.00', {
    x: 450,
    y: height - 360,
    size: 10,
    font: timesRomanFont,
  });

  // Totals
  page.drawText('Subtotal:', {
    x: 350,
    y: height - 400,
    size: 10,
    font: helveticaBoldFont,
  });

  page.drawText('$12,500.00', {
    x: 450,
    y: height - 400,
    size: 10,
    font: timesRomanFont,
  });

  page.drawText('Tax (8.25%):', {
    x: 350,
    y: height - 420,
    size: 10,
    font: helveticaBoldFont,
  });

  page.drawText('$1,031.25', {
    x: 450,
    y: height - 420,
    size: 10,
    font: timesRomanFont,
  });

  page.drawText('Total:', {
    x: 350,
    y: height - 440,
    size: 12,
    font: helveticaBoldFont,
  });

  page.drawText('$13,531.25', {
    x: 450,
    y: height - 440,
    size: 12,
    font: helveticaBoldFont,
  });

  // Save the PDF
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('sample-invoice.pdf', pdfBytes);
  console.log('✅ Sample invoice created: sample-invoice.pdf');
}

createSampleInvoice().catch(console.error);
