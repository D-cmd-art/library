    // Routes/Physicalbook.js
    const express = require('express');
    const router = express.Router();
    const PhysicalBook = require('../model/PhysicalBook');
    // No Multer import needed here anymore

    // GET all physical books
    router.get('/', async (req, res) => {
      try {
        const books = await PhysicalBook.find();
        res.status(200).json(books); // Frontend will get the direct Cloudinary URL from DB
      } catch (err) {
        console.error('Error fetching physical books:', err);
        res.status(500).json({ message: 'Failed to retrieve physical books', error: err.message });
      }
    });

    // POST a new physical book
    // This route now expects a JSON body with the image URL directly
    router.post('/', async (req, res) => {
      // --- DEBUGGING LOGS (Backend) ---
      console.log("Backend received request for adding physical book (Cloudinary URL).");
      console.log("req.body (text fields including image URL):", req.body);
      // --- END DEBUGGING LOGS ---

      try {
        // req.body will contain text fields, including the Cloudinary image URL
        const { title, author, isbn, publisher, year, copies, category, image } = req.body;
        
        // Basic validation for required fields
        if (!title || !author || !isbn || !copies || !image) { // 'image' is now the URL string
          return res.status(400).json({
            message: 'Validation failed',
            errors: {
              title: !title ? 'Title is required.' : undefined,
              author: !author ? 'Author is required.' : undefined,
              isbn: !isbn ? 'ISBN is required.' : undefined,
              copies: !copies ? 'Copies is required.' : undefined,
              image: !image ? 'Image URL is required.' : undefined, // Expecting a URL string
            }
          });
        }

        const book = new PhysicalBook({
          title, author, isbn, publisher, year, copies,
          available: copies, category, image // Image is now the Cloudinary URL
        });

        const savedBook = await book.save();
        res.status(201).json(savedBook);
      } catch (err) {
        console.error('Error adding physical book:', err);
        if (err.name === 'ValidationError') {
          const errors = {};
          for (let field in err.errors) { errors[field] = err.errors[field].message; }
          return res.status(400).json({ message: 'Validation failed', errors: errors, originalError: err.message });
        } else if (err.code === 11000) {
          return res.status(400).json({ message: 'Duplicate key error', error: 'A book with this ISBN already exists.', originalError: err.message });
        }
        res.status(500).json({ message: 'Failed to add physical book', error: err.message });
      }
    });

    // DELETE a physical book by ISBN
    router.delete('/:isbn', async (req, res) => {
      try {
        const { isbn } = req.params;
        // No need to delete file from local 'uploads' folder anymore
        const result = await PhysicalBook.deleteOne({ isbn: isbn });
        if (result.deletedCount === 0) { return res.status(404).json({ message: 'Physical book not found' }); }
        res.status(200).json({ message: 'Physical book deleted successfully' });
      } catch (err) {
        console.error('Error deleting physical book:', err);
        res.status(500).json({ message: 'Failed to delete physical book', error: err.message });
      }
    });

    module.exports = router;
    