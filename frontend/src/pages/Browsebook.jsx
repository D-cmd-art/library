// src/components/BorrowBooks.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import api from '../api'; // Import your centralized Axios instance

// --- DEMO DATA FOR LOGGED OUT USERS ---
const demoPhysicalBooks = [
    {
        _id: 'demo-pb-1',
        title: 'The Great Gatsby (Demo)',
        author: 'F. Scott Fitzgerald',
        isbn: '9780743273565',
        publisher: 'Scribner',
        year: 1925,
        copies: 5,
        available: 3, // Simulate some available copies
        category: 'Fiction',
        image: 'https://images.unsplash.com/photo-1549677334-a81d11b22e11?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        rating: 4.5,
    },
    {
        _id: 'demo-pb-2',
        title: '1984 (Demo)',
        author: 'George Orwell',
        isbn: '9780451524935',
        publisher: 'Signet Classic',
        year: 1949,
        copies: 10,
        available: 0, // Simulate out of stock
        category: 'Dystopian',
        image: 'https://images.unsplash.com/photo-1629819779344-98442a865a9b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        rating: 4.0,
    },
    {
        _id: 'demo-pb-3',
        title: 'Pride and Prejudice (Demo)',
        author: 'Jane Austen',
        isbn: '9780141439518',
        publisher: 'Penguin Classics',
        year: 1813,
        copies: 7,
        available: 7,
        category: 'Romance',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd87?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        rating: 4.8,
    },
];

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
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoginStatusAndFetchBooks = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                setIsLoggedIn(true);
                try {
                    const response = await api.get('/physical-books');
                    setBooks(response.data);
                    setError('');
                } catch (err) {
                    console.error("Error fetching physical books for logged-in user:", err);
                    if (err.response && err.response.status === 401) {
                        setError('Your session has expired. Please log in again.');
                        localStorage.removeItem('token');
                        setIsLoggedIn(false);
                        setBooks(demoPhysicalBooks); // Show demo data on session expiry
                    } else {
                        setError('Failed to load your books. Displaying public collection.');
                        setBooks(demoPhysicalBooks); // Show demo data on other API errors
                    }
                } finally {
                    setLoading(false);
                }
            } else {
                setIsLoggedIn(false);
                setBooks(demoPhysicalBooks); // Directly set demo data if not logged in
                setLoading(false); // No loading state for demo data
                setError(''); // No error when showing demo data intentionally
            }
        };

        checkLoginStatusAndFetchBooks();
    }, [navigate]);

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

    // Only show critical error if logged in AND an error occurred that couldn't be mitigated by demo data
    if (error && isLoggedIn) {
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
                    <h2 className="text-2xl font-bold text-gray-800">
                        {isLoggedIn ? 'Your Borrowable Books' : 'Browse Our Collection (Demo)'}
                    </h2>
                </div>
                <p className="text-gray-500 mb-4">
                    {isLoggedIn
                        ? 'Discover books available for borrowing from our library.'
                        : 'Log in to access the full collection and borrow books.'
                    }
                </p>

                {!isLoggedIn && (
                    <div className="mb-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
                        <p>You are viewing a limited demo collection. Please <button onClick={() => navigate('/login')} className="font-bold text-blue-600 hover:underline">log in</button> to see all available books and borrow features.</p>
                    </div>
                )}

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
                            key={book._id}
                            className="bg-white rounded shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-4 flex flex-col"
                        >
                            <img
                                src={book.image || "https://placehold.co/200x300/cccccc/ffffff?text=No+Cover"}
                                alt={book.title}
                                className="w-full h-48 object-cover rounded mb-4"
                                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/200x300/cccccc/ffffff?text=No+Cover"; }}
                            />
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {highlightMatch(book.title, searchTerm)}
                                </h3>
                                <p className="text-sm text-gray-500 mb-1">
                                    by {highlightMatch(book.author, searchTerm)}
                                </p>
                                {book.rating && (
                                    <div className="mb-1 flex items-center gap-1">
                                        {renderStars(book.rating)}
                                        <span className="ml-1 text-sm text-gray-500">({book.rating})</span>
                                    </div>
                                )}
                                <p
                                    className={`text-sm mb-2 ${
                                        book.available > 0
                                            ? 'text-green-600'
                                            : 'text-red-500'
                                    }`}
                                >
                                    {book.available > 0 ? `Available (${book.available} copies)` : 'Out of Stock'}
                                </p>
                            </div>

                            <div className="mt-4 flex gap-2">
                                <button
                                    className={`text-white text-sm px-3 py-1.5 rounded transition ${
                                        book.available === 0 || !isLoggedIn // Disable if out of stock OR not logged in
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-green-600 hover:bg-green-700'
                                    }`}
                                    onClick={() => alert(`Borrow request placed for "${book.title}"!`)} // Replace with actual borrow logic
                                    disabled={book.available === 0 || !isLoggedIn} // Disable if no copies available or not logged in
                                    title={!isLoggedIn ? 'Log in to borrow' : (book.available === 0 ? 'Out of stock' : 'Confirm Borrow')}
                                >
                                    Confirm Borrow
                                </button>
                                <button
                                    className={`text-sm px-3 py-1.5 rounded mt-auto transition ${
                                        book.available > 0 && isLoggedIn // Enable preview only if available AND logged in
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                    onClick={() => {
                                        if (book.available > 0 && isLoggedIn) {
                                            navigate(`/preview/${book._id}`, { state: { book } });
                                        }
                                    }}
                                    disabled={book.available === 0 || !isLoggedIn}
                                    title={!isLoggedIn ? 'Log in to preview' : (book.available === 0 ? 'Out of stock' : 'Preview book')}
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
                        <p className="text-gray-500">No books found.</p>
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