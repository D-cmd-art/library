import PhysicalBook from "../model/PhysicalBook.js";

// Add New Physical Book
export const addPhysicalBook = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const { title, author, description, price, stock, category } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`;

    const newBook = new PhysicalBook({
      title,
      author,
      description,
      price: Number(price),
      stock: Number(stock),
      category,
      image: imageUrl,
    });

    await newBook.save();

    res.status(201).json({ message: "Physical Book added successfully!", book: newBook });
  } catch (error) {
    res.status(500).json({ message: "Error adding physical book", error: error.message });
  }
};

// Get All Physical Books
export const getAllPhysicalBooks = async (req, res) => {
  try {
    const books = await PhysicalBook.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching physical books", error });
  }
};

// Get Single Physical Book by ID
export const getSinglePhysicalBook = async (req, res) => {
  try {
    const book = await PhysicalBook.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Physical Book not found" });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Error fetching physical book", error });
  }
};

// Edit Physical Book
export const editPhysicalBook = async (req, res) => {
  try {
    const updatedBook = await PhysicalBook.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "Physical Book updated successfully!", book: updatedBook });
  } catch (error) {
    res.status(500).json({ message: "Error updating physical book", error });
  }
};

// Delete Physical Book
export const deletePhysicalBook = async (req, res) => {
  try {
    await PhysicalBook.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Physical Book deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting physical book", error });
  }
};
