const express = require('express');
const { expensespost, expensesget, authenticate } = require('../Controllers/expensesController');
const app = express();

const route = express.Router();
route.post ("/postexpenses",  authenticate ,expensespost)
route.get("/expenses" , authenticate,expensesget)

module.exports = route;