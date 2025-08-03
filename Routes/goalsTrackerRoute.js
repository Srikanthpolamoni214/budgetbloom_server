


// routes/goalsRoute.js
const express = require('express');
const router = express.Router();
const db = require("../Models/db");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")
dotenv.config()
const SECRET_KEY = process.env.SECRET_KEY;


// 🔐 Middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send({ message: "Unauthorized" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).send({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

// 🔁 Helper: Get total savings (income - expenses)
const getTotalSavings = (userId) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT SUM(amount) as totalIncome FROM income WHERE id = ?", [userId], (err, incomeResult) => {
      if (err) return reject("Income fetch error");

      db.query("SELECT SUM(amount) as totalExpenses FROM expenses WHERE id = ?", [userId], (err, expenseResult) => {
        if (err) return reject("Expense fetch error");

        const totalIncome = incomeResult[0]?.totalIncome || 0;
        const totalExpenses = expenseResult[0]?.totalExpenses || 0;
        resolve(totalIncome - totalExpenses);
      });
    });

  });
};

// 📥 GET /api/goalsTracker
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    db.query("SELECT * FROM goals WHERE id = ?", [userId], async (err, results) => {
      if (err) {
        console.error("Error fetching goals:", err);
        return res.status(500).json({ error: "Failed to fetch goals" });
      }

      const totalSavings = await getTotalSavings(userId);

      const updatedGoals = results.map(goal => {
        const totalGoalAmount = results.reduce((sum, g) => sum + Number(g.amount), 0);
        const saved = Math.min(Number(goal.amount), Math.floor((totalSavings * Number(goal.amount)) / (totalGoalAmount || 1)));
        return { ...goal, saved };
      });

      res.json(updatedGoals);
    });
  } catch (err) {
    console.error("Error in /api/goalsTracker:", err);
    res.status(500).json({ error: 'Failed to calculate goal savings' });
  }
});

// ➕ POST /api/goalsTracker
router.post('/', authenticate, (req, res) => {
  const { name, amount, targetDate, category, saved } = req.body;
  console.log("Received goal data:", req.body);
  if (!name || !amount || !targetDate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.query(
    "INSERT INTO goals (name, amount, targetDate, category, saved, id) VALUES (?, ?, ?, ?, ?, ?)",
    [name, parseFloat(amount), targetDate, category || '', parseFloat(saved || 0), req.user.id],
    (err, result) => {
      if (err) {
        console.error("Error inserting goal:", err);
        return res.status(500).json({ error: 'Database error' });
      }

      res.status(201).json({
        id: result.insertId,
        name,
        amount: parseFloat(amount),
        targetDate,
        category,
        saved: parseFloat(saved || 0)
      });
    }
  );
});

// ❌ DELETE /api/goals/:id
router.delete('/:id', authenticate, (req, res) => {
  const goalId = req.params.id;
  const userId = req.user.id;

  db.query("DELETE FROM goals WHERE id = ? AND goal_id = ?", [userId, goalId], (err, result) => {
    if (err) {
      console.error("Error deleting goal:", err);
      return res.status(500).json({ error: "Failed to delete goal" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Goal not found" });
    }

    res.json({ success: true });
  });
});

// ✏️ PUT (optional future implementation)
router.put('/:id', authenticate, (req, res) => {
  const goalId = req.params.id;
  const { name, amount, targetDate, category, saved } = req.body;

  db.query(
    "UPDATE goals SET name = ?, amount = ?, targetDate = ?, category = ?, saved = ? WHERE goal_id = ? AND id = ?",
    [name, amount, targetDate, category, saved, goalId, req.user.id],
    (err, result) => {
      if (err) {
        console.error("Error updating goal:", err);
        return res.status(500).json({ error: "Database error" });
      }

      res.json({ success: true });
    }
  );
});

module.exports = router;
