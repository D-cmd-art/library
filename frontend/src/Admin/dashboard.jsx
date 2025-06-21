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



function NavItem({ icon, label, onClick }) {
  return (
    <div onClick={onClick} className="flex items-center space-x-2 hover:bg-slate-700 px-3 py-2 rounded cursor-pointer">
      <div className="text-lg">{icon}</div>
      <span>{label}</span>
    </div>
  );
}
