import express from 'express';
import { getStats } from '../controllers/statsController.js';
import { middleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(middleware);

router.get('/', getStats);
router.get('/reading', getStats); // basic fallback for frontend /api/stats/reading

export default router;
