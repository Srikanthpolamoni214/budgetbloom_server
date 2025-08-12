
const express = require("express")
const router = express.Router()
const db = require('../Models/db');

router.post("/contact", (req, res) => {
  const { name, email, message } = req.body
  // Handle form submission logic here
  db.query("INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)", [name, email, message], (error, results) => {
    if (error) {
      console.error("Error inserting data:", error)
      return res.status(500).json({ error: "Internal server error" })
    }
    res.status(200).json({ message: "Form submitted successfully" })
  })
})

module.exports = router