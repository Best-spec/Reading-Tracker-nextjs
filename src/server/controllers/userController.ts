import { Response } from 'express';
import { AuthenticatedRequest } from '../types/user.js';
import { UserService } from '../services/userService.js';

const userService = new UserService();

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await userService.getProfile(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
        ...user,
        joinDate: user.createdAt
    });
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const updatedUser = await userService.updateProfile(req.user.id, req.body);

    res.json({
        ...updatedUser,
        joinDate: updatedUser.createdAt
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
