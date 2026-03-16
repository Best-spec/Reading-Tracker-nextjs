import { Request, Response } from 'express';
import { ReadingSessionService } from '../services/readingSessionService.js';
import { AuthenticatedRequest } from '../types/user.js';

const readingSessionService = new ReadingSessionService();

export class ReadingSessionController {
  async startReading(req: AuthenticatedRequest, res: Response) {
    try {
      const { bookId, section } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      if (!bookId) {
        return res.status(400).json({ message: 'Book ID is required' });
      }

      const session = await readingSessionService.startReadingSession(userId, bookId, section);
      
      res.status(201).json({
        message: 'Reading session started',
        data: session
      });
    } catch (error) {
      console.error('Error starting reading session:', error);
      res.status(500).json({ 
        message: 'Failed to start reading session',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async stopReading(req: AuthenticatedRequest, res: Response) {
    try {
      const { sessionId, pagesRead } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      if (!sessionId) {
        return res.status(400).json({ message: 'Session ID is required' });
      }

      const session = await readingSessionService.stopReadingSession(sessionId, pagesRead);
      
      res.status(200).json({
        message: 'Reading session stopped',
        data: session
      });
    } catch (error) {
      console.error('Error stopping reading session:', error);
      res.status(500).json({ 
        message: 'Failed to stop reading session',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getReadingHistory(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const history = await readingSessionService.getReadingHistory(userId);
      
      res.status(200).json({
        message: 'Reading history retrieved',
        data: history
      });
    } catch (error) {
      console.error('Error getting reading history:', error);
      res.status(500).json({ 
        message: 'Failed to get reading history',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getActiveSession(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const activeSession = await readingSessionService.getActiveSession(userId);
      
      res.status(200).json({
        message: 'Active session retrieved',
        data: activeSession
      });
    } catch (error) {
      console.error('Error getting active session:', error);
      res.status(500).json({ 
        message: 'Failed to get active session',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
