import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitted(false);
        setSubmitError('');
        setIsSubmitting(true);

        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            setSubmitError('Please fill in all fields.');
            setIsSubmitting(false);
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setSubmitError('Please enter a valid email address.');
            setIsSubmitting(false);
            return;
        }

        console.log('Form Data Submitted:', formData);
        try {
            // Simulate success after a short delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            setIsSubmitted(true);
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
        } catch (error) {
            console.error('Error submitting contact form:', error);
            setSubmitError(error.message || 'There was an error sending your message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-10 px-6 bg-gradient-to-br from-blue-100 to-purple-100 font-inter">
            <div className="max-w-5xl w-full mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-[1.01]">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                        Let's Connect!
                    </h1>
                    <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                        We're eager to hear from you. Reach out with any questions, feedback, or collaborations.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Contact Information Section */}
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2 inline-block">Our Details</h2>
                        <div className="space-y-6">
                            <div className="flex items-center text-gray-700 p-3 bg-blue-50 rounded-lg shadow-sm hover:shadow-md transition duration-200">
                                <FaPhone className="text-blue-600 mr-4 text-2xl" />
                                <div>
                                    <h3 className="font-semibold text-lg">Phone</h3>
                                    <p className="text-md">+977 9811077752</p>
                                </div>
                            </div>
                            <div className="flex items-center text-gray-700 p-3 bg-purple-50 rounded-lg shadow-sm hover:shadow-md transition duration-200">
                                <FaEnvelope className="text-purple-600 mr-4 text-2xl" />
                                <div>
                                    <h3 className="font-semibold text-lg">Email</h3>
                                    <p className="text-md">support@LMs.com</p>
                                </div>
                            </div>
                            <div className="flex items-center text-gray-700 p-3 bg-green-50 rounded-lg shadow-sm hover:shadow-md transition duration-200">
                                <FaMapMarkerAlt className="text-green-600 mr-4 text-2xl" />
                                <div>
                                    <h3 className="font-semibold text-lg">Address</h3>
                                    <p className="text-md">123Library , Koshi, Ratuwamai-09,talibhatta, Morang, Nepal</p>
                                </div>
                            </div>
                        </div>

                        {/* Map Embed */}
                        <div className="mt-10">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2 inline-block">Find Us on Map</h3>
                            <div className="rounded-xl overflow-hidden shadow-xl border border-gray-200">
                                <iframe
                                    // REPLACE THIS SRC WITH THE ACTUAL EMBEDDABLE URL FROM GOOGLE MAPS
                                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d412.9958919948418!2d87.6117646657572!3d26.56323473423577!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2snp!4v1751700818093!5m2!1sen!2snp"
                                    width="100%"
                                    height="300"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Library Location"
                                ></iframe>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form Section */}
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2 inline-block">Send Us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-gray-700 text-base font-semibold mb-2">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-3 focus:ring-blue-300 transition duration-200"
                                    placeholder="Your Full Name"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-gray-700 text-base font-semibold mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-3 focus:ring-blue-300 transition duration-200"
                                    placeholder="your.email@example.com"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-gray-700 text-base font-semibold mb-2">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-3 focus:ring-blue-300 transition duration-200"
                                    placeholder="How can we help you?"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-gray-700 text-base font-semibold mb-2">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="6"
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-3 focus:ring-blue-300 transition duration-200 resize-y"
                                    placeholder="Type your message here..."
                                    required
                                ></textarea>
                            </div>

                            {isSubmitted && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-5 py-4 rounded-lg flex items-center shadow-md animate-fade-in">
                                    <FaCheckCircle className="text-green-500 text-2xl mr-3" />
                                    <p className="font-semibold">Your message has been sent successfully! We'll get back to you shortly.</p>
                                </div>
                            )}

                            {submitError && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-5 py-4 rounded-lg flex items-center shadow-md animate-fade-in">
                                    <FaTimesCircle className="text-red-500 text-2xl mr-3" />
                                    <p className="font-semibold">{submitError}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                className={`w-full flex items-center justify-center py-3 px-6 rounded-lg text-white font-bold text-lg shadow-lg transition duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-300 ${
                                    isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <FaPaperPlane className="mr-2" />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                <footer className="text-center mt-16 text-sm text-gray-500 border-t border-gray-200 pt-8">
                    © 2025 LMS. All rights reserved.
                </footer>
            </div>
        </div>
    );
};

export default ContactUs;