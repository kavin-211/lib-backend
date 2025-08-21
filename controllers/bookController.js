export const addBook = async (req, res) => {
  try {
    const { title, domain, category, price, author, bookIds } = req.body;
    const newBook = new Book({
      title,
      domain,
      category,
      price,
      author,
      bookIds,
      isIssued: false
    });
    const inserted = await newBook.save();
    res.status(201).json(inserted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
import Book from '../models/Book.js';

export const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, domain, category, price, author, bookIds, adminPass } = req.body;
  if (adminPass !== '950024') return res.status(403).json({ message: 'Invalid admin password' });
  try {
    const book = await Book.findByIdAndUpdate(id, { title, domain, category, price, author, bookIds }, { new: true });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

import User from '../models/User.js';

// Helper to flatten books by bookIds
function flattenBooks(books, issuedMap = {}) {
  const flat = [];
  for (const book of books) {
    for (const bookId of book.bookIds) {
      flat.push({
        _id: book._id,
        bookId,
        title: book.title,
        domain: book.domain,
        category: book.category,
        price: book.price,
        author: book.author,
        isIssued: issuedMap[bookId] ? true : false,
        issuedTo: issuedMap[bookId] || null
      });
    }
  }
  return flat;
}

export const getLibraryStatus = async (req, res) => {
  try {
    const books = await Book.find();
    // Build a map of issued bookIds from users
    const users = await User.find();
    const issuedMap = {};
    users.forEach(user => {
      user.borrowedBooks.forEach(b => {
        issuedMap[b.bookId] = user.userId;
      });
    });
    const flatBooks = flattenBooks(books, issuedMap);
    res.json(flatBooks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getIssuedList = async (req, res) => {
  try {
    const books = await Book.find();
    // Build a map of issued bookIds from users
    const users = await User.find();
    const issuedMap = {};
    users.forEach(user => {
      user.borrowedBooks.forEach(b => {
        issuedMap[b.bookId] = user.userId;
      });
    });
    const flatBooks = flattenBooks(books, issuedMap).filter(b => b.isIssued);
    res.json(flatBooks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
