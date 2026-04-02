import { Response } from 'express';
import { AuthenticatedRequest } from '../types/user.js';

export const getAchievements = async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        res.json([
          {
            id: '1',
            title: 'First Book',
            description: 'Completed your first book',
            icon: '📚',
            earnedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            category: 'Milestone'
          },
          {
            id: '2',
            title: 'Week Warrior',
            description: 'Read for 7 consecutive days',
            icon: '🔥',
            earnedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            category: 'Streak'
          }
        ]);
    } catch (error) {
        console.error('Error fetching achievements:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
