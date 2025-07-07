import React from 'react';
import { FaBookOpen, FaUsers, FaLightbulb, FaHeart } from 'react-icons/fa'; // Importing relevant icons

const AboutUs = () => {
    return (
        <div className="px-6 py-10 bg-gray-50 min-h-screen font-inter"> {/* Using Inter font */}
            <div className="max-w-6xl mx-auto bg-white p-8 md:p-12 rounded-lg shadow-xl">

                {/* Hero Section: Title and Introduction */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                        Your Gateway to Knowledge and Community
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Welcome to our library, a place where stories come alive, knowledge is shared, and communities connect. We are more than just books; we are a hub for discovery and growth.
                    </p>
                </div>

                {/* Our Story Section */}
                <section className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <div className="md:order-2">
                        <img
                            src="https://images.unsplash.com/photo-1521587765099-ef19677286fa?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="People reading in a library"
                            className="w-full h-72 object-cover rounded-xl shadow-lg"
                        />
                    </div>
                    <div className="md:order-1">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Founded in <span className="font-semibold text-blue-600">2005</span>, our library began as a small community initiative with a big dream: to make knowledge accessible to everyone. What started with a modest collection of donated books has grown into a modern, vibrant learning center serving thousands of patrons.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            Over the years, we've expanded our resources, embraced digital innovation, and fostered a welcoming environment for all ages. We are proud to be a cornerstone of our community, continuously evolving to meet the needs of our diverse users.
                        </p>
                    </div>
                </section>

                {/* Our Mission & Vision Section */}
                <section className="mb-16 text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission & Vision</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-blue-50 p-8 rounded-lg shadow-md flex flex-col items-center">
                            <FaLightbulb className="text-blue-600 text-5xl mb-4" />
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">Our Mission</h3>
                            <p className="text-gray-700 leading-relaxed">
                                To empower individuals through literacy, foster intellectual curiosity, and provide a welcoming space for community engagement and lifelong learning.
                            </p>
                        </div>
                        <div className="bg-green-50 p-8 rounded-lg shadow-md flex flex-col items-center">
                            <FaHeart className="text-green-600 text-5xl mb-4" />
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">Our Vision</h3>
                            <p className="text-gray-700 leading-relaxed">
                                To be the leading resource for knowledge and cultural enrichment, inspiring a love for reading and learning that transcends generations.
                            </p>
                        </div>
                    </div>
                </section>

                {/* What We Offer / Core Values Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">What We Offer</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center text-center">
                            <FaBookOpen className="text-purple-600 text-4xl mb-3" />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Vast Collection</h3>
                            <p className="text-gray-700">Explore thousands of physical books, ebooks, audiobooks, and periodicals across all genres.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center text-center">
                            <FaUsers className="text-red-600 text-4xl mb-3" />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Community Programs</h3>
                            <p className="text-gray-700">Join our workshops, book clubs, storytelling sessions, and cultural events for all ages.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center text-center">
                            <FaLightbulb className="text-yellow-600 text-4xl mb-3" />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Learning Resources</h3>
                            <p className="text-gray-700">Access online databases, research tools, and educational support for academic and personal growth.</p>
                        </div>
                    </div>
                </section>

                {/* Call to Action Section */}
                <section className="text-center bg-blue-600 text-white p-10 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold mb-4">Join Our Community Today!</h2>
                    <p className="text-lg mb-6 max-w-2xl mx-auto">
                        Become a member and unlock a world of knowledge, resources, and engaging events. We look forward to welcoming you!
                    </p>
                    <button
                        onClick={() => alert('Navigate to Membership/Sign Up page!')} // Replace with actual navigation
                        className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-100 transition duration-300 transform hover:scale-105"
                    >
                        Become a Member
                    </button>
                </section>

               
            </div>
        </div>
    );
};

export default AboutUs;