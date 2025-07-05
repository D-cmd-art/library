// middleware/authMiddleware.js
const jwt = require('jsonwebtoken'); 
const User = require('../model/User'); // Ensure path is correct: '../model/User'

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token using your JWT_SECRET from .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET); 

      // Find user by ID from the token payload and attach to request object
      req.user = await User.findById(decoded.id).select('-password');
      
      next(); 
    } catch (error) {
      console.error('Not authorized, token failed:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource' });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };
