import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaBook,
  FaClipboardList,
  FaExchangeAlt,
  FaHistory,
  FaSignOutAlt
} from 'react-icons/fa';
import Ebooks from './pages/Ebooks';

const stats = [
  { label: 'Total Books', count: 2, color: 'bg-blue-500', icon: <FaBook /> },
  { label: 'Total eBooks', count: 2, color: 'bg-green-500', icon: <FaBook /> },
  { label: 'Pending Requests', count: 2, color: 'bg-orange-500', icon: <FaClipboardList /> },
  { label: 'Active Borrows', count: 3, color: 'bg-red-500', icon: <FaExchangeAlt /> },
];

const recentRequests = [
  { id: 'r2', user: 'Jane Smith', book: 'Sapiens: A Brief History of Humankind', date: 'Jun 11, 2025', status: 'Pending' },
  { id: 'r1', user: 'John Doe', book: 'To Kill a Mockingbird', date: 'Jun 10, 2025', status: 'Pending' },
];

const overdueBooks = [
  { book: '1984', borrower: 'David Miller', due: 'Jun 3, 2025', overdue: 10, fine: '$10.00' },
];

export default function AdminPanel() {
  const navigate = useNavigate();

  return (
    
    <div className="flex h-screen bg-gray-100">
      
      <aside className="w-64 bg-slate-800 text-white p-5">
        <h1 className="text-xl font-bold mb-6">Library Management <br /> <span className="text-sm font-normal">Admin Panel</span></h1>
        <nav className="space-y-4">
          <NavItem icon={<FaTachometerAlt />} label="Dashboard" onClick={() => navigate('/admin')} />
          <NavItem icon={<FaBook />} label="Manage Books" onClick={() => navigate('/managebook')} />
          <NavItem icon={<FaClipboardList />} label="Borrow Requests" onClick={() => navigate('/borrow-requests')} />
          <NavItem icon={<FaExchangeAlt />} label="Borrowed Books" onClick={() => navigate('/borrowed-books')} />
          <NavItem icon={<FaHistory />} label="Transaction History" onClick={() => navigate('/transaction-history')} />
        </nav>
        <div className="absolute bottom-5 w-56">
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center justify-center" onClick={()=>navigate('/login')}>
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6">Library Management System</h2>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className={`p-6 rounded shadow text-white ${stat.color} flex items-center`}>
              <div className="text-3xl mr-4">{stat.icon}</div>
              <div>
                <div className="text-sm">{stat.label}</div>
                <div className="text-xl font-bold">{stat.count}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Borrow Requests */}
        <div className="bg-white rounded shadow p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Recent Borrow Requests</h3>
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2">Request ID</th>
                <th className="p-2">User</th>
                <th className="p-2">Book</th>
                <th className="p-2">Request Date</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.map((req, i) => (
                <tr key={i} className="border-b">
                  <td className="p-2">{req.id}</td>
                  <td className="p-2">{req.user}</td>
                  <td className="p-2">{req.book}</td>
                  <td className="p-2">{req.date}</td>
                  <td className="p-2">{req.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Overdue Books */}
        <div className="bg-white rounded shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Overdue Books</h3>
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2">Book</th>
                <th className="p-2">Borrower</th>
                <th className="p-2">Due Date</th>
                <th className="p-2">Days Overdue</th>
                <th className="p-2">Fine</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {overdueBooks.map((book, i) => (
                <tr key={i} className="border-b">
                  <td className="p-2">{book.book}</td>
                  <td className="p-2">{book.borrower}</td>
                  <td className="p-2">{book.due}</td>
                  <td className="p-2">{book.overdue}</td>
                  <td className="p-2">{book.fine}</td>
                  <td className="p-2">
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm">
                      Process Return
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, onClick }) {
  return (
    <div onClick={onClick} className="flex items-center space-x-2 hover:bg-slate-700 px-3 py-2 rounded cursor-pointer">
      <div className="text-lg">{icon}</div>
      <span>{label}</span>
    </div>
  );
}
