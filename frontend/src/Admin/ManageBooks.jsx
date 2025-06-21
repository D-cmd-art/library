import React, { useState } from 'react';

const ManageBooks = () => {
  const [activeTab, setActiveTab] = useState('physical'); // 'physical' or 'ebook'

  const [physicalFormData, setPhysicalFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    year: '',
    copies: 1,
    category: '',
    image: null,
  });

  const [ebookFormData, setEbookFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    year: '',
    category: '',
    image: null,
    pdf: null,
  });

  const [physicalBooks, setPhysicalBooks] = useState([
    {
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      isbn: '978-0446310789',
      category: 'Fiction',
      copies: 5,
      available: 3,
      image: null,
    },
    {
      title: '1984',
      author: 'George Orwell',
      isbn: '978-0451524935',
      category: 'Fiction',
      copies: 3,
      available: 2,
      image: null,
    },
  ]);

  const [ebooks, setEbooks] = useState([
    // Example eBook:
    // {
    //   title: 'Sample eBook',
    //   author: 'Author Name',
    //   isbn: '123456789',
    //   category: 'Science',
    //   image: null,
    //   pdf: null,
    // }
  ]);

  // Handle input change for physical book form
  const handlePhysicalChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setPhysicalFormData({ ...physicalFormData, image: files[0] });
    } else {
      setPhysicalFormData({ ...physicalFormData, [name]: value });
    }
  };

  // Handle input change for ebook form
  const handleEbookChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' || name === 'pdf') {
      setEbookFormData({ ...ebookFormData, [name]: files[0] });
    } else {
      setEbookFormData({ ...ebookFormData, [name]: value });
    }
  };
