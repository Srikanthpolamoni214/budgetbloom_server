const path = require('path');
const fs = require('fs');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const db = require('../Models/db');
const dotenv = require("dotenv");

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

const loginController = (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = results[0];

    if (!user.password) {
      return res.status(400).json({ error: "Password not found in database" });
    }

    // Compare passwords using .then()
    bcrypt.compare(password, user.password)
      .then((isMatch) => {
        if (!isMatch) {
          return res.status(401).json({ error: "Invalid email or password" });
        }

        // Passwords match — generate token
        const token = jwt.sign(
          { email: user.email, id: user.id, photo: user.photo ,photoUrl: user.photoUrl, name: user.userName },
          SECRET_KEY,
          { expiresIn: "1h" }
        );

        return res.status(200).json({
          message: "Login successful",
          user,
          token,
        });
      })
      .catch((err) => {
        console.error("Error comparing passwords:", err);
        return res.status(500).json({ error: "Internal server error" });
      });
  });
};

module.exports = {
  loginController,
};
