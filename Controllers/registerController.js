// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const bcrypt = require('bcrypt');
// const db = require('../Models/db');
// const path = require('path');
// const nodemailer = require('nodemailer'); // ✅ Add nodemailer

// // Multer setup
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, '../uploads'));
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = 'profile-' + Date.now() + '-' + file.originalname;
//     cb(null, uniqueName);
//   }
// });
// const upload = multer({ storage });

// // Register route
// router.post('/register', upload.single('photo'), (req, res) => {
//   const { userName, phoneNumber, email, password, age, gender } = req.body;
//   const photo = req.file?.filename || null;

//   db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
//     if (err) {
//       console.error('Error checking existing user:', err);
//       return res.status(500).json({ message: 'Database error' });
//     }

//     if (results.length > 0) {
//       return res.json({ message: 'Email already registered' });
//     }

//     bcrypt.hash(password, 10, (err, hashedPassword) => {
//       if (err) {
//         console.error('Password hashing error:', err);
//         return res.status(500).json({ message: 'Encryption failed' });
//       }

//       const query = `
//         INSERT INTO users (userName, phoneNumber, email, password, age, gender, photo)
//         VALUES (?, ?, ?, ?, ?, ?, ?)
//       `;
//       const values = [userName, phoneNumber, email, hashedPassword, age, gender, photo];

//       db.query(query, values, (err) => {
//         if (err) {
//           console.error('Insert error:', err);
//           return res.status(500).json({ message: 'User registration failed' });
//         }

//         // ✅ Send Welcome Email using Nodemailer
//         const transporter = nodemailer.createTransport({
//           service: 'gmail',
//           auth: {
//             user: 'srikanthpolamoni180@gmail.com', // replace with your email
//             pass: 'nyqx ynor puub roqx',   // use app password (NOT regular password)
//           },
//         });

//         const mailOptions = {
//           from: 'srikanthpolamoni180@gmail.com',
//           to: email,
//           subject: 'Welcome to Our Platform!',
//           html: `<h3>Hello ${userName},</h3><p>🎉 You have successfully registered.</p><p>Thanks for joining us!</p>`,
//         };

//         transporter.sendMail(mailOptions, (error, info) => {
//           if (error) {
//             console.error('Email send error:', error);
//           } else {
//             console.log('Email sent:', info.response);
//           }

//           // ✅ Always send response to frontend
//           res.json({ message: 'User registered successfully' });
//         });
//       });
//     });
//   });
// });

// module.exports = router;



// router.post('/register', upload.single('photo'), (req, res) => {
//   console.log("📩 /register hit");

//   const { userName, phoneNumber, email, password, age, gender } = req.body;
//   const photo = req.file?.filename || null;

//   console.log("📦 Received Data:", { userName, phoneNumber, email, age, gender, photo });

//   db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
//     if (err) {
//       console.error('❌ Error checking existing user:', err);
//       return res.status(500).json({ message: 'Database error' });
//     }

//     if (results.length > 0) {
//       console.warn('⚠️ Email already registered');
//       return res.json({ message: 'Email already registered' });
//     }

//     bcrypt.hash(password, 10, (err, hashedPassword) => {
//       if (err) {
//         console.error('❌ Password hashing error:', err);
//         return res.status(500).json({ message: 'Encryption failed' });
//       }

//       const query = `
//         INSERT INTO users (userName, phoneNumber, email, password, age, gender, photo)
//         VALUES (?, ?, ?, ?, ?, ?, ?)
//       `;
//       const values = [userName, phoneNumber, email, hashedPassword, age, gender, photo];

//       db.query(query, values, (err) => {
//         if (err) {
//           console.error('❌ Insert error:', err);
//           return res.status(500).json({ message: 'User registration failed' });
//         }

//         console.log("✅ User inserted into database");

//         const transporter = nodemailer.createTransport({
//           service: 'gmail',
//           auth: {
//             user: 'srikanthpolamoni180@gmail.com',
//             pass: 'nyqx ynor puub roqx',
//           },
//         });

//         transporter.verify((err, success) => {
//           if (err) {
//             console.error('❌ SMTP Error:', err.message);
//           } else {
//             console.log('✅ SMTP connection successful');
//           }
//         });

//         const mailOptions = {
//           from: 'srikanthpolamoni180@gmail.com',
//           to: email,
//           subject: 'Welcome to Our Platform!',
//           html: `<h3>Hello ${userName},</h3><p>🎉 You have successfully registered.</p><p>Thanks for joining us!</p>`,
//         };

//         console.log("📨 Sending email to", email);

//         transporter.sendMail(mailOptions, (error, info) => {
//           if (error) {
//             console.error('❌ Email send error:', error.message);
//           } else {
//             console.log('✅ Email sent successfully:', info.response);
//           }

//           res.json({ message: 'User registered successfully' });
//         });
//       });
//     });
//   });
// });



const express = require('express');
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcrypt');
const db = require('../Models/db');
const path = require('path');
const nodemailer = require('nodemailer');
const dotenv =require("dotenv")
dotenv.config()
const SECRET_KEY = process.env.SECRET_KEY
const jwt = require('jsonwebtoken')

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = 'profile-' + Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Main /register POST route
router.post('/register', upload.single('photo'), (req, res) => {
  const { userName, phoneNumber, email, password, age, gender } = req.body;
  const photo = req.file?.filename || null;

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    if (results.length > 0) {
      return res.json({ message: 'Email already registered' });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ message: 'Encryption failed' });

      const query = `
        INSERT INTO users (userName, phoneNumber, email, password, age, gender, photo)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [userName, Number(phoneNumber), email, hashedPassword, Number(age), gender, photo];

      db.query(query, values, (err) => {
        console.log("📦 Inserted Data:", err)
        if (err) return res.status(500).json({ message: 'User registration failed' });

        // Send email
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user:process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS, // App password
          },
        });

//         const mailOptions = {
//           from: process.env.EMAIL_USER,
//           to: email,
//           subject: 'Welcome to Our Platform!',
//       html: `
//   <div style="font-family: Arial, sans-serif; padding: 10px;">
//     <h2>Welcome to <span style="color:#22c55e;">BudgetBloom</span>, ${userName}!</h2>
//     <p>🎉 You have successfully registered.</p>
//     <p>Start managing your finances better today.</p>
//     <p>🚀 <a href="http://localhost:5173/login">Login here</a></p>
//     <br>
//     <small style="color:gray;">If you didn't sign up, you can ignore this email.</small>
//   </div>
// `

//         };
const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '10m' });

const verifyLink = `https://budgetbloom-client-app.vercel.app/verify-email?token=${token}`;
// const verifyLink = `https://budgetbloom-server.onrender.com/verify-email?token=${token}`;

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: email,
  subject: 'Verify your Email – BudgetBloom',
  html: `
    <div style="font-family: Arial, sans-serif; padding: 10px;">
      <h2>Welcome to <span style="color:#22c55e;">BudgetBloom</span>, ${userName}!</h2>
      <p>🎉 You’ve successfully registered. Please verify your email to continue.</p>
      <p><a href="${verifyLink}" style="background:#22c55e;color:white;padding:10px 15px;text-decoration:none;border-radius:5px;">Verify Email</a></p>
      <p>This link will expire in 10 minutes.</p>
    </div>
  `,
};

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Email send error:', error.message);
          } else {
            console.log('Email sent:', info.response);
          }

          res.json({ message: 'User registered successfully' });
        });
      });
    });
  });
});

module.exports = router;
