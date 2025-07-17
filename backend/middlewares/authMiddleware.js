const jwt = require('jsonwebtoken');
const User = require('../model/User'); // Ensure path is correct: '../model/User'

// It's crucial to load environment variables.
// If you're using 'dotenv', ensure it's configured in your server.js/app.js
// For example: require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET; // Get secret from environment variables

const protect = async (req, res, next) => {
    let token;

    // Check if authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract token from 'Bearer <token>' string
            token = req.headers.authorization.split(' ')[1];

            // Verify token using your JWT_SECRET from .env
            const decoded = jwt.verify(token, JWT_SECRET);

            // Find user by ID from the token payload and attach to request object
            // .select('-password') ensures password hash is not returned
            const user = await User.findById(decoded.id).select('-password');

            // If user is not found in the database (e.g., deleted account)
            if (!user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            req.user = user; // Attach the full user object (including role) to the request
            next(); // Proceed to the next middleware or route handler

        } catch (error) {
            console.error('Not authorized, token failed:', error.message);
            // Differentiate between token issues (e.g., expired, invalid signature)
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Not authorized, token expired' });
            }
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // If no token is provided in the header
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // Ensure req.user exists and has a role, and that the user's role
        // is included in the allowed roles for this route.
        if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource' });
        }
        next(); // User is authorized, proceed
    };
};

module.exports = { protect, authorizeRoles };
