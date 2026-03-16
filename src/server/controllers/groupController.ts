import { Request, Response } from 'express';
import { GroupService } from '../services/groupService.js';

const groupService = new GroupService();

export const createGroup = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Group name is required' });
    }

    const group = await groupService.createGroup(userId, { name, description });
    res.status(201).json(group);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getGroups = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const groups = await groupService.getUserGroups(userId);
    res.json(groups);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getGroupById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    const group = await groupService.getGroupById(id, userId);
    res.json(group);
  } catch (error: any) {
    if (error.message === 'You are not a member of this group') {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

export const updateGroup = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const { name, description } = req.body;

    const group = await groupService.updateGroup(id, userId, { name, description });
    res.json(group);
  } catch (error: any) {
    if (error.message === 'Group not found or you are not the owner') {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

export const deleteGroup = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    await groupService.deleteGroup(id, userId);
    res.status(204).send();
  } catch (error: any) {
    if (error.message === 'Group not found or you are not the owner') {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

export const inviteMember = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const { userId: memberUserId } = req.body;

    if (!memberUserId) {
      return res.status(400).json({ error: 'Member user ID is required' });
    }

    const membership = await groupService.inviteMember(id, userId, memberUserId);
    res.status(201).json(membership);
  } catch (error: any) {
    if (error.message === 'Group not found or you are not the owner' || 
        error.message === 'User is already a member of this group') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

export const leaveGroup = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    await groupService.leaveGroup(id, userId);
    res.status(204).send();
  } catch (error: any) {
    if (error.message === 'You are not a member of this group' ||
        error.message === 'Group owner cannot leave. Transfer ownership or delete group first') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

export const getGroupMembers = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    const members = await groupService.getGroupMembers(id, userId);
    res.json(members);
  } catch (error: any) {
    if (error.message === 'You are not a member of this group') {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

export const getGroupLeaderboard = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    const leaderboard = await groupService.getGroupLeaderboard(id, userId);
    res.json(leaderboard);
  } catch (error: any) {
    if (error.message === 'You are not a member of this group') {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

export const getGroupTotalTime = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    const totalTime = await groupService.getGroupTotalTime(id, userId);
    res.json(totalTime);
  } catch (error: any) {
    if (error.message === 'You are not a member of this group') {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};
