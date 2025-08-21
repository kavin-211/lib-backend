import mongoose from 'mongoose';


const bookSchema = new mongoose.Schema({
  title: String, // Book Title
  domain: String,
  category: String,
  price: String,
  author: String,
  bookIds: [String], // e.g., ["1A", "1B", ...]
  isIssued: { type: Boolean, default: false },
  issuedTo: { type: String, default: null }
});

export default mongoose.model('Book', bookSchema);
