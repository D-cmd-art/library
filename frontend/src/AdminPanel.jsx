import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import ManageBooks from './Admin/ManageBooks';
import BorrowRequests from './Admin/BorrowRequests';
import Dashboard from './Admin/dashboard';
import BorrowBooks from './pages/Browsebook';
import TransactionHistory from './Admin/TransactionHistory';


const PrivateAdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user && user.role === "admin" ? children : <Navigate to="/login" />;
};

export default function AdminPanel() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-grow ml-64 overflow-auto p-4">
        <Routes>
          <Route path="/" element={<PrivateAdminRoute><Dashboard /></PrivateAdminRoute>} />
          <Route path="ManageBooks" element={<PrivateAdminRoute><ManageBooks /></PrivateAdminRoute>} />
          <Route path="customers" element={<PrivateAdminRoute><BorrowRequests /></PrivateAdminRoute>} />
          <Route path="adminProducts" element={<PrivateAdminRoute><BorrowBooks /></PrivateAdminRoute>} />
          <Route path="orders" element={<PrivateAdminRoute><TransactionHistory /></PrivateAdminRoute>} />
           <Route path="*" element={<Navigate to="/admin" />} />
        </Routes>
      </div>
    </div>
  );
}
