import { Router } from 'express';
import {
  createGroup,
  getGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  inviteMember,
  leaveGroup,
  getGroupMembers,
  getGroupLeaderboard,
  getGroupTotalTime,
} from '../controllers/groupController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.post('/', createGroup);
router.get('/', getGroups);
router.get('/:id', getGroupById);
router.put('/:id', updateGroup);
router.delete('/:id', deleteGroup);

router.post('/:id/invite', inviteMember);
router.delete('/:id/leave', leaveGroup);

router.get('/:id/members', getGroupMembers);
router.get('/:id/leaderboard', getGroupLeaderboard);
router.get('/:id/total-time', getGroupTotalTime);

export default router;
