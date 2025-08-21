import express from 'express';
import { getBooks, updateBook, getLibraryStatus, getIssuedList } from '../controllers/bookController.js';
const router = express.Router();


import { addBook } from '../controllers/bookController.js';

router.get('/', getBooks);
router.post('/', addBook);
router.put('/:id', updateBook);
router.get('/status', getLibraryStatus);
router.get('/issued', getIssuedList);

export default router;
