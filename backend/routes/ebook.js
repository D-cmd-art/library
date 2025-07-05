    // Routes/ebook.js
    const express = require('express');
    const router = express.Router();
    const Ebook = require('../model/Ebook');
    // No Multer import needed here anymore

    // GET all ebooks
    router.get('/', async (req, res) => {
      try {
        const ebooks = await Ebook.find();
        res.json(ebooks); // Frontend will get the direct Cloudinary URL from DB
      } catch (err) {
        console.error('Error fetching ebooks:', err);
        res.status(500).json({ error: err.message });
      }
    });

    // POST a new ebook
    // This route now expects a JSON body with the image and PDF URLs directly
    router.post('/', async (req, res) => {
      // --- DEBUGGING LOGS (Backend) ---
      console.log("Backend received request for adding ebook (Cloudinary URLs).");
      console.log("req.body (text fields including image and PDF URLs):", req.body);
      // --- END DEBUGGING LOGS ---

      try {
        const { title, author, isbn, publisher, year, category, image, pdf } = req.body;

        if (!title || !author || !isbn || !pdf) { // 'image' and 'pdf' are now URL strings
          return res.status(400).json({
            message: 'Validation failed',
            errors: {
              title: !title ? 'Title is required.' : undefined,
              author: !author ? 'Author is required.' : undefined,
              isbn: !isbn ? 'ISBN is required.' : undefined,
              pdf: !pdf ? 'PDF URL is required.' : undefined, // Expecting a URL string
            }
          });
        }

        const ebook = new Ebook({
          title, author, isbn, publisher, year, category,
          image, pdf // Image and PDF are now Cloudinary URLs
        });

        const saved = await ebook.save();
        res.status(201).json(saved);
      } catch (err) {
        console.error('Error adding ebook:', err);
        if (err.name === 'ValidationError') {
          const errors = {};
          for (let field in err.errors) { errors[field] = err.errors[field].message; }
          return res.status(400).json({ message: 'Validation failed', errors });
        } else if (err.code === 11000) {
          return res.status(400).json({ message: 'Duplicate ISBN. An ebook with this ISBN already exists.' });
        }
        res.status(500).json({ error: err.message });
      }
    });

    // DELETE an ebook by ISBN
    router.delete('/:isbn', async (req, res) => {
      try {
        const { isbn } = req.params;
        // No need to delete file from local 'uploads' folder anymore
        const result = await Ebook.deleteOne({ isbn: isbn });
        if (result.deletedCount === 0) { return res.status(404).json({ message: 'Ebook not found' }); }
        res.status(200).json({ message: 'Ebook deleted successfully' });
      } catch (err) {
        console.error('Error deleting ebook:', err);
        res.status(500).json({ error: err.message });
      }
    });

    module.exports = router;
    