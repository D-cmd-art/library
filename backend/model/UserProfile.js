// model/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures email is unique
    lowercase: true, // Stores emails in lowercase
    trim: true, // Removes whitespace from both ends
    match: [/.+@.+\..+/, 'Please enter a valid email address'], // Basic email validation
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Define possible roles
    default: 'user', // Default role for new users
  },
  // --- New profile fields ---
  address: {
    type: String,
    default: '', // Optional: provide a default empty string
  },
  grade: {
    type: String,
    default: '',
  },
  phoneNumber: {
    type: String,
    default: '',
  },
  profilePicture: {
    type: String, // Store the path to the profile picture
    default: '', // Default to empty string if no picture
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

// You can add pre-save hooks here for password hashing if you haven't already
// For example, if you hash passwords directly in the model:
// userSchema.pre('save', async function(next) {
//   if (this.isModified('password')) {
//     const bcrypt = require('bcryptjs');
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });

module.exports = mongoose.model('User', userSchema);
