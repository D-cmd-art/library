    // model/Ebook.js
    const mongoose = require('mongoose');

    const ebookSchema = new mongoose.Schema({
      title: { type: String, required: true },
      author: { type: String, required: true },
      isbn: { type: String, required: true, unique: true },
      publisher: { type: String },
      year: { type: Number },
      category: { type: String },
      image: { type: String }, // Will store the URL/path to the image file
      pdf: { type: String, required: true }, // Will store the URL/path to the PDF file
    }, { timestamps: true });

    const Ebook = mongoose.model('Ebook', ebookSchema);
    module.exports = Ebook;
    