
import React from 'react';
import { FaBook, FaUsers, FaDownload, FaStar, FaSearch } from 'react-icons/fa';
import AboutUs from './About';
import ContactUs from './Contact';

const Home = () => {
  return (
    <div className="font-sans">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-20 px-5 rounded-b-3xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Library Management System</h1>
        <p className="text-lg md:text-xl max-w-xl mx-auto mb-6">
          Discover, borrow, and enjoy thousands of books. Your next great read is just a search away.
        </p>
        <div className="flex justify-center">
          <div className="flex items-center bg-white rounded-full overflow-hidden px-4 py-2 w-full max-w-md shadow-md">
            <input 
              type="text" 
              placeholder="Search for books, authors, or genres..." 
              className="flex-grow px-4 py-2 text-gray-700 focus:outline-none"
            />
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700">
              <FaSearch />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6 py-12 bg-white text-center">
        <div className="shadow-md rounded-xl p-6 border">
          <FaBook className="text-4xl mx-auto text-purple-600 mb-3" />
          <h3 className="text-2xl font-bold">250+</h3>
          <p className="text-gray-600">Books Available</p>
        </div>

        <div className="shadow-md rounded-xl p-6 border">
          <FaUsers className="text-4xl mx-auto text-purple-600 mb-3" />
          <h3 className="text-2xl font-bold">50+</h3>
          <p className="text-gray-600">Active Members</p>
        </div>

        <div className="shadow-md rounded-xl p-6 border">
          <FaDownload className="text-4xl mx-auto text-purple-600 mb-3" />
          <h3 className="text-2xl font-bold">150+</h3>
          <p className="text-gray-600">Books Borrowed</p>
        </div>

        <div className="shadow-md rounded-xl p-6 border">
          <FaStar className="text-4xl mx-auto text-purple-600 mb-3" />
          <h3 className="text-2xl font-bold">4.8</h3>
          <p className="text-gray-600">Average Rating</p>
        </div>

      </div>
      <AboutUs/>
      <ContactUs/>
    </div>
  );
};

export default Home;
