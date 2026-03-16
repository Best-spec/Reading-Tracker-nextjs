import express from 'express';
import { ReadingSessionController } from '../controllers/readingSessionController.js';
import { middleware } from '../middleware/authMiddleware.js';

const router = express.Router();
const readingSessionController = new ReadingSessionController();

// ใช้ middleware สำหรับทุก route
router.use(middleware);

// POST /api/reading/start - เริ่มจับเวลาการอ่าน
router.post('/start', readingSessionController.startReading);

// POST /api/reading/stop - หยุดจับเวลาการอ่าน
router.post('/stop', readingSessionController.stopReading);

// GET /api/reading/history - ดูประวัติการอ่าน
router.get('/history', readingSessionController.getReadingHistory);

// GET /api/reading/active - ดู session ที่กำลังทำงานอยู่
router.get('/active', readingSessionController.getActiveSession);

export default router;
