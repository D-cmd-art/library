// src/components/BorrowRequestsPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../api'; // Your centralized Axios instance
import { useNavigate } from 'react-router-dom';

const BorrowRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchBorrowRequests = async () => {
        setLoading(true);
        try {
            const response = await api.get('/borrow/requests');
            setRequests(response.data);
            setError('');
        } catch (err) {
            console.error("Error fetching borrow requests:", err);
            if (err.response && err.response.status === 401) {
                setError('Unauthorized. Please log in as an administrator/librarian.');
                // Redirect to login or home if unauthorized
                navigate('/login');
            } else if (err.response && err.response.status === 403) {
                setError('Access denied. You do not have permission to view this page.');
                navigate('/'); // Redirect to home
            } else {
                setError('Failed to load borrow requests. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBorrowRequests();
    }, []);

    const handleUpdateStatus = async (requestId, newStatus) => {
        try {
            await api.patch(`/borrow/requests/${requestId}/status`, { status: newStatus });
            alert(`Request ${requestId} status updated to ${newStatus}.`);
            fetchBorrowRequests(); // Re-fetch requests to update the list
        } catch (err) {
            console.error(`Error updating request status to ${newStatus}:`, err);
            const errorMessage = err.response?.data?.msg || `Failed to update status to ${newStatus}.`;
            alert(errorMessage);
        }
    };

    if (loading) {
        return (
            <div className="px-6 py-10 text-center">
                <p className="text-lg text-gray-700">Loading borrow requests...</p>
            </div>
        );
    }

    if (error) {
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
                    <span className="text-3xl">📥</span>
                    <h2 className="text-2xl font-bold text-gray-800">Manage Borrow Requests</h2>
                </div>
                <p className="text-gray-500 mb-4">
                    Review and manage pending book borrowing requests from users.
                </p>
            </div>

            {requests.length > 0 ? (
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Book Title
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Requested On
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {requests.map((request) => (
                                <tr key={request._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{request.user?.username || 'N/A'}</div>
                                        <div className="text-sm text-gray-500">{request.user?.email || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {request.book?.image && (
                                                <img className="h-10 w-10 rounded-full mr-2 object-cover" src={request.book.image} alt={request.book.title} />
                                            )}
                                            <div className="text-sm font-medium text-gray-900">{request.book?.title || 'N/A'}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(request.requestDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                            request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {request.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleUpdateStatus(request._id, 'accepted')}
                                                    className="text-green-600 hover:text-green-900 mr-3"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(request._id, 'rejected')}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        {request.status === 'accepted' && (
                                            <button
                                                onClick={() => handleUpdateStatus(request._id, 'returned')}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Mark Returned
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="col-span-full text-center">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/7465/7465691.png" // Placeholder for no requests
                        alt="No requests"
                        className="w-32 mx-auto mb-4 opacity-60"
                    />
                    <p className="text-gray-500">No borrow requests found.</p>
                </div>
            )}

            <footer className="text-center mt-12 text-sm text-gray-400">
                © 2025 LMS. All rights reserved.
            </footer>
        </div>
    );
};

export default BorrowRequestsPage;