
import express from 'express';
import { loginUser, getUsers, addUser, issueBooks, getUserStatus, updateUser, deleteUser, removeBorrow } from '../controllers/userController.js';
const router = express.Router();

router.put('/remove-borrow/:userId', removeBorrow);

router.post('/login', loginUser);
router.get('/', getUsers);

router.post('/add', addUser);
router.post('/issue', issueBooks);
router.get('/status', getUserStatus);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
