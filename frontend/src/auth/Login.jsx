import React, { useState } from "react";
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    try {
      const res = await api.post('/auth/login', { email, password });
      
      // Store the token in local storage
      localStorage.setItem('token', res.data.token);
      
      // Store the user data (including role) in local storage
      // It's good practice to stringify objects before storing in localStorage
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // --- NEW LOGIC FOR ROLE-BASED REDIRECTION ---
      const userRole = res.data.user.role; // Get the role from the response

      if (userRole === 'admin' || userRole === 'librarian') {
        navigate('/admin/borrow-requests'); // Redirect admins/librarians to their specific page
      } else {
        navigate('/'); // Redirect regular users to the home page
      }
      // --- END NEW LOGIC ---

    } catch (err) {
      // Handle different error responses from the backend
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      console.error("Login Error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">
          Login to Library
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="********"
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition">
            Login
          </button>
          {error && <p className="text-red-600 mt-2 text-center">{error}</p>}
        </form>
        <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <a href="/Register" className="text-blue-600 hover:underline dark:text-blue-400">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
