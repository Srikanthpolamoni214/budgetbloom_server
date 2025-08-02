const nodemailer = require('nodemailer');

// Replace with your actual Gmail and App Password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'srikanthpolamoni180@gmail.com',
    pass: 'nyqx ynor puub roqx', // <-- Use Gmail App Password here
  },
});

// Optional: Check connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP connection failed:', error);
  } else {
    console.log('✅ SMTP is ready to send emails.');
  }
});

// Email details
const mailOptions = {
  from: 'srikanthpolamoni180@gmail.com',
  to: 'recipient@example.com', // <-- Replace with recipient email
  subject: 'Nodemailer Test',
  html: `<h2>✅ Hello from Nodemailer</h2><p>This is a test email sent from Node.js!</p>`,
};

// Send mail
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('❌ Email send error:', error.message);
  } else {
    console.log('✅ Email sent successfully:', info.response);
  }
});
