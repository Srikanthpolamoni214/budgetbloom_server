const express = require('express');
const router = express.Router();
const db = require('../Models/db');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
// JWT middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("Auth header:", authHeader);
  if (!authHeader) return res.status(401).send("No token provided.");
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).send("Invalid token format.");
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(400).send("Invalid or expired token.");
  }
};
// ⚙️ Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'), // Save in /uploads
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Get extension
    const uniqueName = `image-${Date.now()}-${Math.floor(Math.random() * 1000000)}${ext}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// 📥 GET reviews + stats
router.get('/', (req, res) => {
  const query = `
    SELECT * FROM reviews ORDER BY created_at DESC;
    SELECT ROUND(AVG(rating), 1) AS averageRating, COUNT(*) AS totalReviews FROM reviews;
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching reviews' });

    const [reviews, [stats]] = results;
    res.json({
      reviews: reviews.map((r) => ({
        ...r,
        photo: r.photo ? r.photo : null, // Attach full URL
      })),
      averageRating: stats.averageRating || 0,
      totalReviews: stats.totalReviews,
    });
  });
});

// 📝 POST review with optional image
router.post('/', authenticate, upload.single('photo'), (req, res) => {
  const { name, rating, comment } = req.body;
  const photo = req.file ? req.file.filename : null;
  console.log("Received review data:", req.body, "Photo:", photo);

  if (!name || !rating || !comment) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const query = 'INSERT INTO reviews (id, name, rating, comment, photo) VALUES (?, ?, ?, ? ,?)';
  db.query(query, [  req.user.id, name, rating, comment, photo ] , (err) => {
    if (err) {
      console.error('Insert error:', err);
      return res.status(500).json({ message: 'Error saving review' });
    }

    res.status(201).json({ message: 'Review submitted' });
  });
});

module.exports = router;
