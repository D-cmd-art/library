import React from 'react';
import { useNavigate } from 'react-router-dom';

const BookReviews = () => {
  const navigate = useNavigate();
  const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');

  return (
    <div className="p-6 max-w-lg mx-auto">
      <button
        className="mb-4 text-blue-600 hover:underline"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
      <h2 className="text-2xl font-bold mb-4">📚 Book Reviews</h2>

      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews submitted yet.</p>
      ) : (
        reviews.map((review, index) => (
          <div
            key={index}
            className="border rounded p-3 mb-3 shadow-sm bg-gray-50"
          >
            <p className="font-semibold">{review.bookName}</p>
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
        ))
      )}
    </div>
  );
};

export default BookReviews;
