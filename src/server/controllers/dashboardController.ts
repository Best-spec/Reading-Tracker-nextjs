import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboardService.js';
import { AuthenticatedRequest } from '../types/user.js';

const dashboardService = new DashboardService();

export class DashboardController {
  // GET /dashboard/summary - สรุปข้อมูลทั้งหมด
  async getDashboardSummary(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const summary = await dashboardService.getDashboardSummary(req.user.id);
      
      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      console.error('Error getting dashboard summary:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get dashboard summary',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET /dashboard/trend - แนวโน้มการอ่าน
  async getReadingTrend(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const trend = await dashboardService.getReadingTrend(req.user.id);
      
      res.json({
        success: true,
        data: trend
      });
    } catch (error) {
      console.error('Error getting reading trend:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get reading trend',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET /dashboard/top-books - หนังสือที่อ่านมากสุด
  async getTopBooks(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const limit = parseInt(req.query.limit as string) || 5;
      const topBooks = await dashboardService.getTopBooksByReadingTime(req.user.id, limit);
      
      res.json({
        success: true,
        data: topBooks
      });
    } catch (error) {
      console.error('Error getting top books:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get top books',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET /dashboard/reading-time - เวลาอ่านรวม/รายสัปดาห์/รายเดือน
  async getReadingTime(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { period } = req.query;
      
      let readingTime;
      switch (period) {
        case 'weekly':
          readingTime = await dashboardService.getWeeklyReadingTime(req.user.id);
          break;
        case 'monthly':
          readingTime = await dashboardService.getMonthlyReadingTime(req.user.id);
          break;
        case 'total':
        default:
          readingTime = await dashboardService.getTotalReadingTime(req.user.id);
          break;
      }
      
      res.json({
        success: true,
        data: {
          period: period || 'total',
          minutes: readingTime,
          hours: Math.round(readingTime / 60 * 100) / 100
        }
      });
    } catch (error) {
      console.error('Error getting reading time:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get reading time',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
