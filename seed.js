import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from './models/Book.js';

dotenv.config();



mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    await Book.deleteMany({});
    console.log('Books collection cleared. No books inserted by default.');
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
