
const express = require('express');
const router = express.Router();


const { loginController } = require('../Controllers/loginController');


// Define the login route
router.post('/login', loginController);

router.get('/login', (req, res) => {
    res.status(200).json({
        message: "Login route is working"
    });
});
// Export the router
module.exports = router;