// MyAccount.jsx
import React, { useEffect, useState } from 'react'; // CORRECTED SYNTAX HERE
import api from '../api'; // Import the centralized Axios instance
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const Account = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize navigate hook

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not logged in. Please log in to view your profile.');
        setLoading(false);
        navigate('/login'); // Redirect to login if no token
        return;
      }

      try {
        // Fetch user profile from the /api/account/profile endpoint
        const res = await api.get('/account/profile'); 
        setUser(res.data);
        setError(''); // Clear any previous errors
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError(err.response?.data?.message || 'Failed to fetch user data. Please try logging in again.');
        
        // If the token is invalid or expired (401/403), remove it and prompt re-login
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem('token');
          navigate('/login'); // Redirect to login page
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]); // Add navigate to dependency array to avoid lint warnings

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-lg text-gray-700 dark:text-gray-300">Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-lg text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  // Display user profile if loaded successfully
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-gray-900 dark:text-white">
        <h1 className="text-3xl font-bold mb-6 text-center">Your Profile</h1>
        {user ? (
          <div className="space-y-4">
            {/* Display profile picture */}
            {user.profilePicture && (
              <div className="flex justify-center mb-4">
                <img 
                  src={user.profilePicture} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-500" 
                  onError={(e) => { // Fallback for broken images
                    e.target.onerror = null; 
                    e.target.src = "https://placehold.co/128x128/cccccc/ffffff?text=No+Image"; // Placeholder image
                  }}
                />
              </div>
            )}
            
            <p className="text-lg"><strong>Name:</strong> {user.name}</p>
            <p className="text-lg"><strong>Email:</strong> {user.email}</p>
            {/* Explicitly render new fields */}
            {user.address && <p className="text-lg"><strong>Address:</strong> {user.address}</p>}
            {user.grade && <p className="text-lg"><strong>Grade:</strong> {user.grade}</p>}
            {user.phoneNumber && <p className="text-lg"><strong>Phone:</strong> {user.phoneNumber}</p>}
            {user.role && <p className="text-lg"><strong>Role:</strong> {user.role}</p>}

            {/* Link to Update Profile page */}
            <div className="mt-6 text-center">
              <button 
                onClick={() => navigate('/update-profile')} 
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
              >
                Update Profile
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400">No user data available.</p>
        )}
      </div>
    </div>
  );
};

export default Account;
