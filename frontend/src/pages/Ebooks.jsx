// src/components/Ebooks.jsx
import React, { useState, useEffect } from 'react';
import api from '../api'; // Import your centralized Axios instance

const Ebooks = () => {
  const [ebooks, setEbooks] = useState([]); // State to store fetched ebooks
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(''); // State for error messages
  const [previewBook, setPreviewBook] = useState(null); // State for modal preview

  // useEffect to fetch data when the component mounts
  useEffect(() => {
    const fetchEbooks = async () => {
      try {
        // Make GET request to your backend API for ebooks
        const response = await api.get('/ebooks'); // This hits /api/ebooks/
        setEbooks(response.data); // Update ebooks state with fetched data
        setError(''); // Clear any previous errors
      } catch (err) {
        console.error("Error fetching ebooks:", err);
        setError('Failed to load ebooks. Please try again later.');
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchEbooks(); // Call the fetch function
  }, []); // Empty dependency array ensures this runs only once on mount

  if (loading) {
    return (
      <div className="px-6 py-10 text-center">
        <p className="text-lg text-gray-700">Loading ebooks...</p>
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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-left">
          <span className="text-3xl">📱</span>
          <h2 className="text-2xl font-bold text-gray-800">Digital eBooks</h2>
        </div>
        <p className="text-gray-500 mt-2">
          Access our collection of digital books instantly. Read online or download for offline reading.
        </p>
      </div>

      {/* Grid of eBooks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ebooks.length > 0 ? (
          ebooks.map((book) => (
            <div
              key={book._id} // Use book._id from MongoDB as the key
              className="bg-white rounded shadow-md hover:shadow-lg transition duration-300 p-4 flex flex-col"
            >
              <img
                src={book.image || "https://placehold.co/200x300/cccccc/ffffff?text=No+Cover"} // Use book.image from fetched data, with fallback
                alt={book.title}
                className="w-full h-48 object-cover rounded mb-4"
                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/200x300/cccccc/ffffff?text=No+Cover"; }} // Image error fallback
              />

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{book.title}</h3>
                <p className="text-sm text-gray-500 mb-1">by {book.author}</p>
                {/* Rating is not in your Ebook model, so it's removed or can be static */}
                {/* <div className="text-yellow-500 mb-2">
                  {'⭐'.repeat(Math.floor(book.rating))}{' '}
                  <span className="text-gray-600">{book.rating}</span>
                </div> */}
                <p className="text-sm text-gray-700 mb-2">{book.category}</p> {/* Display category */}
                <p className="text-sm text-gray-700 mb-2">Published: {book.year}</p> {/* Display year */}
              </div>

              <div className="flex gap-2 mt-auto">
                <button
                  className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded hover:bg-blue-700 transition"
                  onClick={() => setPreviewBook(book)}
                >
                  Preview
                </button>
                {/* Use book.pdf as the link for reading online */}
                {book.pdf && (
                  <a
                    href={book.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded hover:bg-blue-700 transition text-center"
                  >
                    Read Online
                  </a>
                )}
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
            <p className="text-gray-500">No ebooks found.</p>
          </div>
        )}
      </div>

      {/* Modal for Preview */}
      {previewBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setPreviewBook(null)}
            >
              ✖
            </button>
            <h3 className="text-xl font-bold mb-2">📖 {previewBook.title}</h3>
            <p className="text-gray-700 mb-1"><strong>Author:</strong> {previewBook.author}</p>
            <p className="text-gray-600 mb-2"><strong>ISBN:</strong> {previewBook.isbn}</p> {/* Display ISBN */}
            <p className="text-gray-600 mb-2"><strong>Publisher:</strong> {previewBook.publisher}</p> {/* Display Publisher */}
            <p className="text-gray-600 mb-2"><strong>Year:</strong> {previewBook.year}</p> {/* Display Year */}
            <p className="text-gray-600 mb-2"><strong>Category:</strong> {previewBook.category}</p> {/* Display Category */}
            <img
              src={previewBook.image || "https://placehold.co/200x300/cccccc/ffffff?text=No+Cover"}
              alt={previewBook.title}
              className="w-48 h-64 object-cover rounded mb-3 mx-auto"
              onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/200x300/cccccc/ffffff?text=No+Cover"; }}
            />
            <p className="text-gray-700 mb-4">{previewBook.desc || 'No description available.'}</p> {/* Display description */}
            
            <div className="flex gap-2">
              {previewBook.pdf && (
                <a
                  href={previewBook.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded hover:bg-blue-700 transition text-center"
                >
                  Read Online
                </a>
              )}
              <button
                className="bg-gray-400 text-white text-sm px-3 py-1.5 rounded hover:bg-gray-500 transition"
                onClick={() => setPreviewBook(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center mt-12 text-sm text-gray-400">
        © 2024 LMS. All rights reserved.
      </footer>
    </div>
  );
};

export default Ebooks;
