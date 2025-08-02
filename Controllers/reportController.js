
const fs = require("fs")
const path = require("path")
const expensesFile = path.resolve("Models", "expenses.json")
const readExpenses = JSON.parse( fs.readFileSync(expensesFile , "utf-8") )

const reportget = (req,res) =>{
    res.send(readExpenses)

}

module.exports = reportget


