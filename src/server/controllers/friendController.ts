import { Request, Response } from 'express';
import { FriendService } from '../services/friendService.js';
import { AuthenticatedRequest } from '../types/user.js';

const friendService = new FriendService();

export const sendFriendRequest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { followingId } = req.body;
    const followerId = req.user?.id;

    if (!followerId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!followingId) {
      return res.status(400).json({ message: 'Following ID is required' });
    }

    const result = await friendService.sendFriendRequest(followerId, followingId);
    res.status(201).json({
      message: 'Friend request sent successfully',
      data: result
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const acceptFriendRequest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const followingId = req.user?.id;

    if (!followingId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: 'Follower ID is required' });
    }

    const result = await friendService.acceptFriendRequest(id, followingId);
    res.json({
      message: 'Friend request accepted successfully',
      data: result
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const rejectFriendRequest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const followingId = req.user?.id;

    if (!followingId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: 'Follower ID is required' });
    }

    await friendService.rejectFriendRequest(id, followingId);
    res.json({ message: 'Friend request rejected successfully' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const removeFriend = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: 'Friend ID is required' });
    }

    const result = await friendService.removeFriend(userId, id);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getFriends = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const friends = await friendService.getFriends(userId);
    res.json({
      message: 'Friends retrieved successfully',
      data: friends
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getOnlineFriends = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const onlineFriends = await friendService.getOnlineFriends(userId);
    res.json({
      message: 'Online friends retrieved successfully',
      data: onlineFriends
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getFriendReadingStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: 'Friend ID is required' });
    }

    const stats = await friendService.getFriendReadingStats(id);
    res.json({
      message: 'Friend reading stats retrieved successfully',
      data: stats
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPendingRequests = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const pendingRequests = await friendService.getPendingRequests(userId);
    res.json({
      message: 'Pending requests retrieved successfully',
      data: pendingRequests
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const checkFriendStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const status = await friendService.checkFriendStatus(userId, id);
    res.json({
      message: 'Friend status retrieved successfully',
      data: status
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const searchUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { q } = req.query;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const users = await friendService.searchUsers(q, userId);
    res.json({
      message: 'Users searched successfully',
      data: users
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSentRequests = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const sentRequests = await friendService.getSentRequests(userId);
    res.json({
      message: 'Sent requests retrieved successfully',
      data: sentRequests
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelFriendRequest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const requesterId = req.user?.id;

    if (!requesterId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: 'Target user ID is required' });
    }

    await friendService.cancelFriendRequest(requesterId, id);
    res.json({ message: 'Friend request cancelled successfully' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
