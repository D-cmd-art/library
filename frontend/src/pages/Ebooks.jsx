import React from 'react';
const books = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    rating: 4.2,
    desc: 'A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.',
    image: 'https://covers.openlibrary.org/b/id/7222246-L.jpg'
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    rating: 4.8,
    desc: 'A powerful story about racial injustice and moral growth in the American South.',
    image: 'https://covers.openlibrary.org/b/id/8228691-L.jpg'
  },
  {
    title: 'Steve Jobs',
    author: 'Walter Isaacson',
    rating: 4.3,
    desc: 'The definitive biography of the Apple co-founder and tech visionary.',
    image: 'https://covers.openlibrary.org/b/id/7222246-L.jpg'
  },
  {
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    rating: 4.6,
    desc: 'A fascinating look at the history of humankind from the Stone Age to the present.',
    image: 'https://covers.openlibrary.org/b/id/10472261-L.jpg'
  }
];


const Ebooks = () => {
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
        {books.map((book, index) => (
          <div
            key={index}
            className="bg-white rounded shadow-md hover:shadow-lg transition duration-300 p-4 flex flex-col"
          >
            {/* Book Image */}
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-48 object-cover rounded mb-4"
            />

            {/* Book Info */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">{book.title}</h3>
              <p className="text-sm text-gray-500 mb-1">by {book.author}</p>
              <div className="text-yellow-500 mb-2">
                {'⭐'.repeat(Math.floor(book.rating))}{' '}
                <span className="text-gray-600">{book.rating}</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{book.desc}</p>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 mt-auto">
              <button className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded hover:bg-blue-700 transition">
                Preview
              </button>
              <button className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded hover:bg-blue-700 transition">
                Read Online
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="text-center mt-12 text-sm text-gray-400">
        © 2024 LMS. All rights reserved.
      </footer>
    </div>
  );
};

export default Ebooks;
