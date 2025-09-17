// src/components/BookReviewsPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api'; // Assuming you have an API instance

// Reusable StarRating component (can stay here or in its own file like StarRating.jsx)
const StarRating = ({ rating, onRate, size = 'w-6 h-6', interactive = true }) => {
    const [hovered, setHovered] = useState(0);

    return (
        <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    onMouseEnter={interactive ? () => setHovered(star) : undefined}
                    onMouseLeave={interactive ? () => setHovered(0) : undefined}
                    onClick={interactive ? () => onRate(star) : undefined}
                    className={`${size} ${interactive ? 'cursor-pointer' : ''} transition ${
                        (hovered || rating) >= star ? 'text-yellow-500' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.951 4.163.013c.969.003 1.371 1.24.588 1.81l-3.37 2.447 1.27 3.96c.29.905-.755 1.654-1.54 1.11l-3.36-2.45-3.36 2.45c-.784.545-1.83-.205-1.54-1.11l1.27-3.96-3.37-2.447c-.783-.57-.38-1.807.588-1.81l4.163-.013 1.286-3.951z" />
                </svg>
            ))}
        </div>
    );
};

const BookReviewsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // Get book data from location state or a bookId from params for API fetch
    const book = location.state?.book; // Preferred for direct navigation from preview
    const bookId = book?._id || location.state?.bookId; // Fallback if navigating directly by ID

    const [reviews, setReviews] = useState([]);
    const [userRating, setUserRating] = useState(0);
    const [userComment, setUserComment] = useState('');
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [reviewError, setReviewError] = useState('');
    const [bookDetails, setBookDetails] = useState(book); // State for book details if fetched by ID

    const fetchBookReviews = async (currentBookId) => {
        setLoadingReviews(true);
        setReviewError('');
        try {
            // In a real application, you'd fetch reviews for this book from your backend
            // Example: const response = await api.get(`/books/${currentBookId}/reviews`);
            // setReviews(response.data);

            // For now, using localStorage as in your original code
            const allReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
            const filteredReviews = allReviews.filter((rev) => rev.bookName === bookDetails?.title);
            setReviews(filteredReviews);
        } catch (err) {
            console.error("Error fetching reviews:", err);
            setReviewError("Failed to load reviews.");
        } finally {
            setLoadingReviews(false);
        }
    };

    const fetchBookDetailsById = async (id) => {
        try {
            // In a real app, fetch book details if not passed via state
            // const response = await api.get(`/physical-books/${id}`);
            // setBookDetails(response.data);
            // Simulating fetch from demo data if you're not logged in
            // You'd need to adapt this if you have a proper backend endpoint for single book fetch
            const allBooks = JSON.parse(localStorage.getItem('demoPhysicalBooks') || '[]'); // Assuming you store demo data
            const foundBook = allBooks.find(b => b._id === id);
            if (foundBook) {
                setBookDetails(foundBook);
            } else {
                setReviewError("Book details not found.");
            }
        } catch (err) {
            console.error("Error fetching book details:", err);
            setReviewError("Failed to load book details.");
        }
    };

    useEffect(() => {
        if (!bookDetails && bookId) {
            fetchBookDetailsById(bookId);
        }
        if (bookDetails || bookId) { // Fetch reviews once we have book details or at least an ID
            fetchBookReviews(bookDetails?._id || bookId);
        }
    }, [bookDetails, bookId]); // Depend on bookDetails or bookId to re-fetch if they change

    const avgRating =
        reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

    const handleSubmitReview = async () => {
        if (userRating === 0 || userComment.trim() === '') {
            alert('Please provide both a rating and comment.');
            return;
        }
        if (!bookDetails || !bookDetails.title) {
            alert('Cannot submit review: Book information is missing.');
            return;
        }

        const newReview = {
            bookId: bookDetails._id, // Store book ID for proper backend integration
            bookName: bookDetails.title,
            rating: userRating,
            comment: userComment.trim(),
            // In a real app, you'd add: userId, userName, timestamp etc.
            timestamp: new Date().toISOString(),
        };

        try {
            // In a real app, you'd send this review to your backend API
            // const response = await api.post(`/reviews`, newReview);
            // alert('Review submitted successfully!');

            // For now, using localStorage
            const existingReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
            existingReviews.push(newReview);
            localStorage.setItem('reviews', JSON.stringify(existingReviews));

            setReviews((prev) => [...prev, newReview]); // Update UI immediately
            setUserComment('');
            setUserRating(0);
            alert('Review submitted successfully!');
        } catch (err) {
            console.error("Error submitting review:", err);
            alert("Failed to submit review. Please try again.");
        }
    };

    if (loadingReviews || (!bookDetails && !reviewError)) {
        return (
            <div className="p-6 text-center">
                <p className="text-lg text-gray-700">Loading reviews...</p>
            </div>
        );
    }

    if (reviewError) {
        return (
            <div className="p-6 text-center">
                <p className="text-lg text-red-600">{reviewError}</p>
                <button
                    className="mt-4 bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition"
                    onClick={() => navigate(-1)}
                >
                    Back
                </button>
            </div>
        );
    }

    if (!bookDetails) {
        return (
            <div className="p-6 text-center">
                <p className="text-gray-500">Book not found for reviews.</p>
                <button
                    className="mt-4 bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition"
                    onClick={() => navigate('/')}
                >
                    Back to List
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <button
                className="mb-4 text-blue-600 hover:underline"
                onClick={() => navigate(-1)}
            >
                ← Back
            </button>

            <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Reviews for "{bookDetails.title}"
            </h2>
            <p className="text-gray-600 mb-6">by {bookDetails.author}</p>

            <div className="mb-6 text-center border-b pb-4">
                <p className="font-semibold text-gray-700">Overall Rating</p>
                <StarRating rating={avgRating} size="w-7 h-7" interactive={false} /> {/* Display only */}
                <p className="text-sm text-gray-500">
                    ({avgRating.toFixed(1)} / 5.0 from {reviews.length} review{reviews.length !== 1 ? 's' : ''})
                </p>
            </div>

            {/* Your Review Submission Section */}
            <div className="border-t pt-4 mt-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Submit Your Review</h3>
                <StarRating rating={userRating} onRate={setUserRating} />
                <textarea
                    className="w-full border rounded p-3 mb-3 text-base resize-y focus:outline-none focus:ring-2 focus:ring-blue-400"
                    rows="4"
                    placeholder="Share your thoughts about this book..."
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                />
                <button
                    className="bg-purple-600 text-white font-semibold px-4 py-2 rounded hover:bg-purple-700 transition duration-200"
                    onClick={handleSubmitReview}
                >
                    Post Review
                </button>
            </div>

            {/* Existing Reviews Section */}
            <div className="mt-8 border-t pt-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">All Reviews ({reviews.length})</h3>
                {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <div
                            key={index} // In a real app, use a unique ID from the backend
                            className="border rounded-lg p-4 mb-4 bg-gray-50 shadow-sm"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                {/* Ideally show reviewer's name/avatar here */}
                                <p className="font-medium text-gray-700">Anonymous User</p> {/* Placeholder */}
                                <StarRating rating={review.rating} size="w-4 h-4" interactive={false} />
                            </div>
                            <p className="text-sm text-gray-800 leading-relaxed">{review.comment}</p>
                            {review.timestamp && (
                                <p className="text-xs text-gray-500 mt-2">
                                    Reviewed on: {new Date(review.timestamp).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 py-8">
                        <p>No reviews yet. Be the first to share your opinion!</p>
                    </div>
                )}
            </div>

            <footer className="text-center mt-12 text-sm text-gray-400">
                © 2025 LMS. All rights reserved.
            </footer>
        </div>
    );
};

export default BookReviewsPage;