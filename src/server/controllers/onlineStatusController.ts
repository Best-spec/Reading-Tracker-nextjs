import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/user.js';
import { OnlineStatusService } from '../services/onlineStatusService.js';

export class OnlineStatusController {
  private onlineStatusService: OnlineStatusService;

  constructor(onlineStatusService: OnlineStatusService) {
    this.onlineStatusService = onlineStatusService;
  }

  public getUserStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
      
      if (!userId) {
        res.status(400).json({ error: 'User ID is required' });
        return;
      }

      const userStatus = this.onlineStatusService.getUserStatus(userId);
      
      if (!userStatus) {
        res.status(404).json({ error: 'User status not found' });
        return;
      }

      res.json({
        userId: userStatus.userId,
        username: userStatus.username,
        isOnline: userStatus.isOnline,
        lastSeen: userStatus.lastSeen
      });
    } catch (error) {
      console.error('Error getting user status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  public getFriendsStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { friendIds } = req.body;
      
      if (!friendIds || !Array.isArray(friendIds)) {
        res.status(400).json({ error: 'Friend IDs array is required' });
        return;
      }

      const friendsStatus = this.onlineStatusService.getFriendsStatus(friendIds);
      
      res.json({
        friends: friendsStatus,
        total: friendsStatus.length,
        online: friendsStatus.filter(friend => friend.isOnline).length
      });
    } catch (error) {
      console.error('Error getting friends status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  public getAllOnlineUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const onlineUsers = this.onlineStatusService.getAllOnlineUsers();
      
      res.json({
        users: onlineUsers.map(user => ({
          userId: user.userId,
          username: user.username,
          isOnline: user.isOnline,
          lastSeen: user.lastSeen
        })),
        total: onlineUsers.length
      });
    } catch (error) {
      console.error('Error getting online users:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  public forceUserOffline = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
      
      if (!userId) {
        res.status(400).json({ error: 'User ID is required' });
        return;
      }

      this.onlineStatusService.forceUserOffline(userId);
      
      res.json({ message: `User ${userId} forced offline successfully` });
    } catch (error) {
      console.error('Error forcing user offline:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
