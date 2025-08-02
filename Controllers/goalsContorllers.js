// controllers/goalController.js
const fs = require("fs");
const path = require("path");

const filePath = path.resolve("Models", "goals.json");

exports.getGoal = (req, res) => {
  try {
    if (!fs.existsSync(filePath)) {
      return res.json({ goal: 0 });
    }
    const data = fs.readFileSync(filePath, "utf-8");
    const { goal } = JSON.parse(data);
    res.json({ goal });
  } catch (err) {
    res.status(500).json({ error: "Failed to load goal" });
  }
};

exports.setGoal = (req, res) => {
  try {
    const { goal } = req.body;
    fs.writeFileSync(filePath, JSON.stringify({ goal }), "utf-8");
    res.json({ message: "Goal saved", goal });
  } catch (err) {
    res.status(500).json({ error: "Failed to save goal" });
  }
};
