// const express = require('express');
// const router = express.Router();

// const allTransactions = require('../Models/allTransactions.json');
// // const fs = require('fs');
// // const path = require('path');

// // const incomePath = path.join(__dirname, '../Models/income.json');
// // const expensePath = path.join(__dirname, '../Models/expenses.json');
// // Middleware to parse JSON bodiesconst jwt = require("jsonwebtoken");
// const jwt = require("jsonwebtoken");
// const db = require("../Models/db"); // Assuming db.js is in the Models directory
// const SECRET_KEY = "srikanth@214";
// // Route to get all transactions
// // GET /api/transactions (merge income + expenses)
// const authenticate = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   if (!authHeader) return res.status(401).send("No token provided.");
//   const token = authHeader.split(" ")[1]; 
//   if (!token) return res.status(401).send("Invalid token format.");
//   try {
//     const decoded = jwt.verify(token, SECRET_KEY);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(400).send("Invalid or expired token.");
//   }
// };

// // Utility to safely parse and normalize income data
// const getIncomeData = () => {
//   // const raw = fs.readFileSync(incomePath, 'utf8');
//   // const data = JSON.parse(raw); // [{ id, email, incomes: [...] }]

//   // const normalized = [];

//   data.forEach(user => {
//     user.incomes.forEach((incomeEntry, index) => {
//       normalized.push({
//         id: `income-${user.id}-${index + 1}`,       // Unique ID
//         type: 'income',
//         description: incomeEntry.source,
//         amount: parseFloat(incomeEntry.amount),
//         date: incomeEntry.date,
//         category: incomeEntry.category || 'income',
//         userId: user.id,
//         email: user.email,
//         createdAt: incomeEntry.createdAt
//       });
//     });
//   });

//  db.query("SELECT * FROM income WHERE id = ?", [req.user.id], (err, results) => {
//     if (err) {
//       console.error("Error fetching income:", err);
//       return res.status(500).json({ error: "Failed to fetch income" });
//     }
//     return results.map((item, index) => ({
//       id: `income-${index + 1}`,
//       type: 'income',
//       description: item.source,
//       amount: parseFloat(item.amount),
//       date: item.date,
//       category: item.category || 'income',
//       userId: item.id,
//       email: item.email,
//       createdAt: item.createdAt
//     }));
//   })
// };













// // Utility to safely parse and normalize expense data
// const getExpenseData = () => {
//   // const raw = fs.readFileSync(expensePath, 'utf8');
//   // const data = JSON.parse(raw);
//   // return data.map((item, index) => ({
//   //   id: `expense-${index + 1}`,
//   //   type: 'expense',
//   //   description: item.description,
//   //   amount: parseFloat(item.amount),
//   //   date: item.date,
//   //   category: item.category || 'expense'
//   // }));
//   db.query("SELECT * FROM expenses WHERE id = ?", [req.user.id], (err, results) => {
//     if (err) {
//       console.error("Error fetching expenses:", err);
//       return res.status(500).json({ error: "Failed to fetch expenses" });
//     }
//     return results.map((item, index) => ({
//       id: `expense-${index + 1}`,
//       type: 'expense',
//       description: item.description,
//       amount: parseFloat(item.amount),
//       date: item.date,
//       category: item.category || 'expense',
//       userId: item.id,
//       email: item.email,
//       createdAt: item.createdAt
//     }));
//   });
// };

// // GET /api/transactions (combine + sort)
// router.get('/api/transactions',authenticate ,(req, res) => {
//   try {
//     const income = getIncomeData();
//     const expenses = getExpenseData();
//     console.log('Income transactions:', income);
//     console.log('Expense transactions:', expenses);
//     const combined = [...income, ...expenses];

//     // Sort by date (most recent first)
//     combined.sort((a, b) => new Date(b.date) - new Date(a.date));

//     // console.log('Combined transactions:', combined);
//     res.json({data:combined});
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to load transactions' });
//     console.log('Error loading transactions:', err);
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../Models/db");
const dotenv = require("dotenv")
dotenv.config()
const SECRET_KEY = process.env.SECRET_KEY;

// Middleware for JWT Authentication
const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
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

// Async utility to get income data
const getIncomeData = (userId) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM income WHERE id = ?", [userId], (err, results) => {
      if (err) return reject(err);
      const income = results.map((item, index) => ({
        id: `income-${index + 1}`,
        type: 'income',
        description: item.source,
        amount: parseFloat(item.amount),
        date: item.date,
        category: item.category || 'income',
        userId: item.id,
        email: item.email,
        createdAt: item.createdAt
      }));
      resolve(income);
    });
  });
};

// Async utility to get expense data
const getExpenseData = (userId) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM expenses WHERE id = ?", [userId], (err, results) => {
      if (err) return reject(err);
      const expenses = results.map((item, index) => ({
        id: `expense-${index + 1}`,
        type: 'expense',
        description: item.description,
        amount: parseFloat(item.amount),
        date: item.date,
        category: item.category || 'expense',
        userId: item.id,
        email: item.email,
        createdAt: item.createdAt
      }));
      resolve(expenses);
    });
  });
};

// GET /api/transactions - merge + sort
router.get('/api/transactions', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const [income, expenses] = await Promise.all([
      getIncomeData(userId),
      getExpenseData(userId)
    ]);

    const combined = [...income, ...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json({ data: combined });
  } catch (err) {
    console.error("Error loading transactions:", err);
    res.status(500).json({ error: "Failed to load transactions" });
  }
});

module.exports = router;
