import React from "react";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-200 py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Us */}
        <div>
          <h2 className="text-xl font-bold mb-2 text-white">Library Management System</h2>
          <p className="text-gray-400 text-sm">
            Empowering knowledge sharing by providing seamless access to books and resources.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-white">Quick Links</h3>
          <ul className="space-y-1 text-gray-400 text-sm">
            <li><a href="/browse" className="hover:text-white">Browse Books</a></li>
            <li><a href="/borrow" className="hover:text-white">Borrow Books</a></li>
            <li><a href="/donate" className="hover:text-white">Donate Books</a></li>
            <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-white">Contact</h3>
          <ul className="text-gray-400 text-sm space-y-2">
            <li className="flex items-center gap-2"><Phone size={10} /> +977 9811077752</li>
            <li className="flex items-center gap-2"><Mail size={16} /> support@lms.com</li>
            <li className="flex items-center gap-2"><MapPin size={16} /> Damak-04,namunachowk,jhapa</li>
          </ul>
          <div className="flex gap-3 mt-3">
            <a href="#" className="hover:text-white"><Facebook size={18} /></a>
            <a href="#" className="hover:text-white"><Twitter size={18} /></a>
            <a href="#" className="hover:text-white"><Instagram size={18} /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Library Management System. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
