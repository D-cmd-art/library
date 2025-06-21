import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Gauge,
  Book,
  ClipboardList,
  BookOpen,
  Repeat,
  LogOut,
} from "lucide-react";

const AdminSidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { to: "/admin", label: "Dashboard", icon: <Gauge size={18} /> },
    { to: "/Admin/ManageBooks.jsx", label: "Manage Books", icon: <Book size={18} /> },
    { to: "/admin/borrow-requests", label: "Borrow Requests", icon: <ClipboardList size={18} /> },
    { to: "/admin/borrowed-books", label: "Borrowed Books", icon: <BookOpen size={18} /> },
    { to: "/admin/transactions", label: "Transaction", icon: <Repeat size={18} /> },
  ];

  return (
    <div className="h-screen w-64 bg-[#131c2b] text-white flex flex-col justify-between py-6 px-4 rounded-r-lg shadow-lg sticky top-0">
      <div>
        <h1 className="text-2xl font-bold mb-1">Library Management</h1>
        <p className="text-sm text-gray-400 mb-6">Admin Panel</p>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive(item.to)
                  ? "bg-blue-700 text-white font-semibold"
                  : "hover:bg-blue-600 hover:text-white text-gray-300"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <Link
        to="/logout"
        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200"
      >
        <LogOut size={18} />
        Logout
      </Link>
    </div>
  );
};

export default AdminSidebar;
