const registerController  = require("../Controllers/registerController");
const express = require("express");
const router = express.Router();
// Define the route for user registration
router.post("/register", registerController);
// Export the router to be used in the main application


module.exports = router;