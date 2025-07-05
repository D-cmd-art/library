// Routes/Account.js
const express = require('express');
const router = express.Router();
const User = require('../model/User'); 
const { protect } = require('../middlewares/authMiddleware'); 
const bcrypt = require('bcryptjs'); 
const multer = require('multer'); 
const path = require('path'); 

// --- Multer Storage Configuration ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 
  }
});

// @route   GET /api/account/profile
// @desc    Get authenticated user's profile details
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Not authorized, user ID not found in token.' });
    }

    // Fetch the user, .select('-password') will get all fields EXCEPT the password.
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Ensure all fields are explicitly included in the response
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, 
      address: user.address,          
      grade: user.grade,              
      phoneNumber: user.phoneNumber,  
      profilePicture: user.profilePicture ? 
                      `/uploads/${path.basename(user.profilePicture)}` : 
                      '' 
    });
  } catch (error) {
    console.error('Error fetching user profile (Account route):', error);
    res.status(500).json({ message: 'Server error fetching profile.' });
  }
});


// @route   PUT /api/account/profile
// @desc    Update authenticated user's profile details
// @access  Private
router.put('/profile', protect, upload.single('profilePicture'), async (req, res) => {
  const { name, email, address, grade, phoneNumber, password } = req.body; 

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.name = name || user.name;
    user.email = email || user.email; 
    user.address = address || user.address;
    user.grade = grade || user.grade;
    user.phoneNumber = phoneNumber || user.phoneNumber;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    if (req.file) {
      user.profilePicture = req.file.path; 
    }

    const updatedUser = await user.save(); 

    // Ensure all updated fields are returned in the response
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      address: updatedUser.address,
      grade: updatedUser.grade,
      phoneNumber: updatedUser.phoneNumber,
      profilePicture: updatedUser.profilePicture ? 
                      `/uploads/${path.basename(updatedUser.profilePicture)}` : 
                      '',
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ message: `File upload error: ${error.message}` });
    }
    if (error.name === 'ValidationError') {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return res.status(400).json({ message: 'The email address is already in use.' });
    }
    res.status(500).json({ message: 'Server error updating profile.' });
  }
});

module.exports = router;
