const fs = require("fs")
const path = require("path")
const jwt = require("jsonwebtoken");
const db = require("../Models/db"); // Assuming db.js is in the Models directory
const dotenv =require("dotenv")
dotenv.config()
const SECRET_KEY = process.env.SECRET_KEY
// const expensesFile = path.resolve("Models", "expenses.json");
// const budgetFile = path.resolve("Models" , "budgets.json");
// const readExpenses = () =>{
//     try {
//         const data = fs.readFileSync(expensesFile, "utf8");
//         return JSON.parse(data);
//         } catch (error) {
//             console.log("Error reading expenses file");
//             return [];
//             }

// }
// JWT middleware
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
const expensespost = (req, res) =>{
    const {description, amount, date, category,month} = req.body;
    // fs.writeFileSync( expensesFile, JSON.stringify([...readExpenses(), {description, amount:parseFloat(amount), date, category, month}]))
   
//   const budgetdata= fs.readFileSync(budgetFile, "utf8");

//   const budget = JSON.parse(budgetdata);
//   const budgetIndex = budget.findIndex((item) =>  item.name === category);
//   if (budgetIndex !== -1) {
//     budget[budgetIndex].spent += parseFloat(amount);
//     fs.writeFileSync(budgetFile, JSON.stringify(budget));
//     }


    // if (description && amount && date && category) {
    //     res.send({message: "Expense added successfully"})
    //     } else {
    //         res.send({message: "Please fill all fields"})
    //         }
console.log("Received expense data:", req.body);
db.query("INSERT INTO expenses (id, email, description, amount, date, category, month) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [req.user.id, req.user.email, description, parseFloat(amount), date, category , month], (err) => { if (err) { 
            console.error("Error inserting expense:", err);
            return res.status(500).send("Database error");
        }
        res.send({message: "Expense added successfully"});
    });
    
}

const expensesget = (req, res) =>{
    // const expenses = readExpenses();
    // res.send(expenses);

    db.query("SELECT * FROM expenses WHERE id = ?", [req.user.id], (err, rows) => {
        if (err) {
            console.error("Error fetching expenses:", err);
            return res.status(500).send("Database error");
            }
            console.log("Fetched expenses:", rows);
            rows = rows.map(row => ({
                id: row.id,
                email: row.email,
                description: row.description,
                amount: parseFloat(row.amount),
                date: row.date,
                category: row.category,
                month: row.month
            }));
            res.send(rows);
            });

}
module.exports = {expensesget, expensespost, authenticate};



// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const router = express.Router();

// // Paths
// const expensesPath = path.resolve('Models', 'expenses.json');
// const budgetsPath = path.resolve('Models', 'budgets.json');

// // Utils
// const readJSON = (filePath) => {
//   if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify([]));
//   return JSON.parse(fs.readFileSync(filePath));
// };

// const writeJSON = (filePath, data) => {
//   fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
// };

// // 📤 POST new expense
// router.post('/expenses', (req, res) => {
//   const { name, amount, category, date } = req.body;
//   if (!name || !amount || !category) {
//     return res.status(400).json({ error: 'Missing expense data' });
//   }

//   const expenses = readJSON(expensesPath);
//   const newExpense = {
//     id: Date.now(),
//     name,
//     amount: parseFloat(amount),
//     category,
//     date: date || new Date().toISOString()
//   };

//   expenses.push(newExpense);
//   writeJSON(expensesPath, expenses);

//   // 🔁 Update related budget
//   const budgets = readJSON(budgetsPath);
//   const budgetIndex = budgets.findIndex(b => b.name === category);

//   if (budgetIndex !== -1) {
//     budgets[budgetIndex].spent += parseFloat(amount);
//     writeJSON(budgetsPath, budgets);
//   }

//   res.status(201).json(newExpense);
// });
