const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    // --- NEW ROLE FIELD ADDED BELOW ---
    role: {
        type: String,
        enum: ['user', 'admin', 'librarian'], // Define possible roles
        default: 'user' // Default role for new users
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields automatically
});

module.exports = mongoose.model('User', userSchema);
