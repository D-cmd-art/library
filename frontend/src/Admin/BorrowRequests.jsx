import React, { useState } from 'react';

const BorrowRequests = () => {
  const [requests, setRequests] = useState([
    {
      id: 1,
      bookTitle: '1984',
      borrowerName: 'Alice Sharma',
      status: 'Pending',
    },
    {
      id: 2,
      bookTitle: 'The Great Gatsby',
      borrowerName: 'Rahul Thapa',
      status: 'Pending',
    },
  ]);

  const handleAction = (id, action) => {
    const updated = requests.map((req) =>
      req.id === id ? { ...req, status: action } : req
    );
    setRequests(updated);
  };

  return (
    <div className="p-6 bg-white rounded shadow w-full">
      <h2 className="text-2xl font-semibold mb-4">Borrow Requests</h2>
      <table className="w-full table-auto border divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-2">Borrower</th>
            <th className="text-left p-2">Book Title</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id} className="border-t">
              <td className="p-2">{req.borrowerName}</td>
              <td className="p-2">{req.bookTitle}</td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded text-white ${
                    req.status === 'Accepted'
                      ? 'bg-green-500'
                      : req.status === 'Rejected'
                      ? 'bg-red-500'
                      : 'bg-yellow-500'
                  }`}
                >
                  {req.status}
                </span>
              </td>
              <td className="p-2 space-x-2">
                {req.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => handleAction(req.id, 'Accepted')}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleAction(req.id, 'Rejected')}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BorrowRequests;
