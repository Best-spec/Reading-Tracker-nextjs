import { Response } from 'express';
import { AuthenticatedRequest } from '../types/user.js';
import { StatsService } from '../services/statsService.js';

const statsService = new StatsService();

export const getStats = async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const stats = await statsService.getStats(req.user.id);
        res.json(stats);
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
