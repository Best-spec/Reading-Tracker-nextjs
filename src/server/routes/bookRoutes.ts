import express from 'express';
import { BookController } from '../controllers/bookController.js';
import { middleware } from '../middleware/authMiddleware.js';

const router = express.Router();
const bookController = new BookController();

// Apply authentication middleware to all book routes
router.use(middleware);

// Book CRUD routes
router.post('/', bookController.createBook.bind(bookController));
router.get('/', bookController.getUserBooks.bind(bookController));
router.get('/:bookId', bookController.getBookById.bind(bookController));
router.put('/:bookId', bookController.updateBook.bind(bookController));
router.delete('/:bookId', bookController.deleteBook.bind(bookController));

// Reading progress routes
router.post('/:bookId/progress', bookController.updateReadingProgress.bind(bookController));
router.get('/:bookId/progress', bookController.getReadingProgress.bind(bookController));
router.get('/progress', bookController.getAllReadingProgress.bind(bookController));

// Book sections routes
router.post('/:bookId/sections', bookController.addBookSection.bind(bookController));
router.put('/:bookId/sections/:sectionId', bookController.updateBookSection.bind(bookController));
router.delete('/:bookId/sections/:sectionId', bookController.deleteBookSection.bind(bookController));

export default router;
