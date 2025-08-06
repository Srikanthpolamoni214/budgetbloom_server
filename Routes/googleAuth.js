

// const express = require('express');
// const router = express.Router();
// const jwt = require('jsonwebtoken');
// const db = require('../Models/db');
// const dotenv = require("dotenv");
// dotenv.config();

// const SECRET_KEY = process.env.SECRET_KEY;

// // POST route for Google Auth
// router.post('/google-register', (req, res) => {
//   const { name, email, photoUrl,password } = req.body;

// console.log("Google Auth Data:", req.body);
//   if (!email || !name || !photoUrl) {
//     return res.status(400).json({ success: false, message: 'Missing user data' });
//   }

//   try {
//     db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
//       if (err) {
//         console.error("DB Error:", err);
//         return res.status(500).json({ success: false, message: 'Database error' });
//       }

//       if (results.length === 0) {
//         // New user → insert
//         const bcrypt = require("bcrypt");
// const hashedPassword = await bcrypt.hash(password, 10);

//         db.query(
//           'INSERT INTO users (userName, email, photo, registeredVia, password) VALUES (?, ?, ?, ?, ?)',
//           [name, email, photoUrl, 'google' , hashedPassword]
//         );
//       }


//       const token = jwt.sign({ email, name, photoUrl }, SECRET_KEY, { expiresIn: '1h' });

//       res.json({
//         success: true,
//         message: 'Google sign-in successful',
//         token,
//         photoUrl: photoUrl
//       });
//     });
//   } catch (err) {
//     console.error('Google Auth Error:', err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const db = require('../Models/db');
const dotenv = require("dotenv");

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

router.post('/google-register', (req, res) => {
  const { name, email, photoUrl, password } = req.body;

  if (!email || !name || !photoUrl || !password) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (results.length === 0) {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query(
          'INSERT INTO users (userName, email, photoUrl, registeredVia, password) VALUES (?, ?, ?, ?, ?)',
          [name, email, photoUrl, 'google', hashedPassword],
          (insertErr) => {
            if (insertErr) {
              console.error("Insert Error:", insertErr);
              return res.status(500).json({ success: false, message: 'User creation failed' });
            }

            const token = jwt.sign({ email, name, photoUrl }, SECRET_KEY, { expiresIn: '1h' });
            return res.json({
              success: true,
              message: 'Google sign-up successful',
              token,
              photoUrl,
            });
          }
        );
      } catch (hashErr) {
        console.error("Hash Error:", hashErr);
        return res.status(500).json({ success: false, message: 'Password hashing failed' });
      }
    } 

    else {
      return res.status(400).json({ success: false, message: 'Email already exists'
      });
    }
    // else {
    //   const user = results[0];
    // const {id} = user;
    // bcrypt.compare(password, user.password, (compareErr, isMatch) => {
    //     if (compareErr) {
    //       console.error("Compare Error:", compareErr);
    //       return res.status(500).json({ success: false, message: 'Password comparison failed' });
    //     }
    //     if (!isMatch) {
    //       return res.status(401).json({ success: false, message: 'Invalid credentials' });
    //     }



    //   // User already exists → Just issue token
    //   const token = jwt.sign({ email, id, name, photoUrl }, SECRET_KEY, { expiresIn: '1h' });
    //   return res.json({
    //     success: true,
    //     message: 'Google login successful',
    //     token,
    //     photoUrl,
    //   });
    // })
    // }

    
  });
});

module.exports = router;
