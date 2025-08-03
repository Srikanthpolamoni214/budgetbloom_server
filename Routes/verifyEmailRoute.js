
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
    res.send(`
  <html>
    <head>
      <meta http-equiv="refresh" content="3;url=https://budgetbloom-client-app.vercel.app/login" />
    </head>
    <body>
      <h2>Email Verified ✅</h2>
      <p>You’ll be redirected to login shortly...</p>
    </body>
  </html>
`);

    });
  } catch (err) {
    console.error('Invalid/expired token:', err);
    res.send('Verification link is expired or invalid.');
  }
});

module.exports = router
