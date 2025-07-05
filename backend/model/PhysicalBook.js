// model/PhysicalBook.js
const mongoose = require('mongoose');

// Define the schema for a Physical Book
const physicalBookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  publisher: {
    type: String,
    trim: true
  },
  year: {
    type: Number,
    min: 1000, // Keep min validation to ensure a reasonable year
    // max: new Date().getFullYear() // REMOVED THIS LINE to allow future years or different calendar systems
  },
  copies: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  available: {
    type: Number,
    default: function() { return this.copies; }
  },
  category: {
    type: String,
    trim: true
  },
  image: { // This field will store the path/URL to the image file
    type: String 
  }
}, {
  timestamps: true
});

// Create the Mongoose Model from the schema
const PhysicalBook = mongoose.model('PhysicalBook', physicalBookSchema);

module.exports = PhysicalBook;
