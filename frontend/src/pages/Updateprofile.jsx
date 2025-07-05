// src/components/UpdateProfile.jsx
import React, { useState, useEffect } from 'react';
import api from '../api'; // Centralized Axios instance
import { useNavigate } from 'react-router-dom'; // For redirection

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '', 
    address: '',
    grade: '',
    phoneNumber: '',
    profilePicture: null, 
    currentProfilePictureUrl: '', 
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not logged in. Please log in to update your profile.');
        setLoading(false);
        navigate('/login');
        return;
      }

      try {
        const res = await api.get('/account/profile');
        const userData = res.data;
        setFormData(prev => ({
          ...prev,
          name: userData.name || '',
          email: userData.email || '', 
          address: userData.address || '',
          grade: userData.grade || '',
          phoneNumber: userData.phoneNumber || '',
          currentProfilePictureUrl: userData.profilePicture || '', 
        }));
        setError('');
      } catch (err) {
        console.error("Error fetching user profile for update:", err);
        setError(err.response?.data?.message || 'Failed to load profile data.');
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePicture') {
      setFormData(prev => ({ ...prev, profilePicture: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email); 
      data.append('address', formData.address);
      data.append('grade', formData.grade);
      data.append('phoneNumber', formData.phoneNumber);
      if (formData.profilePicture) {
        data.append('profilePicture', formData.profilePicture); 
      }

      const res = await api.put('/account/profile', data);
      
      setSuccess(res.data.message || 'Profile updated successfully!');
      
      // Redirect back to the account page after successful update
      navigate('/account'); 

    } catch (err) {
      console.error("Error updating profile:", err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-lg text-gray-700 dark:text-gray-300">Loading profile data for update...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">
          Update Your Profile
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {formData.currentProfilePictureUrl && (
            <div className="flex justify-center mb-4">
              <img 
                src={formData.currentProfilePictureUrl} 
                alt="Current Profile" 
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500" 
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "https://placehold.co/128x128/cccccc/ffffff?text=No+Image";
                }}
              />
            </div>
          )}
          <div>
            <label htmlFor="profilePicture" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Profile Picture
            </label>
            <input
              id="profilePicture"
              type="file"
              name="profilePicture"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Email (Read-only)
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              readOnly 
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
            />
          </div>
          <div>
            <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Address
            </label>
            <input
              id="address"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Your Address"
            />
          </div>
          <div>
            <label htmlFor="grade" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Grade
            </label>
            <input
              id="grade"
              type="text"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Your Grade (e.g., 10, Freshman)"
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="tel" 
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="e.g., +1234567890"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
            disabled={submitting}
          >
            {submitting ? 'Updating...' : 'Update Profile'}
          </button>
          {error && <p className="text-red-600 mt-2 text-center">{error}</p>}
          {success && <p className="text-green-600 mt-2 text-center">{success}</p>}
        </form>
        <div className="mt-4 text-center">
          <button 
            onClick={() => navigate('/account')} 
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Back to Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
