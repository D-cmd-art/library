// models/BorrowRequest.js
const mongoose = require('mongoose');

const BorrowRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to your User model
        required: true,
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PhysicalBook', // Reference to your PhysicalBook model
        required: true,
    },
    requestDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'returned'],
        default: 'pending',
    },
    borrowDate: { // Date when the book was actually borrowed (after acceptance)
        type: Date,
    },
    returnDate: { // Expected return date
        type: Date,
    },
    actualReturnDate: { // Date when the book was actually returned
        type: Date,
    },
    // You might want to add fields for admin notes, etc.
});

module.exports = mongoose.model('BorrowRequest', BorrowRequestSchema);