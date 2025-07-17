// routes/borrowRoutes.js
const express = require('express');
const router = express.Router();
const BorrowRequest = require('../model/BorrowRequest'); // Ensure this path is correct
const PhysicalBook = require('../model/PhysicalBook'); // Ensure this path is correct

// Import the specific middleware functions you need
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

// --- User-facing route ---
// POST /api/borrow/request - Create a new borrow request
// Uses 'protect' middleware to ensure the user is logged in
router.post('/request', protect, async (req, res) => {
    const { bookId } = req.body;
    const userId = req.user._id; // User ID from req.user set by 'protect' middleware (assuming _id from MongoDB)

    if (!bookId) {
        return res.status(400).json({ msg: 'Book ID is required.' });
    }

    try {
        // Check if book exists and is available
        const book = await PhysicalBook.findById(bookId);
        if (!book) {
            return res.status(404).json({ msg: 'Book not found.' });
        }
        if (book.available <= 0) {
            return res.status(400).json({ msg: 'Book is currently out of stock.' });
        }

        // Check if the user already has a pending request for this book
        const existingRequest = await BorrowRequest.findOne({
            user: userId,
            book: bookId,
            status: { $in: ['pending', 'accepted'] } // Check for active requests
        });

        if (existingRequest) {
            return res.status(400).json({ msg: 'You already have an active request or borrowed copy for this book.' });
        }

        // Create the borrow request
        const newRequest = new BorrowRequest({
            user: userId,
            book: bookId,
        });

        await newRequest.save();

        res.status(201).json({ msg: 'Borrow request submitted successfully.', request: newRequest });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- Admin/Librarian routes (requires admin/librarian role checking) ---
// GET /api/borrow/requests - Get all borrow requests (for admin/librarian)
// Uses 'protect' to ensure login, then 'authorizeRoles' to check for 'admin' or 'librarian' role
router.get('/requests', protect, authorizeRoles('admin', 'librarian'), async (req, res) => {
    try {
        const requests = await BorrowRequest.find()
            .populate('user', 'username email role') // Populate user info, including role if needed for display
            .populate('book', 'title author isbn image copies available'); // Populate book info
        res.json(requests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// PATCH /api/borrow/requests/:id/status - Update borrow request status (accept/reject/return)
// Uses 'protect' to ensure login, then 'authorizeRoles' to check for 'admin' or 'librarian' role
router.patch('/requests/:id/status', protect, authorizeRoles('admin', 'librarian'), async (req, res) => {
    const { status } = req.body;
    const requestId = req.params.id;

    if (!['accepted', 'rejected', 'returned'].includes(status)) {
        return res.status(400).json({ msg: 'Invalid status provided.' });
    }

    try {
        const request = await BorrowRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ msg: 'Borrow request not found.' });
        }

        const book = await PhysicalBook.findById(request.book);
        if (!book) {
            // This should ideally not happen if data is consistent
            return res.status(404).json({ msg: 'Associated book not found.' });
        }

        // Logic for status transitions
        if (status === 'accepted' && request.status === 'pending') {
            if (book.available <= 0) {
                return res.status(400).json({ msg: 'Cannot accept, book is currently out of stock.' });
            }
            request.status = 'accepted';
            request.borrowDate = new Date();
            // Set a return date, e.g., 14 days from borrow date
            request.returnDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
            book.available -= 1; // Decrement available copies
            await book.save();
        } else if (status === 'rejected' && request.status === 'pending') {
            request.status = 'rejected';
            // If you had decremented 'available' on pending, you'd increment it back here
        } else if (status === 'returned' && request.status === 'accepted') {
            request.status = 'returned';
            request.actualReturnDate = new Date();
            book.available += 1; // Increment available copies when returned
            await book.save();
        } else {
            return res.status(400).json({ msg: `Cannot change status from ${request.status} to ${status}.` });
        }

        await request.save();
        res.json({ msg: `Request status updated to ${status}.`, request });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;