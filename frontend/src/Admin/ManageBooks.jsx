// src/components/ManageBooks.jsx
import React, { useState, useEffect } from 'react';
import api from '../api'; // Your centralized Axios instance

// --- Cloudinary Configuration (Replace with your actual details) ---
const CLOUDINARY_CLOUD_NAME = 'dyzkykmoq'; // e.g., 'dqxxxxxx'
const CLOUDINARY_UPLOAD_PRESET = 'Libraryupload'; // e.g., 'ml_default' or your custom unsigned preset

const ManageBooks = () => {
  const [activeTab, setActiveTab] = useState('physical');
  const [physicalBooks, setPhysicalBooks] = useState([]);
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [physicalFormData, setPhysicalFormData] = useState({
    title: '', author: '', isbn: '', publisher: '', year: '', copies: 1, category: '', image: null // image will be a File object initially
  });

  const [ebookFormData, setEbookFormData] = useState({
    title: '', author: '', isbn: '', publisher: '', year: '', category: '', image: null, pdf: null // image and pdf will be File objects initially
  });

  const [ebookImageFileName, setEbookImageFileName] = useState('');
  const [ebookPdfFileName, setEbookPdfFileName] = useState('');
  const [physicalImageFileName, setPhysicalImageFileName] = useState('');

  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      setError('');
      try {
        await fetchBooks('physical-books', setPhysicalBooks);
        await fetchBooks('ebooks', setEbooks);
      } catch (err) {
        setError('Failed to load books: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  }, []);

  const fetchBooks = async (endpoint, setData) => {
    try {
      const res = await api.get(`/${endpoint}`);
      setData(res.data);
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err);
      throw err;
    }
  }

  const handleChange = (e, setFormData, isEbookTab = false) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
      if (isEbookTab) {
        if (name === 'image') setEbookImageFileName(files[0].name);
        if (name === 'pdf') setEbookPdfFileName(files[0].name);
      } else {
        if (name === 'image') setPhysicalImageFileName(files[0].name);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const resetPhysicalFormData = () => {
    setPhysicalFormData({ title: '', author: '', isbn: '', publisher: '', year: '', copies: 1, category: '', image: null });
    setPhysicalImageFileName('');
  };

  const resetEbookFormData = () => {
    setEbookFormData({ title: '', author: '', isbn: '', publisher: '', year: '', category: '', image: null, pdf: null });
    setEbookImageFileName('');
    setEbookPdfFileName('');
  };

  // --- NEW: Cloudinary Upload Function ---
  const uploadFileToCloudinary = async (file, resourceType = 'image') => {
    if (!file) return null;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Cloudinary upload failed: ${errorData.error.message}`);
      }
      const data = await response.json();
      return data.secure_url; // This is the public URL of the uploaded file
    } catch (uploadError) {
      console.error("Error uploading to Cloudinary:", uploadError);
      setError(`File upload failed: ${uploadError.message}`);
      return null;
    }
  };


  const addBook = async (formData, endpoint, setBooks, resetData, requiredFields) => {
    setError('');
    setSuccessMessage('');

    for (const field of requiredFields) {
      if (formData[field] === null || formData[field] === '' || (typeof formData[field] === 'number' && isNaN(formData[field]))) {
        setError(`Please fill all required fields: ${field}`);
        return;
      }
    }

    try {
      let imageUrl = null;
      let pdfUrl = null;

      // Upload image if present
      if (formData.image) {
        imageUrl = await uploadFileToCloudinary(formData.image, 'image');
        if (!imageUrl) { // If upload failed, stop
          return;
        }
      }

      // Upload PDF if present (only for ebooks)
      if (formData.pdf) {
        pdfUrl = await uploadFileToCloudinary(formData.pdf, 'raw'); // Use 'raw' for PDF files
        if (!pdfUrl) { // If upload failed, stop
          return;
        }
      }

      // Prepare payload to send to your backend (now with URLs)
      const payload = { ...formData };
      delete payload.image; // Remove file object
      delete payload.pdf;   // Remove file object

      if (imageUrl) payload.image = imageUrl;
      if (pdfUrl) payload.pdf = pdfUrl;

      // Convert year and copies to numbers if they are strings
      if (payload.year) payload.year = Number(payload.year);
      if (payload.copies) payload.copies = Number(payload.copies);


      console.log("Frontend - Payload sent to backend:", payload);

      // Send payload to your backend (now it's JSON, not FormData with files)
      const res = await api.post(`/${endpoint}`, payload); // Axios will default to application/json

      setBooks(prev => [...prev, res.data]);
      resetData();
      setSuccessMessage('Book added successfully!');
      fetchBooks(endpoint, setBooks);

    } catch (err) {
      console.error("Error adding book:", err.response?.data || err.message);
      let errorMessage = err.response?.data?.message || 'Failed to add book.';
      if (err.response?.data?.errors) {
        errorMessage += ' Details: ' + Object.values(err.response.data.errors).join(', ');
      } else if (err.response?.data?.error) {
        errorMessage += ' Details: ' + err.response.data.error;
      }
      setError(errorMessage);
    }
  };

  const deleteBook = async (isbn, endpoint, setBooks) => {
    setError('');
    setSuccessMessage('');
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      await api.delete(`/${endpoint}/${isbn}`);
      setBooks(prev => prev.filter(book => book.isbn !== isbn));
      setSuccessMessage('Book deleted successfully!');
    } catch (err) {
      console.error("Error deleting book:", err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to delete book.');
    }
  };

  const renderTableRows = (books, isEbook, onDelete) => {
    if (!books || books.length === 0) {
      return (
        <tr>
          <td colSpan="7" className="p-4 text-center text-gray-500">No books found.</td>
        </tr>
      );
    }
    return books.map(book => (
      <tr key={book.isbn} className="border-t">
        <td className="p-2">
          {book.image
            ? <img
                    src={book.image}
                    alt={book.title}
                    className="w-12 h-16 rounded object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/48x64/cccccc/ffffff?text=No+Img"; }}
                  />
                : 'No Image'}
            </td>
            <td className="p-2">{book.title}</td>
            <td className="p-2">{book.author}</td>
            <td className="p-2">{book.isbn}</td>
            <td className="p-2">{book.category}</td>
            {isEbook ? (
              <td className="p-2">
                {book.pdf
                  ? <a href={book.pdf} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View PDF</a>
                  : 'No PDF'}
              </td>
            ) : (
              <td className="p-2">{book.available ?? book.copies}/{book.copies}</td>
            )}
            <td className="p-2">
              <button onClick={() => onDelete(book.isbn)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">Delete</button>
            </td>
          </tr>
        ));
      };

      return (
        <div className="p-6 bg-white rounded shadow">
          <h2 className="text-2xl font-semibold mb-4">Manage Books</h2>

          <div className="flex space-x-2 mb-4">
            <button
              className={`px-4 py-2 rounded ${activeTab === 'physical' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('physical')}
            >
              Physical Books
            </button>
            <button
              className={`px-4 py-2 rounded ${activeTab === 'ebook' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('ebook')}
            >
              eBooks
            </button>
          </div>

          {loading && <p className="text-center text-gray-700 mb-4">Loading...</p>}
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}
          {successMessage && <p className="text-green-600 text-center mb-4">{successMessage}</p>}

          {activeTab === 'physical' ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {['title', 'author', 'isbn', 'publisher', 'year', 'copies'].map(field => (
                  <input
                    key={field}
                    name={field}
                    value={physicalFormData[field]}
                    onChange={e => handleChange(e, setPhysicalFormData)}
                    placeholder={`${field[0].toUpperCase() + field.slice(1)} *`}
                    className="border p-2 rounded"
                    type={field === 'copies' || field === 'year' ? 'number' : 'text'}
                    required={['title', 'author', 'isbn', 'copies'].includes(field)}
                  />
                ))}
                <select
                  name="category"
                  value={physicalFormData.category}
                  onChange={e => handleChange(e, setPhysicalFormData)}
                  className="border p-2 rounded"
                >
                  <option value="">Select a category</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Science">Science</option>
                  <option value="History">History</option>
                  <option value="Biography">Biography</option>
                  <option value="Fantasy">Fantasy</option>
                </select>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={e => handleChange(e, setPhysicalFormData)}
                  className="border p-2 rounded"
                />
              </div>

              {physicalFormData.image && (
                <img src={URL.createObjectURL(physicalFormData.image)} alt="Preview" className="w-24 h-32 object-cover rounded mb-4" />
              )}
              {physicalImageFileName && (
                <p className="text-sm text-gray-600 mb-2">Image Selected: {physicalImageFileName}</p>
              )}

              <button
                onClick={() => addBook(
                  physicalFormData,
                  'physical-books',
                  setPhysicalBooks,
                  resetPhysicalFormData,
                  ['title', 'author', 'isbn', 'year', 'copies']
                )}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Add Physical Book
              </button>

              <table className="w-full mt-6 border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Image</th>
                    <th className="p-2 text-left">Title</th>
                    <th className="p-2 text-left">Author</th>
                    <th className="p-2 text-left">ISBN</th>
                    <th className="p-2 text-left">Category</th>
                    <th className="p-2 text-left">Copies</th>
                    <th className="p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {renderTableRows(physicalBooks, false, isbn => deleteBook(isbn, 'physical-books', setPhysicalBooks))}
                </tbody>
              </table>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {['title', 'author', 'isbn', 'publisher', 'year'].map(field => (
                  <input
                    key={field}
                    name={field}
                    value={ebookFormData[field]}
                    onChange={e => handleChange(e, setEbookFormData, true)}
                    placeholder={`${field[0].toUpperCase() + field.slice(1)} *`}
                    className="border p-2 rounded"
                    type={field === 'year' ? 'number' : 'text'}
                    required={['title', 'author', 'isbn'].includes(field)}
                  />
                ))}
                <select
                  name="category"
                  value={ebookFormData.category}
                  onChange={e => handleChange(e, setEbookFormData, true)}
                  className="border p-2 rounded"
                >
                  <option value="">Select a category</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Science">Science</option>
                  <option value="History">History</option>
                  <option value="Biography">Biography</option>
                  <option value="Fantasy">Fantasy</option>
                </select>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={e => handleChange(e, setEbookFormData, true)}
                  className="border p-2 rounded"
                />
                <input
                  type="file"
                  name="pdf"
                  accept="application/pdf"
                  onChange={e => handleChange(e, setEbookFormData, true)}
                  className="border p-2 rounded"
                  required
                />
              </div>

              {ebookFormData.image && (
                <img src={URL.createObjectURL(ebookFormData.image)} alt="Preview" className="w-24 h-32 object-cover rounded mb-4" />
              )}
              {ebookImageFileName && (
                <p className="text-sm text-gray-600 mb-2">Image Selected: {ebookImageFileName}</p>
              )}
              {ebookPdfFileName && (
                <p className="text-sm text-gray-600 mb-2">PDF Selected: {ebookPdfFileName}</p>
              )}

              <button
                onClick={() => addBook(
                  ebookFormData,
                  'ebooks',
                  setEbooks,
                  resetEbookFormData,
                  ['title', 'author', 'isbn', 'pdf']
                )}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Add eBook
              </button>

              <table className="w-full mt-6 border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Image</th>
                    <th className="p-2 text-left">Title</th>
                    <th className="p-2 text-left">Author</th>
                    <th className="p-2 text-left">ISBN</th>
                    <th className="p-2 text-left">Category</th>
                    <th className="p-2 text-left">PDF</th>
                    <th className="p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {renderTableRows(ebooks, true, isbn => deleteBook(isbn, 'ebooks', setEbooks))}
                </tbody>
              </table>
            </>
          )}
        </div>
      );
    };

    export default ManageBooks;
    