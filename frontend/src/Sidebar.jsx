import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    { path: "/admin", label: "Dashboard" },
    { path: "/admin/ManageBooks", label: "Manage Books" },
    { path: "/admin/customers", label: "Borrow Requests" },
    { path: "/admin/adminProducts", label: "Borrowed Books" },
    { path: "/admin/orders", label: "Donation book " },
  ];

  return (
    <div className="w-64 h-full bg-gray-900 text-white fixed left-0 top-0 flex flex-col">
      <h2 className="text-2xl font-bold text-white p-4">Admin Panel</h2>
      <nav className="flex-grow p-4 space-y-2">
        {navItems.map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            className={`block p-2 rounded ${
              location.pathname === path ? "bg-gray-700" : "hover:bg-gray-800"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
      <button
        onClick={handleLogout}
        className="w-full p-3 bg-red-500 hover:bg-red-600 mt-auto"
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
