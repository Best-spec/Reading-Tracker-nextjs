import { Router } from 'express';
import { middleware } from '../middleware/authMiddleware.js';
import { OnlineStatusController } from '../controllers/onlineStatusController.js';
import { OnlineStatusService } from '../services/onlineStatusService.js';

const router = Router();

let onlineStatusService: OnlineStatusService;
let onlineStatusController: OnlineStatusController;

export const initializeOnlineStatusRoutes = (service: OnlineStatusService) => {
  onlineStatusService = service;
  onlineStatusController = new OnlineStatusController(onlineStatusService);
  
  router.get('/status/:userId', middleware, (req, res) => onlineStatusController.getUserStatus(req, res));
  router.post('/friends/status', middleware, (req, res) => onlineStatusController.getFriendsStatus(req, res));
  router.get('/online-users', middleware, (req, res) => onlineStatusController.getAllOnlineUsers(req, res));
  router.post('/force-offline/:userId', middleware, (req, res) => onlineStatusController.forceUserOffline(req, res));
};

export default router;
