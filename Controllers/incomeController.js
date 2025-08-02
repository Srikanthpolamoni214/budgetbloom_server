const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const db = require("../Models/db");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).send("No or invalid token format.");
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send("Invalid or expired token.");
  }
};

const incomepost = (req, res) => {
  const { source, amount, category, date } = req.body;
  if (!source || !amount || !category || !date) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const newIncome = {
    source,
    amount,
    category,
    date,
    createdAt: new Date().toISOString()
  };

  db.query(
    "INSERT INTO income (id, email, source, amount, category, date, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [req.user.id, req.user.email, source, parseFloat(amount), category, date, newIncome.createdAt],
    (err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to save income." });
      }
      res.status(201).json({ message: "Income added successfully", newIncome });
    }
  );
};

const incomeGet = (req, res) => {
  db.query("SELECT * FROM income WHERE id = ?", [req.user.id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch income data." });
    }

    const incomesArray = rows.map(row => ({
      id: row.id,
      email: row.email,
      source: row.source,
      amount: row.amount,
      category: row.category,
      date: row.date,
      createdAt: row.createdAt
    }));

    res.json(incomesArray);
  });
};

module.exports = { incomepost, incomeGet, authenticate };
