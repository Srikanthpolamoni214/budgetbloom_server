const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const db = require("../Models/db"); // Assuming db.js is in the Models directory

const dotenv =require("dotenv")
dotenv.config()
const SECRET_KEY = process.env.SECRET_KEY
// Load fresh income data
const loadIncomeData = () => {
  try {
    return JSON.parse(fs.readFileSync(incomeFile, "utf8"));
  } catch (err) {
    return [];
  }
};

// JWT middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).send("No token provided.");
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).send("Invalid token format.");
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    // console.log("okkkkk", decoded)
    req.user = decoded;
    console.log("ok", typeof req.user.id)
    next();
  } catch (err) {
    return res.status(400).send("Invalid or expired token.");
  }
};

// POST /income — group incomes by user
const incomepost = (req, res) => {
  const { source, amount, category, date } = req.body;
  if (!source || !amount || !category || !date) {
    return res.status(400).json({ message: "All fields are required." });
  }
console.log("Received income data:", req.body);
//   const incomeData = loadIncomeData();
  const newIncome = {
    source,
    amount,
    category,
    date,
    createdAt: new Date().toISOString()
  };

//   const userIndex = incomeData.findIndex(entry => entry.id === req.user.id);

//   if (userIndex !== -1) {
//     incomeData[userIndex].incomes.push(newIncome); // ✅ append to existing
//   } else {
//     incomeData.push({
//       id: req.user.id,
//       email: req.user.email,
//       incomes: [newIncome]
//     });
//   }

  try {
    db.query("INSERT INTO income (id,email, source, amount, category, date, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)", 
      [req.user.id , req.user.email  ,source, parseFloat(amount), category, date, new Date().toISOString()], (err) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ message: "Failed to save income." });
        }
      });
    res.status(201).json({ message: "Income Added Successfully", newIncome });
  } catch (err) {
    res.status(500).json({ message: "Failed to save income." });
  }
};

// GET /income — get income for current user
const incomeGet = (req, res) => {
  const userId = req.user.id;
  const userEmail = req.user.email;

  db.query("SELECT * FROM income WHERE id = ?", [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch income data." });
    }

    const incomesArray = rows.map(row => ({
      id: row.id,                 // ✅ include id
      email: row.email,           // ✅ include email
      source: row.source,
      amount: row.amount,
      category: row.category,
      date: row.date,
      createdAt: row.createdAt
    }));

    res.json(incomesArray); // ✅ Send array of objects with full info
  });
};

module.exports = { incomepost, incomeGet, authenticate };
