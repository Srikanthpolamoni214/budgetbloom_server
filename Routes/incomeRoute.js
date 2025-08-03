const express = require('express');
const { incomepost,incomeGet, authenticate } = require('../Controllers/incomeController');
const route = express.Router();
// const { celebrate, Joi } = require('celebrate');
// const { validateUrl } = require('./validateUrl');
// const { validateEmail } = require('./validateEmail');
// const { validatePassword } = require('./validatePassword');
// const { validateName } = require('./validateName');
route.post("/income",  authenticate, incomepost)
route.get("/getIncome",  authenticate, incomeGet)


module.exports = route;


      