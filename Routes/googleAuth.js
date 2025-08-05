// const express = require('express');
// const router = express.Router();
// const jwt = require('jsonwebtoken');
// const db = require('../Models/db');
// const dotenv = require("dotenv")
// dotenv.config()
// const SECRET_KEY = process.env.SECRET_KEY;
// router.post('/google-auth',  (req, res) => {
//   const { name, email, photo } = req.body;
//   if (!email || !name) {
//     return res.status(400).json({ success: false, message: 'Missing user data' });
//   }
//   try {
//     // Check if user already exists
//      db.query('SELECT * FROM users WHERE email = ?', [email], (err,results)=>{
// if (results.length === 0) {
//       // New user → Insert into DB
//        db.query(
//         'INSERT INTO users (userName, email, photo, registeredVia) VALUES (?, ?, ?, ?)',
//         [name, email, photo, 'google']
//       );
//     }
// // Create JWT token
//     const token = jwt.sign({ email ,name }, SECRET_KEY, { expiresIn: '1h' });
//     console.log("token", token)
//     res.json({
//       success: true,
//       message: 'Google sign-in successful',
//       token,
//     });
//     });  
//   } catch (err) {
//     console.error('Google Auth Error:', err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });
// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const jwt = require('jsonwebtoken');
// const multer = require('multer');
// const path = require('path');
// const db = require('../Models/db');
// const dotenv = require("dotenv");
// dotenv.config();

// const SECRET_KEY = process.env.SECRET_KEY;

// // Multer config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Ensure this folder exists
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
//     cb(null, uniqueName);
//   }
// });
// const upload = multer({ storage: storage });

// // POST route for Google Auth + Photo Upload
// router.post('/google-auth', upload.single('photo'), (req, res) => {
//   const { name, email } = req.body;
//   const photoPath = req.file ? req.file.filename : null;
// console.log("Photo Path:", photoPath);
//   if (!email || !name) {
//     return res.status(400).json({ success: false, message: 'Missing user data' });
//   }

//   try {
//     db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
//       if (err) {
//         console.error("DB Error:", err);
//         return res.status(500).json({ success: false, message: 'Database error' });
//       }

//       if (results.length === 0) {
//         // New user → insert
//         db.query(
//           'INSERT INTO users (userName, email, photo, registeredVia) VALUES (?, ?, ?, ?)',
//           [name, email, photoPath, 'google']
//         );
//       }

//       const token = jwt.sign({ email, name }, SECRET_KEY, { expiresIn: '1h' });

//       res.json({
//         success: true,
//         message: 'Google sign-in successful',
//         token,
//         photoUrl: photoPath ? `/uploads/${photoPath}` : null
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
const db = require('../Models/db');
const dotenv = require("dotenv");
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

// POST route for Google Auth
router.post('/google-auth', (req, res) => {
  const { name, email, photoUrl,photo } = req.body;

console.log("Google Auth Data:", req.body);
  if (!email || !name || !photoUrl) {
    return res.status(400).json({ success: false, message: 'Missing user data' });
  }

  try {
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      if (results.length === 0) {
        // New user → insert
        db.query(
          'INSERT INTO users (userName, email, photo, registeredVia) VALUES (?, ?, ?, ?)',
          [name, email, photoUrl, 'google']
        );
      }
const user = results[0];
      // Create JWT token
      const { id } = user;
  

      const token = jwt.sign({ email,id, name, photoUrl }, SECRET_KEY, { expiresIn: '1h' });

      res.json({
        success: true,
        message: 'Google sign-in successful',
        token,
        photoUrl: photoUrl
      });
    });
  } catch (err) {
    console.error('Google Auth Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
