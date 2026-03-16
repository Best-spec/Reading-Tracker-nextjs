import express from 'express';
import { DashboardController } from '../controllers/dashboardController.js';
import { middleware } from '../middleware/authMiddleware.js';

const router = express.Router();
const dashboardController = new DashboardController();

// ใช้ middleware สำหรับทุก route
router.use(middleware);

// GET /api/dashboard/summary - สรุปข้อมูลทั้งหมด
router.get('/summary', dashboardController.getDashboardSummary);

// GET /api/dashboard/trend - แนวโน้มการอ่าน 7 วันล่าสุด
router.get('/trend', dashboardController.getReadingTrend);

// GET /api/dashboard/top-books - หนังสือที่อ่านมากสุด
// Query parameter: ?limit=5 (default 5)
router.get('/top-books', dashboardController.getTopBooks);

// GET /api/dashboard/reading-time - เวลาอ่านรวม/รายสัปดาห์/รายเดือน
// Query parameter: ?period=weekly|monthly|total (default total)
router.get('/reading-time', dashboardController.getReadingTime);

export default router;
