import express from 'express';
import { 
  sendFriendRequest, 
  acceptFriendRequest, 
  rejectFriendRequest, 
  removeFriend, 
  getFriends, 
  getOnlineFriends, 
  getFriendReadingStats, 
  getPendingRequests, 
  checkFriendStatus,
  searchUsers,
  getSentRequests,
  cancelFriendRequest
} from '../controllers/friendController.js';
import { middleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/request', middleware, sendFriendRequest);
router.put('/accept/:id', middleware, acceptFriendRequest);
router.put('/reject/:id', middleware, rejectFriendRequest);
router.delete('/:id', middleware, removeFriend);
router.get('/', middleware, getFriends);
router.get('/pending', middleware, getPendingRequests);
router.get('/sent', middleware, getSentRequests);
router.delete('/cancel/:id', middleware, cancelFriendRequest);
router.get('/search', middleware, searchUsers);
router.get('/online', middleware, getOnlineFriends);
router.get('/:id/stats', middleware, getFriendReadingStats);
router.get('/status/:id', middleware, checkFriendStatus);

export default router;
