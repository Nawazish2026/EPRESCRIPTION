
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const mailgen = require('mailgen');
const fs = require('fs');

// POST /api/prescription/email
router.post('/email', async (req, res) => {
  const { patientEmail, prescription, doctor } = req.body;

  // Generate PDF
  // For now, let's assume the PDF is already generated and sent in the request body
  // In a real-world scenario, you would generate the PDF here using a library like PDFKit

  // Configure nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Configure mailgen
  const mailGenerator = new mailgen({
    theme: 'default',
    product: {
      name: 'E-Prescription',
      link: 'http://localhost:5173',
    },
  });

  // Create email
  const email = {
    body: {
      name: patientEmail,
      intro: 'Here is your prescription from your recent appointment.',
      table: {
        data: prescription.medicines.map((medicine) => ({
          Medicine: medicine.name,
          Dosage: medicine.dosage,
          Frequency: medicine.frequency,
        })),
      },
      outro: `This prescription was issued by ${doctor.name}.`,
    },
  };

  const emailBody = mailGenerator.generate(email);

  // Send email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: patientEmail,
    subject: 'Your E-Prescription',
    html: emailBody,
    // attachments: [
    //   {
    //     filename: 'prescription.pdf',
    //     content: prescription.pdf, // Assuming the PDF is sent as a base64 string
    //     encoding: 'base64',
    //   },
    // ],
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending email');
  }
});

module.exports = router;
