// AdminLayout.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaBook,
  FaClipboardList,
  FaExchangeAlt,
  FaHistory,
  FaSignOutAlt,
} from 'react-icons/fa';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-slate-800 text-white p-5">
        <h1 className="text-xl font-bold mb-6">
          Library Management <br />
          <span className="text-sm font-normal">Admin Panel</span>
        </h1>
        <nav className="space-y-4">
          <NavItem icon={<FaTachometerAlt />} label="Dashboard" onClick={() => navigate('/admin')} />
          <NavItem icon={<FaBook />} label="Manage Books" onClick={() => navigate('/managebook')} />
          <NavItem icon={<FaClipboardList />} label="Borrow Requests" onClick={() => navigate('/borrowrequests')} />
          <NavItem icon={<FaExchangeAlt />} label="Borrowed Books" onClick={() => navigate('/borrowed-History')} />
          <NavItem icon={<FaHistory />} label="Transaction History" onClick={() => navigate('/transaction-history')} />
        </nav>
        <div className="absolute bottom-5 w-56">
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center justify-center"
            onClick={() => navigate('/login')}
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
};

const NavItem = ({ icon, label, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center space-x-2 hover:bg-slate-700 px-3 py-2 rounded cursor-pointer"
  >
    <div className="text-lg">{icon}</div>
    <span>{label}</span>
  </div>
);

export default AdminLayout;
