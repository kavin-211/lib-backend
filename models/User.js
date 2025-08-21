import mongoose from 'mongoose';

const borrowedBookSchema = new mongoose.Schema({
  bookId: String,
  issueDate: Date,
  validTill: Date,
  fine: { type: Number, default: 0 }
});


const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  name: String,
  email: String,
  mobile: String,
  borrowCount: { type: Number, default: 0 },
  balance: { type: Number, default: 3 },
  borrowedBooks: [borrowedBookSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
