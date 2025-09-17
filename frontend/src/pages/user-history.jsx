import React, { useEffect, useState } from "react";
import api from "../api";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const BorrowHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    pending: true,
    accepted: true,
    returned: true,
  });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("/borrow/history");
        const data = response.data || [];

        // Calculate fine for overdue accepted books
        const today = new Date();
        data.forEach((record) => {
          if (record.status === "accepted" && record.returnDate) {
            const returnDate = new Date(record.returnDate);
            if (today > returnDate) {
              const diffDays = Math.ceil(
                (today - returnDate) / (1000 * 60 * 60 * 24)
              );
              record.fine = diffDays * 20; // Rs 20/day
            } else {
              record.fine = 0;
            }
          } else {
            record.fine = 0;
          }
        });

        setHistory(data);
      } catch (err) {
        console.error("Error fetching borrow history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg animate-pulse">
          Loading borrow history...
        </p>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date)) return "N/A";
    return date.toLocaleDateString();
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderSection = (title, records, statusKey) => (
    <div className="mb-8 border rounded-lg shadow-sm">
      <button
        className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-t-lg focus:outline-none"
        onClick={() => toggleSection(statusKey)}
      >
        <span className="text-xl font-semibold">
          {title} ({records.length})
        </span>
        {expandedSections[statusKey] ? <FiChevronUp /> : <FiChevronDown />}
      </button>
      {expandedSections[statusKey] && (
        <div className="p-4 space-y-4">
          {records.length === 0 ? (
            <p className="text-gray-500">No records in this section.</p>
          ) : (
            records.map((record) => {
              const book = record.book || {};
              const isOverdue =
                record.status === "accepted" &&
                record.returnDate &&
                new Date(record.returnDate) < new Date();

              return (
                <div
                  key={record._id}
                  className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg shadow hover:shadow-md transition ${
                    isOverdue ? "bg-red-100 border border-red-400" : "bg-white"
                  }`}
                >
                  <img
                    src={
                      book.image ||
                      "https://placehold.co/100x140/cccccc/ffffff?text=No+Cover"
                    }
                    alt={book.title || "Unknown Book"}
                    className="w-24 h-32 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-800">
                      {book.title || "Unknown Book"}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Author: {book.author || "Unknown"}
                    </p>
                    <p
                      className={`text-sm mt-1 font-medium ${
                        isOverdue
                          ? "text-red-600"
                          : record.status === "returned"
                          ? "text-green-600"
                          : record.status === "pending"
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    >
                      Status: {record.status} {isOverdue && "(Overdue)"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Requested: {formatDate(record.createdAt)}
                    </p>
                    {record.returnDate && (
                      <p
                        className={`text-xs mt-1 ${
                          isOverdue ? "text-red-600 font-bold" : "text-gray-500"
                        }`}
                      >
                        Expected Return: {formatDate(record.returnDate)}
                        {isOverdue && record.fine > 0 && (
                          <span className="ml-2 font-bold">
                            Fine: Rs {record.fine}
                          </span>
                        )}
                      </p>
                    )}
                    {record.actualReturnDate && (
                      <p className="text-xs text-gray-500">
                        Returned: {formatDate(record.actualReturnDate)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );

  const pending = history.filter((record) => record.status === "pending");
  const accepted = history.filter((record) => record.status === "accepted");
  const returned = history.filter((record) => record.status === "returned");

  return (
    <div className="px-4 py-8 max-w-5xl mx-auto font-sans">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Borrow History
      </h2>

      {renderSection("Pending Requests", pending, "pending")}
      {renderSection("Accepted Requests", accepted, "accepted")}
      {renderSection("Returned Books", returned, "returned")}
    </div>
  );
};

export default BorrowHistoryPage;
