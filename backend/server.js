    // server.js (or index.js) - Backend entry point
    require('dotenv').config();

    const express = require('express');
    const mongoose = require('mongoose');
    const cors = require('cors');
    const path = require('path');

    const app = express();
    const PORT = process.env.PORT || 5000;

    // --- Middleware Setup ---
    app.use(cors());
    // Re-enable JSON and URL-encoded body parsers.
    // These are now needed because the frontend will send JSON with Cloudinary URLs.
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));

    // Serve static files (if you still have other static assets)
    // This is no longer strictly needed for uploaded images/PDFs if using Cloudinary,
    // but keep it if you serve other static content.
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    // --- MongoDB Connection ---
    mongoose.connect(process.env.MONGO_URI, {})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    });

    // --- Route Imports ---
    const physicalBookRoutes = require('./Routes/Physicalbook');
    const ebookRoutes = require('./Routes/ebook');
    const authRoutes = require('./Routes/auth');
    const accountRoutes = require('./Routes/Account');
const borrowRoutes =require('./routes/borrowRoutes')
    // --- Route Mounting ---
    app.use('/api/physical-books', physicalBookRoutes);
    app.use('/api/ebooks', ebookRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/account', accountRoutes);
    app.use('/api/borrow',borrowRoutes);

    // --- Basic Test Route ---
    app.get('/', (req, res) => {
      res.send('Library API is running!');
    });

    // --- Error Handling Middleware ---
    app.use((req, res) => {
      console.log(`404 Not Found: ${req.method} ${req.originalUrl}`);
      res.status(404).json({ message: 'Route not found' });
    });

    app.use((error, req, res, next) => {
      console.error('Global Error Handler:', error.stack);
      res.status(error.statusCode || 500).json({
        message: error.message || 'An unexpected server error occurred'
      });
    });

    // --- Start Server ---
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    