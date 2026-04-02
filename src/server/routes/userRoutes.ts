import express from 'express';
import { getProfile, updateProfile } from '../controllers/userController.js';
import { middleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(middleware);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router;
