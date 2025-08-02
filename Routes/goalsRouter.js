const express = require('express');
const router = express.Router();

const goals = [
  { id: 1, label: 'Emergency Fund', current: 1500, target: 5000 },
  { id: 2, label: 'Vacation Savings', current: 800, target: 2000 },
  { id: 3, label: 'New Laptop', current: 400, target: 1200 }
];

router.get('/goalRouter', (req, res) => {
  res.json(goals);
});

module.exports = router;
