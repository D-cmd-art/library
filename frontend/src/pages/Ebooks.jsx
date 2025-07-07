// src/components/Ebooks.jsx
import React, { useState, useEffect } from 'react';
import api from '../api'; // Import your centralized Axios instance

// --- DEMO DATA FOR LOGGED OUT USERS ---
const demoEbooks = [
    {
        _id: 'demo-eb-1',
        title: 'The Alchemist (Demo)',
        author: 'Paulo Coelho',
        isbn: '9780062315007',
        publisher: 'HarperOne',
        year: 1988,
        category: 'Fiction',
        image: 'https://images.unsplash.com/photo-1629986381282-3d84a71b12b5?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        pdf: 'https://www.africau.edu/images/default/sample.pdf', // Example PDF link
    },
    {
        _id: 'demo-eb-2',
        title: 'Sapiens: A Brief History (Demo)',
        author: 'Yuval Noah Harari',
        isbn: '9780062316097',
        publisher: 'Harper',
        year: 2011,
        category: 'Non-Fiction',
        image: 'https://images.unsplash.com/photo-1544947953-cd13c593690d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        pdf: 'https://www.africau.edu/images/default/sample.pdf', // Example PDF link
    },
    {
        _id: 'demo-eb-3',
        title: 'The Lord of the Rings (Demo)',
        author: 'J.R.R. Tolkien',
        isbn: '9780618053267',
        publisher: 'Houghton Mifflin Harcourt',
        year: 1954,
        category: 'Fantasy',
        image: 'https://images.unsplash.com/photo-1521575850100-bf7f6e57924c?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        pdf: 'https://www.africau.edu/images/default/sample.pdf', // Example PDF link
    },
];

const Ebooks = () => {
    const [ebooks, setEbooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [previewBook, setPreviewBook] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkLoginStatusAndFetchEbooks = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                setIsLoggedIn(true);
                try {
                    const response = await api.get('/ebooks');
                    setEbooks(response.data);
                    setError('');
                } catch (err) {
                    console.error("Error fetching ebooks for logged-in user:", err);
                    if (err.response && err.response.status === 401) {
                        setError('Your session has expired. Please log in again.');
                        localStorage.removeItem('token');
                        setIsLoggedIn(false);
                        setEbooks(demoEbooks); // Show demo data on session expiry
                    } else {
                        setError('Failed to load your ebooks. Displaying public collection.');
                        setEbooks(demoEbooks); // Show demo data on other API errors
                    }
                } finally {
                    setLoading(false);
                }
            } else {
                setIsLoggedIn(false);
                setEbooks(demoEbooks); // Directly set demo data if not logged in
                setLoading(false); // No loading state for demo data
                setError(''); // No error when showing demo data intentionally
            }
        };

        checkLoginStatusAndFetchEbooks();
    }, []);

    if (loading) {
        return (
            <div className="px-6 py-10 text-center">
                <p className="text-lg text-gray-700">Loading ebooks...</p>
            </div>
        );
    }

    if (error && isLoggedIn) { // Only show critical error if logged in
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
                    <h2 className="text-2xl font-bold text-gray-800">
                        {isLoggedIn ? 'Your Digital eBooks' : 'Browse Our Ebook Collection (Demo)'}
                    </h2>
                </div>
                <p className="text-gray-500 mt-2">
                    {isLoggedIn
                        ? 'Access our collection of digital books instantly. Read online or download for offline reading.'
                        : 'Discover popular ebooks. Log in to access the full library and exclusive content.'
                    }
                </p>
            </div>

            {!isLoggedIn && (
                <div className="mb-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
                    <p>You are viewing a limited demo collection. Please <button onClick={() => {/* navigate to login */}} className="font-bold text-blue-600 hover:underline">log in</button> to see all available ebooks and advanced features.</p>
                </div>
            )}

            {/* Grid of eBooks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {ebooks.length > 0 ? (
                    ebooks.map((book) => (
                        <div
                            key={book._id}
                            className="bg-white rounded shadow-md hover:shadow-lg transition duration-300 p-4 flex flex-col"
                        >
                            <img
                                src={book.image || "https://placehold.co/200x300/cccccc/ffffff?text=No+Cover"}
                                alt={book.title}
                                className="w-full h-48 object-cover rounded mb-4"
                                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/200x300/cccccc/ffffff?text=No+Cover"; }}
                            />

                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-800">{book.title}</h3>
                                <p className="text-sm text-gray-500 mb-1">by {book.author}</p>
                                <p className="text-sm text-gray-700 mb-2">{book.category}</p>
                                <p className="text-sm text-gray-700 mb-2">Published: {book.year}</p>
                            </div>

                            <div className="flex gap-2 mt-auto">
                                <button
                                    className={`text-sm px-3 py-1.5 rounded transition ${
                                        !isLoggedIn
                                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                    onClick={() => isLoggedIn ? setPreviewBook(book) : alert("Please log in to preview ebooks.")}
                                    disabled={!isLoggedIn}
                                    title={!isLoggedIn ? 'Log in to preview' : 'Preview ebook'}
                                >
                                    Preview
                                </button>
                                {book.pdf && (
                                    <a
                                        href={book.pdf}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`text-sm px-3 py-1.5 rounded transition text-center ${
                                            !isLoggedIn
                                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                        onClick={(e) => {
                                            if (!isLoggedIn) {
                                                e.preventDefault(); // Prevent navigation
                                                alert("Please log in to read ebooks online.");
                                            }
                                        }}
                                        title={!isLoggedIn ? 'Log in to read online' : 'Read Online'}
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

            {/* Modal for Preview (Adjusted based on isLoggedIn) */}
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
                        <p className="text-gray-600 mb-2"><strong>ISBN:</strong> {previewBook.isbn}</p>
                        <p className="text-gray-600 mb-2"><strong>Publisher:</strong> {previewBook.publisher}</p>
                        <p className="text-gray-600 mb-2"><strong>Year:</strong> {previewBook.year}</p>
                        <p className="text-gray-600 mb-2"><strong>Category:</strong> {previewBook.category}</p>
                        <img
                            src={previewBook.image || "https://placehold.co/200x300/cccccc/ffffff?text=No+Cover"}
                            alt={previewBook.title}
                            className="w-48 h-64 object-cover rounded mb-3 mx-auto"
                            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/200x300/cccccc/ffffff?text=No+Cover"; }}
                        />
                        <p className="text-gray-700 mb-4">{previewBook.desc || 'No description available.'}</p>

                        <div className="flex gap-2">
                            {previewBook.pdf && isLoggedIn && ( // Only show PDF link if logged in
                                <a
                                    href={previewBook.pdf}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded hover:bg-blue-700 transition text-center"
                                >
                                    Read Online
                                </a>
                            )}
                            {previewBook.pdf && !isLoggedIn && ( // Show disabled PDF link if not logged in
                                <button
                                    className="bg-gray-400 text-gray-600 text-sm px-3 py-1.5 rounded cursor-not-allowed"
                                    title="Log in to read online"
                                    disabled
                                >
                                    Read Online
                                </button>
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
                © 2025 LMS. All rights reserved.
            </footer>
        </div>
    );
};

export default Ebooks;