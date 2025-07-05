import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const StarRating = ({ rating, onRate }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1 mb-3">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onRate(star)}
          className={`w-6 h-6 cursor-pointer transition ${
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

const BookPreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const book = location.state?.book;

  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const allReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const bookReviews = allReviews.filter((rev) => rev.bookName === book?.title);
    setReviews(bookReviews);
  }, [book]);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  if (!book) {
    return (
      <div className="p-6">
        <p className="text-center text-gray-500">No book data. Go back to the book list.</p>
        <button
          className="mt-4 bg-blue-600 text-white px-3 py-1.5 rounded"
          onClick={() => navigate('/')}
        >
          Back to List
        </button>
      </div>
    );
  }

  const handleSubmitReview = () => {
    if (userRating === 0 || userComment.trim() === '') {
      alert('Please provide both a rating and comment.');
      return;
    }

    const review = {
      bookName: book.title,
      rating: userRating,
      comment: userComment,
    };

    const existingReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    existingReviews.push(review);
    localStorage.setItem('reviews', JSON.stringify(existingReviews));

    setReviews((prev) => [...prev, review]);
    setUserComment('');
    setUserRating(0);
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <button
        className="mb-4 text-blue-600 hover:underline"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <h3 className="text-2xl font-bold mb-2">📖 {book.title}</h3>
      <p className="text-gray-700 mb-1"><strong>Author:</strong> {book.author}</p>
      <img
        src={book.image}
        alt={book.title}
        className="w-48 h-64 object-cover rounded mb-3 mx-auto"
      />
      <p className="text-gray-700 mb-4">{book.desc}</p>
      <p className="text-sm mb-4">
        <strong>Status:</strong>{' '}
        <span className={book.availability === 'Available' ? 'text-green-600' : 'text-red-500'}>
          {book.availability}
        </span>
      </p>

      <div className="mb-6 text-center">
        <p className="font-semibold text-gray-700">Average Rating</p>
        <div className="flex justify-center gap-1 mb-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`w-5 h-5 ${
                avgRating >= star ? 'text-yellow-500' : 'text-gray-300'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.951 4.163.013c.969.003 1.371 1.24.588 1.81l-3.37 2.447 1.27 3.96c.29.905-.755 1.654-1.54 1.11l-3.36-2.45-3.36 2.45c-.784.545-1.83-.205-1.54-1.11l1.27-3.96-3.37-2.447c-.783-.57-.38-1.807.588-1.81l4.163-.013 1.286-3.951z" />
            </svg>
          ))}
        </div>
        <p className="text-sm text-gray-500">
          ({avgRating.toFixed(1)} / 5.0 from {reviews.length} review{reviews.length !== 1 ? 's' : ''})
        </p>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          className="bg-green-600 text-white text-sm px-3 py-1.5 rounded hover:bg-green-700 transition"
          onClick={() => alert(`Borrow request placed for "${book.title}"!`)}
        >
          Confirm Borrow
        </button>
        <button
          className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded hover:bg-blue-700 transition"
          onClick={() => navigate('/reviews')}
        >
          View All Reviews
        </button>
      </div>

      <div className="border-t pt-4 mt-4">
        <p className="text-gray-700 font-semibold mb-1">Your Review</p>
        <StarRating rating={userRating} onRate={setUserRating} />
        <textarea
          className="w-full border rounded p-2 mb-2 text-sm"
          rows="3"
          placeholder="Write your comment..."
          value={userComment}
          onChange={(e) => setUserComment(e.target.value)}
        />
        <button
          className="bg-purple-600 text-white text-sm px-3 py-1.5 rounded hover:bg-purple-700 transition"
          onClick={handleSubmitReview}
        >
          Submit Review
        </button>
      </div>

      {reviews.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <p className="text-gray-700 font-semibold mb-2">Reviews for this book</p>
          {reviews.map((review, index) => (
            <div
              key={index}
              className="border rounded p-2 mb-2 bg-gray-50"
            >
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${
                      review.rating >= star ? 'text-yellow-500' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.951 4.163.013c.969.003 1.371 1.24.588 1.81l-3.37 2.447 1.27 3.96c.29.905-.755 1.654-1.54 1.11l-3.36-2.45-3.36 2.45c-.784.545-1.83-.205-1.54-1.11l1.27-3.96-3.37-2.447c-.783-.57-.38-1.807.588-1.81l4.163-.013 1.286-3.951z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookPreview;
