const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const settingsPath = path.resolve("Models", "settings.json");

// GET user settings
router.get("/:userId", (req, res) => {
  const userId = req.params.userId;
  fs.readFile(settingsPath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Unable to read settings" });

    const settings = JSON.parse(data || "{}");
    res.json(settings[userId] || {});
  });
});

// POST or PUT user settings
router.post("/", (req, res) => {
  const { userId, savingsGoal, currencySymbol, lastUsedFilters } = req.body;

  fs.readFile(settingsPath, "utf8", (err, data) => {
    let settings = {};
    if (!err && data) {
      settings = JSON.parse(data);
    }

    settings[userId] = {
      savingsGoal,
      currencySymbol,
      lastUsedFilters,
    };

    fs.writeFile(settingsPath, JSON.stringify(settings, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Failed to save settings" });
      res.json({ message: "Settings saved successfully" });
    });
  });
});

module.exports = router;
