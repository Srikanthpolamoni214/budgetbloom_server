
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../Models/db');

router.get('/verify-email', (req, res) => {
  const { token } = req.query;

  if (!token) return res.status(400).send('Invalid verification link.');

  try {
    const { email } = jwt.verify(token, process.env.SECRET_KEY);
console.log('Email from token:', email);
    // Update user to isVerified = true
    const query = 'UPDATE users SET isVerified = true WHERE email = ?';
    db.query(query, [email], (err, result) => {
      if (err) {
        console.error('DB error during email verification:', err);
        return res.status(500).send('Verification failed');
      }

      // res.send(`
      //   <h2>Email Verified ✅</h2>
      //   <p><a href="https://budgetbloom-client-app.vercel.app/login">Click here to log in</a></p>
      // `);
      
//     res.send(`
//   <html>
//     <head>
//       <meta http-equiv="refresh" content="1;url=https://budgetbloom-client-app.vercel.app/login" />
//     </head>
//     <body>
//     <div style="text-align: center; align-items: center; justify-content: center; padding: 20px;border: 2px solid green; border-radius: 10px;">
//       <h2 style="color: green; text-align: center;">Email Verified ✅</h2>
//       <p>You’ll be redirected to login shortly...</p>
//     </div>
//   </html>
// `);
res.send("verified successfully, you can now login to your account. Redirecting to login page...");

    });
  } catch (err) {
    console.error('Invalid/expired token:', err);
    res.send('Verification link is expired or invalid.');
  }
});

module.exports = router
