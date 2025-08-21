export const removeBorrow = async (req, res) => {
  const { userId } = req.params;
  const { bookId } = req.body;
  try {
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.borrowedBooks = user.borrowedBooks.filter(b => b.bookId !== bookId);
    user.borrowCount = user.borrowedBooks.length;
    user.balance = 3 - user.borrowCount;
    await user.save();
    // Mark book as available
    await Book.findOneAndUpdate({ bookId }, { isIssued: false, issuedTo: null });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, mobile } = req.body;
  try {
    const user = await User.findOneAndUpdate({ userId: id }, { name, email, mobile }, { new: true });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await User.findOneAndDelete({ userId: id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

import User from '../models/User.js';
import Book from '../models/Book.js';
import { calculateFine } from '../utils/fineCalculator.js';
import { generateToken } from '../utils/auth.js';

export const loginUser = async (req, res) => {
  const { userId } = req.body;
  try {
    if (userId === '950024') {
      // Admin login
      const token = generateToken({ userId: '950024' });
      return res.json({ success: true, admin: true, token });
    }
    const user = await User.findOne({ userId });
    if (user) {
      // Update fines for overdue books
      let updated = false;
      user.borrowedBooks.forEach(b => {
        const fine = calculateFine(b.issueDate, b.validTill);
        if (b.fine !== fine) {
          b.fine = fine;
          updated = true;
        }
      });
      if (updated) await user.save();
      const token = generateToken(user);
      return res.json({ success: true, user, token });
    } else {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addUser = async (req, res) => {
  const { name, email, mobile } = req.body;
  const userId = Math.floor(100000 + Math.random() * 900000).toString();
  try {
    const newUser = new User({ userId, name, email, mobile, borrowCount: 0, balance: 3, borrowedBooks: [] });
    await newUser.save();
    res.json({ success: true, user: newUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const issueBooks = async (req, res) => {
  const { userId, books } = req.body;
  try {
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.borrowCount + books.length > 3) return res.status(400).json({ success: false, message: 'Borrow limit exceeded' });
    // Check for pending fine
    let hasFine = false;
    user.borrowedBooks.forEach(b => {
      if (b.fine && b.fine > 0) hasFine = true;
    });
    if (hasFine) return res.status(400).json({ success: false, message: 'Pending fine exists' });
    const now = new Date();
    const validTill = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    books.forEach(book => {
      user.borrowedBooks.push({ bookId: book.bookId, issueDate: now, validTill, fine: 0 });
    });
    user.borrowCount += books.length;
    user.balance = 3 - user.borrowCount;
    await user.save();
    // Mark books as issued
    for (const book of books) {
      await Book.findOneAndUpdate({ bookId: book.bookId }, { isIssued: true, issuedTo: userId });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUserStatus = async (req, res) => {
  try {
    const users = await User.find();
    // Update fines for all users
    for (const user of users) {
      let updated = false;
      user.borrowedBooks.forEach(b => {
        const fine = calculateFine(b.issueDate, b.validTill);
        if (b.fine !== fine) {
          b.fine = fine;
          updated = true;
        }
      });
      if (updated) await user.save();
    }
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
