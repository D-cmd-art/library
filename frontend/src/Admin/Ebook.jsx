import { useState } from "react";

const sampleEbooks = [
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    isbn: "978-0062316097",
    category: "Non-fiction",
    format: "PDF",
    size: "8.2 MB",
    image: ""
  },
  {
    title: "The Lean Startup",
    author: "Eric Ries",
    isbn: "978-0307887894",
    category: "Business",
    format: "EPUB",
    size: "4.5 MB",
    image: ""
  }
];

export default function EbookManager() {
  const [ebooks, setEbooks] = useState(sampleEbooks);
  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    publisher: "",
    year: "",
    format: "",
    size: "",
    category: "",
    sample: "",
    image: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleAdd = () => {
    const { title, author, isbn, format, size, category, image } = form;
    if (title && author && isbn) {
      const newBook = {
        title,
        author,
        isbn,
        format,
        size,
        category,
        image: image ? URL.createObjectURL(image) : ""
      };
      setEbooks([...ebooks, newBook]);
      setForm({
        title: "",
        author: "",
        isbn: "",
        publisher: "",
        year: "",
        format: "",
        size: "",
        category: "",
        sample: "",
        image: null
      });
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Library Management System</h1>
      <div className="flex gap-4">
        <Button variant="default">Physical Books</Button>
        <Button variant="outline">eBooks</Button>
      </div>

      <h2 className="text-xl font-semibold">Add New eBook</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          "title",
          "author",
          "isbn",
          "publisher",
          "year",
          "size",
          "sample"
        ].map((field) => (
          <input
            key={field}
            name={field}
            value={form[field]}
            onChange={handleChange}
            placeholder={field[0].toUpperCase() + field.slice(1).replace("_", " ")}
            className="border p-2 rounded"
          />
        ))}

        <select
          name="format"
          value={form.format}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Select Format</option>
          <option value="PDF">PDF</option>
          <option value="EPUB">EPUB</option>
        </select>

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Select Category</option>
          <option value="Non-fiction">Non-fiction</option>
          <option value="Business">Business</option>
          <option value="Fiction">Fiction</option>
        </select>

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="border p-2 rounded"
        />
      </div>
      <Button onClick={handleAdd}>Add eBook</Button>

      <h2 className="text-xl font-semibold">eBooks</h2>
      <input
        placeholder="Search books..."
        className="border p-2 w-full rounded mb-4"
      />
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Image</th>
            <th className="p-2">Title</th>
            <th className="p-2">Author</th>
            <th className="p-2">ISBN</th>
            <th className="p-2">Category</th>
            <th className="p-2">Availability</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {ebooks.map((book, idx) => (
            <tr key={idx} className="text-center border-t">
              <td className="p-2">
                {book.image ? (
                  <img src={book.image} alt="Cover" className="w-12 h-12 object-cover mx-auto" />
                ) : (
                  "N/A"
                )}
              </td>
              <td className="p-2">{book.title}</td>
              <td className="p-2">{book.author}</td>
              <td className="p-2">{book.isbn}</td>
              <td className="p-2">{book.category}</td>
              <td className="p-2">{book.format}, {book.size}</td>
              <td className="p-2 space-x-2">
                <Button variant="secondary">Preview</Button>
                <Button variant="destructive">Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
