import express from 'express';
import { getAchievements } from '../controllers/achievementController.js';
import { middleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(middleware);

router.get('/', getAchievements);

export default router;
