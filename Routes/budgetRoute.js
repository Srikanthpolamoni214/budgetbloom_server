const express = require("express");
const router = express.Router();

const db = require("../Models/db"); // Assuming db.js is in the Models directory
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")
dotenv.config()
const SECRET_KEY = process.env.SECRET_KEY;


const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Forbidden" });
    req.user = user;
    next();
  });
};

// 📥 GET all budgets
router.get("/",  authenticate ,(req, res) => {
  // const data = readData();
  db.query("SELECT * FROM budget WHERE id = ?", [req.user.id], (err, results) => {
    if (err) {
      console.error("Error fetching budgets:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// ➕ POST new budget category
router.post("/", authenticate, (req, res) => {
  const { name, amount, spent = 0 } = req.body;
  if (!name || amount == null)
    return res.status(400).json({ error: "Invalid data" });

  // const data = readData();
  const newBudget = {
    id: req.user.id,
    name,
    amount: parseFloat(amount),
    spent: parseFloat(spent),
  };

  db.query(
    "INSERT INTO budget (name, amount, spent, id) VALUES (?, ?, ?, ?)",
    [newBudget.name, newBudget.amount, newBudget.spent, newBudget.id],
    (err, result) => {
      if (err) {
        console.error("Error inserting budget:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(201).json(newBudget);
    }
  );
});

// ✅ Corrected DELETE route
router.delete("/:budget_id", authenticate, (req, res) => {
  const budgetId = parseInt(req.params.budget_id);
  const userId = req.user.id;
console.log("Deleting budget with ID:", budgetId, "for user ID:", userId);
  db.query("DELETE FROM budget WHERE budget_id = ? AND id = ?", [budgetId, userId], (err, result) => {
    if (err) {
      console.error("Error deleting budget:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Budget not found or unauthorized" });
    }

    res.json({ success: true });
  });
});
module.exports = router;
