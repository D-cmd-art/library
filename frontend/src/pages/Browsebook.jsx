// src/components/BorrowBooks.jsx (or wherever your BorrowBooks component is)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import api from '../api'; // Import your centralized Axios instance

// Helper function to render stars (remains the same)
const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.25 && rating % 1 < 0.75;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <>
      {Array(fullStars).fill().map((_, i) => (
        <FaStar key={`full-${i}`} className="text-yellow-500 inline-block" />
      ))}
      {hasHalfStar && <FaStarHalfAlt className="text-yellow-500 inline-block" />}
      {Array(emptyStars).fill().map((_, i) => (
        <FaRegStar key={`empty-${i}`} className="text-yellow-500 inline-block" />
      ))}
    </>
  );
};

// Helper function to highlight search term (remains the same)
const highlightMatch = (text, term) => {
  if (!term) return text;
  const regex = new RegExp(`(${term})`, 'gi');
  return text.split(regex).map((part, i) =>
    regex.test(part) ? <span key={i} className="bg-yellow-200">{part}</span> : part
  );
};

const BorrowBooks = () => {
  const [books, setBooks] = useState([]); // State to store fetched books
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(''); // State for error messages
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // useEffect to fetch data when the component mounts
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // Make GET request to your backend API for physical books
        const response = await api.get('/physical-books'); // This hits /api/physical-books/
        setBooks(response.data); // Update books state with fetched data
        setError(''); // Clear any previous errors
      } catch (err) {
        console.error("Error fetching physical books:", err);
        setError('Failed to load books. Please try again later.');
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchBooks(); // Call the fetch function
  }, []); // Empty dependency array ensures this runs only once on mount

  // Filter books based on search term (uses the fetched 'books' state)
  const filteredBooks = books.filter(book => {
    const term = searchTerm.toLowerCase();
    return (
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="px-6 py-10 text-center">
        <p className="text-lg text-gray-700">Loading books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-10 text-center">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-10">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-left mb-2">
          <span className="text-3xl">📚</span>
          <h2 className="text-2xl font-bold text-gray-800">Browse Books to Borrow</h2>
        </div>
        <p className="text-gray-500 mb-4">Discover books available for borrowing from our library.</p>

        <div className="flex items-center gap-2 w-full sm:w-1/2">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-gray-500 hover:text-gray-700"
              title="Clear search"
            >
              ✖
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div
              key={book._id} // Use book._id from MongoDB as the key
              className="bg-white rounded shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-4 flex flex-col"
            >
              <img
                src={book.image || "https://placehold.co/200x300/cccccc/ffffff?text=No+Cover"} // Use book.image from fetched data, with fallback
                alt={book.title}
                className="w-full h-48 object-cover rounded mb-4"
                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/200x300/cccccc/ffffff?text=No+Cover"; }} // Image error fallback
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  {highlightMatch(book.title, searchTerm)}
                </h3>
                <p className="text-sm text-gray-500 mb-1">
                  by {highlightMatch(book.author, searchTerm)}
                </p>
                {/* Assuming rating is available, if not, remove or add conditional */}
                {book.rating && ( 
                  <div className="mb-1 flex items-center gap-1">
                    {renderStars(book.rating)}
                    <span className="ml-1 text-sm text-gray-500">({book.rating})</span>
                  </div>
                )}
                <p
                  className={`text-sm mb-2 ${
                    book.available > 0 // Check 'available' count from backend
                      ? 'text-green-600'
                      : 'text-red-500'
                  }`}
                >
                  {book.available > 0 ? `Available (${book.available} copies)` : 'Out of Stock'}
                </p>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  className="bg-green-600 text-white text-sm px-3 py-1.5 rounded hover:bg-green-700 transition"
                  onClick={() => alert(`Borrow request placed for "${book.title}"!`)} // Replace with actual borrow logic
                  disabled={book.available === 0} // Disable if no copies available
                >
                  Confirm Borrow
                </button>
                <button
                  className={`text-sm px-3 py-1.5 rounded mt-auto transition ${
                    book.available > 0
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  onClick={() => {
                    if (book.available > 0) {
                      navigate(`/preview/${book._id}`, { state: { book } }); // Use book._id for preview
                    }
                  }}
                  disabled={book.available === 0}
                  title={book.available === 0 ? 'Out of stock' : 'Preview book'}
                >
                  Preview
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
              alt="No results"
              className="w-32 mx-auto mb-4 opacity-60"
            />
            <p className="text-gray-500">No books found.</p> {/* Updated message */}
          </div>
        )}
      </div>

      <footer className="text-center mt-12 text-sm text-gray-400">
        © 2025 LMS. All rights reserved.
      </footer>
    </div>
  );
};

export default BorrowBooks;