const handleEbookpdf = (e) => {
    const { name, value, files } = e.target;
    if (name === 'pdf') {
      setEbookFormData({ ...ebookFormData, [name]: files[0] });
    } else {
      setEbookFormData({ ...ebookFormData, [name]: value });
    }
  };
  // Add physical book
  const addPhysicalBook = () => {
    const { title, author, isbn } = physicalFormData;
    if (!title || !author || !isbn) {
      return alert('Please fill all required fields for physical book.');
    }

    const newBook = {
      ...physicalFormData,
      copies: Number(physicalFormData.copies),
      available: Number(physicalFormData.copies),
      image: physicalFormData.image ? URL.createObjectURL(physicalFormData.image) : null,
    };

    setPhysicalBooks([...physicalBooks, newBook]);

    setPhysicalFormData({
      title: '',
      author: '',
      isbn: '',
      publisher: '',
      year: '',
      copies: 1,
      category: '',
      image: null,
    });
  };

  // Add ebook
  const addEbook = () => {
    const { title, author, isbn, pdf } = ebookFormData;
    if (!title || !author || !isbn || !pdf) {
      return alert('Please fill all required fields for eBook including uploading a PDF.');
    }

    const newEbook = {
      ...ebookFormData,
      image: ebookFormData.image ? URL.createObjectURL(ebookFormData.image) : null,
      pdf: URL.createObjectURL(ebookFormData.pdf),
    };

    setEbooks([...ebooks, newEbook]);

    setEbookFormData({
      title: '',
      author: '',
      isbn: '',
      publisher: '',
      year: '',
      category: '',
      image: null,
      pdf: null,
    });
  };

  // Delete physical book by ISBN
  const deletePhysicalBook = (isbn) => {
    setPhysicalBooks(physicalBooks.filter((book) => book.isbn !== isbn));
  };

  // Delete ebook by ISBN
  const deleteEbook = (isbn) => {
    setEbooks(ebooks.filter((ebook) => ebook.isbn !== isbn));
  };

  return (
    <div className="p-6 bg-white rounded shadow w-full">
      <h2 className="text-2xl font-semibold mb-4">Manage Books</h2>

      {/* Toggle buttons */}
      <div className="flex space-x-2 mb-6">
        <button
          className={`px-4 py-2 rounded ${activeTab === 'physical' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
          onClick={() => setActiveTab('physical')}
        >
          Physical Books
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'ebook' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-black'}`}
          onClick={() => setActiveTab('ebook')}
        >
          eBooks
        </button>
      </div>

      {/* Physical Books Form */}
      
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input
              name="title"
              value={physicalFormData.title}
              onChange={handlePhysicalChange}
              placeholder="Title *"
              className="border p-2 rounded"
            />
            <input
              name="author"
              value={physicalFormData.author}
              onChange={handlePhysicalChange}
              placeholder="Author *"
              className="border p-2 rounded"
            />
            <input
              name="isbn"
              value={physicalFormData.isbn}
              onChange={handlePhysicalChange}
              placeholder="ISBN *"
              className="border p-2 rounded"
            />
            <input
              name="publisher"
              value={physicalFormData.publisher}
              onChange={handlePhysicalChange}
              placeholder="Publisher"
              className="border p-2 rounded"
            />
            <input
              name="year"
              value={physicalFormData.year}
              onChange={handlePhysicalChange}
              placeholder="Publication Year"
              className="border p-2 rounded"
            />
            <input
              name="copies"
              type="number"
              value={physicalFormData.copies}
              onChange={handlePhysicalChange}
              placeholder="Number of Copies"
              className="border p-2 rounded"
              min={1}
            />
            <select
              name="category"
              value={physicalFormData.category}
              onChange={handlePhysicalChange}
              className="border p-2 rounded"
            >
              <option value="">Select a category</option>
              <option value="Fiction">Fiction</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
            </select>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handlePhysicalChange}
              className="border p-2 rounded"
            />
            {physicalFormData.image && (
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Image Preview:</p>
                <img
                  src={URL.createObjectURL(physicalFormData.image)}
                  alt="Preview"
                  className="w-24 h-32 object-cover rounded mt-2 border"
                />
              </div>
            )}
          </div>

          <button
            onClick={addPhysicalBook}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Physical Book
          </button>

          {/* Physical Books List */}
          <div className="mt-10">
            <h3 className="text-xl font-semibold mb-4">Physical Books</h3>
            <input
              type="text"
              placeholder="Search books..."
              className="border p-2 rounded mb-4 w-full"
              // You can add search logic later here
            />
            <table className="w-full border divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-2">Image</th>
                  <th className="text-left p-2">Title</th>
                  <th className="text-left p-2">Author</th>
                  <th className="text-left p-2">ISBN</th>
                  <th className="text-left p-2">Category</th>
                  <th className="text-left p-2">Availability</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {physicalBooks.map((book) => (
                  <tr key={book.isbn} className="border-t">
                    <td className="p-2">
                      {book.image ? (
                        <img
                          src={book.image}
                          alt={book.title}
                          className="w-12 h-16 object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">No Image</span>
                      )}
                    </td>
                    <td className="p-2">{book.title}</td>
                    <td className="p-2">{book.author}</td>
                    <td className="p-2">{book.isbn}</td>
                    <td className="p-2">{book.category}</td>
                    <td className="p-2">
                      {book.available}/{book.copies}
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => deletePhysicalBook(book.isbn)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* eBooks Form */}
      {activeTab === 'ebook' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input
              name="title"
              value={ebookFormData.title}
              onChange={handleEbookChange}
              placeholder="Title *"
              className="border p-2 rounded"
            />
            <input
              name="author"
              value={ebookFormData.author}
              onChange={handleEbookChange}
              placeholder="Author *"
              className="border p-2 rounded"
            />
            <input
              name="isbn"
              value={ebookFormData.isbn}
              onChange={handleEbookChange}
              placeholder="ISBN *"
              className="border p-2 rounded"
            />
            <input
              name="publisher"
              value={ebookFormData.publisher}
              onChange={handleEbookChange}
              placeholder="Publisher"
              className="border p-2 rounded"
            />
            <input
              name="year"
              value={ebookFormData.year}
              onChange={handleEbookChange}
              placeholder="Publication Year"
              className="border p-2 rounded"
            />
            <select
              name="category"
              value={ebookFormData.category}
              onChange={handleEbookChange}
              className="border p-2 rounded"
            >
              <option value="">Select a category</option>
              <option value="Fiction">Fiction</option>
              <option value="Science">Science</option>
              <option value="History">Histor</option>
            </select>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleEbookChange}
              className="border p-2 rounded"
            />
            <input
              type="file"
              name="pdf"
              accept="application/pdf"
              onChange={handleEbookpdf}
              className="border p-2 rounded"
            />
            {ebookFormData.image && (
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Image Preview:</p>
                <img
                  src={URL.createObjectURL(ebookFormData.image)}
                  alt="Preview"
                  className="w-24 h-32 object-cover rounded mt-2 border"
                />
              </div>
            )}
            {ebookFormData.pdf && (
              <div className="col-span-2 mt-2">
                <p className="text-sm text-gray-600">PDF File Selected: {ebookFormData.pdf.name}</p>
              </div>
            )}
          </div>

          <button
            onClick={addEbook}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add eBook
          </button>

          {/* eBooks List */}
          <div className="mt-10">
            <h3 className="text-xl font-semibold mb-4">eBooks</h3>
            <input
              type="text"
              placeholder="Search eBooks..."
              className="border p-2 rounded mb-4 w-full"
              // You can add search logic later here
            />
            <table className="w-full border divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-2">Image</th>
                  <th className="text-left p-2">Title</th>
                  <th className="text-left p-2">Author</th>
                  <th className="text-left p-2">ISBN</th>
                  <th className="text-left p-2">Category</th>
                  <th className="text-left p-2">PDF</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ebooks.map((ebook) => (
                  <tr key={ebook.isbn} className="border-t">
                    <td className="p-2">
                      {ebook.image ? (
                        <img
                          src={ebook.image}
                          alt={ebook.title}
                          className="w-12 h-16 object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">No Image</span>
                      )}
                    </td>
                    <td className="p-2">{ebook.title}</td>
                    <td className="p-2">{ebook.author}</td>
                    <td className="p-2">{ebook.isbn}</td>
                    <td className="p-2">{ebook.category}</td>
                    <td className="p-2">
                      {ebook.pdf ? (
                        <a
                          href={ebook.pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          View PDF
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">No PDF</span>
                      )}
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => deleteEbook(ebook.isbn)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageBooks;
