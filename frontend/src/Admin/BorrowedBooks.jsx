import React, { useState } from 'react';

const BorrowRequests = () => {
  const [requests, setRequests] = useState([
    {
      id: 1,
      user: 'Alice',
      bookTitle: '1984',
      dueDate: '2025-06-10',
      status: 'pending'
    },
    {
      id: 2,
      user: 'Bob',
      bookTitle: 'To Kill a Mockingbird',
      dueDate: '2025-06-15',
      status: 'pending'
    }
  ]);

  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [returnedBooks, setReturnedBooks] = useState([]);
  const [showReturned, setShowReturned] = useState(false);

  const handleAccept = (id) => {
    const updated = requests.map(req =>
      req.id === id ? { ...req, status: 'accepted' } : req
    );
    const accepted = updated.find(req => req.id === id);
    setAcceptedRequests([...acceptedRequests, accepted]);
    setRequests(updated.filter(req => req.id !== id));
  };

  const handleReject = (id) => {
    setRequests(requests.filter(req => req.id !== id));
  };

  const handleReturn = (req) => {
    setReturnedBooks([...returnedBooks, req]);
    setAcceptedRequests(acceptedRequests.filter(item => item.id !== req.id));
  };

  const isOverdue = (dueDate) => new Date() > new Date(dueDate);

  return (
    <div className="p-6 bg-white rounded shadow w-full">
      <h2 className="text-2xl font-semibold mb-4">Borrow Requests</h2>

      <div className="mb-6">
        {requests.map((req) => (
          <div key={req.id} className="border p-4 mb-4 rounded">
            <p><strong>User:</strong> {req.user}</p>
            <p><strong>Book:</strong> {req.bookTitle}</p>
            <p><strong>Due Date:</strong> {req.dueDate}</p>
            <div className="space-x-2 mt-2">
              <button onClick={() => handleAccept(req.id)} className="bg-green-600 text-white px-3 py-1 rounded">Accept</button>
              <button onClick={() => handleReject(req.id)} className="bg-red-600 text-white px-3 py-1 rounded">Reject</button>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-xl font-semibold mb-4">Accepted Requests</h3>
      <div className="mb-6">
        {acceptedRequests.map((req) => {
          const fine = isOverdue(req.dueDate) ? 50 : 0;
          return (
            <div key={req.id} className="border p-4 mb-4 bg-gray-50 rounded">
              <h4 className="font-semibold">{req.bookTitle}</h4>
              <p>Borrowed By: {req.user}</p>
              <p>Due Date: {req.dueDate}</p>
              {fine > 0 && <p className="text-red-500">Overdue Fine: ₹{fine}</p>}
              <button
                onClick={() => handleReturn(req)}
                className="bg-blue-600 text-white px-3 py-1 mt-2 rounded"
              >
                Mark as Returned
              </button>
            </div>
          );
        })}
      </div>

      <button
        className="bg-purple-600 text-white px-4 py-2 rounded"
        onClick={() => setShowReturned(!showReturned)}
      >
        {showReturned ? 'Hide' : 'View'} Returned Books ({returnedBooks.length})
      </button>

      {showReturned && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Returned Books</h3>
          {returnedBooks.map((book, i) => (
            <div key={i} className="border-b py-2">
              {book.bookTitle} - Returned by {book.user}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BorrowRequests;
