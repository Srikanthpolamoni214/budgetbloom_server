const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");

const loginRoute = require("./Routes/loginRoute");
const registerRoute = require("./Routes/registerRoute");
const incomeRoute = require("./Routes/incomeRoute");
const expensesRoute = require("./Routes/expensesRoute");
const receiptUploderRoute = require("./Routes/receiptUploaderRoute");
const userSettingsRoute = require("./Routes/registerRoute");
const goalsRoute = require("./Routes/goalsRoute");
const budgetRoute = require("./Routes/budgetRoute");
const goalsTrackerRoute = require("./Routes/goalsTrackerRoute");
const reportRoute = require("./Routes/reportRoute");
const allTransactions = require("./Routes/allTransactions");
const goalRouter = require("./Routes/goalsRouter");
const reviewRoute = require("./Routes/ratingsRoute");
const pool = require("./Models/db.js")
const googleAuthRoutes = require("./Routes/googleAuth");
const app = express();
dotenv.config();
const port = process.env.PORT || 3200;



const verifyRouter = require("./Routes/verifyEmailRoute");

app.use(
  cors({
    origin: [
      'https://budgetbloom-client-app.vercel.app', // allow your frontend origin
    'http://localhost:5173', // allow your frontend origin
     'http://localhost:5174',
     
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Enable CORS for specific origin
// app.use(cors({ origin: "http://localhost:5173" }));

// Routes
app.get("/", (req, res) => {
  res.send("🚀 BudgetBloom backend is running!");
});

app.use("/", loginRoute);
app.use("/", registerRoute);
app.use("/", incomeRoute);
app.use("/", expensesRoute);
app.use("/", receiptUploderRoute);
app.use("/api/settings/", userSettingsRoute);
app.use("/api/goals", goalsRoute);
app.use("/budgets", budgetRoute); // 👈 Mount the route
app.use("/", reportRoute);
app.use("/", allTransactions);
app.use("/", goalRouter);
app.use("/api/reviews", reviewRoute);
app.use("/", verifyRouter);
app.use("/", googleAuthRoutes);
// server.js

// Ensure 'uploads' directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use("/api/goalsTracker", goalsTrackerRoute);

// Server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Ensure data dir & file
