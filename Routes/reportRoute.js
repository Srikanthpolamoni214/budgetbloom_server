const express = require("express")
const route = express.Router()
const reportget = require("../Controllers/reportController")
route.get("/report" ,reportget)


module.exports= route