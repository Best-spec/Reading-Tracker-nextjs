import express from 'express';
import authRoutes from './authroutes.js';
import bookRoutes from './bookRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import friendRoutes from './friendRoutes.js';
import groupRoutes from './groupRoutes.js';
import readingRoutes from './readingRoutes.js';
import onlineStatusRoutes from './onlineStatus.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/friends', friendRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/books', bookRoutes);
router.use('/groups', groupRoutes);
router.use('/reading-sessions', readingRoutes);
router.use('/online-status', onlineStatusRoutes);

export default router;