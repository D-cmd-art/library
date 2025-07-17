const express = require('express');
const router = express.Router(); // Create an Express Router instance

// Import the controller functions
// Assuming your authController.js is in a 'controllers' directory
const { registerUser, loginUser } = require('../controllers/authController');

// IMPORTANT: Do NOT define JWT_SECRET here. It should be handled in the controller
// and accessed via process.env in the controller and middleware files.

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
// This route now uses the registerUser function from your authController
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Login existing user
// @access  Public
// This route now uses the loginUser function from your authController
router.post('/login', loginUser);

module.exports = router; // Export the router instance
