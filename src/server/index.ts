import express from 'express';
import { createServer } from 'http';
import { Request, Response } from 'express';
import 'dotenv/config';
import allroutes from './routes/core.js';
import cookieParser from 'cookie-parser';
import { middleware } from './middleware/authMiddleware.js';
import { AuthenticatedRequest } from './types/user.js';
import cors from 'cors';
import { OnlineStatusService } from './services/onlineStatusService.js';
import onlineStatusRoutes, { initializeOnlineStatusRoutes } from './routes/onlineStatus.js';

const app = express();
const server = createServer(app);
const PORT = process.env.PORT;

const onlineStatusService = new OnlineStatusService(server);

initializeOnlineStatusRoutes(onlineStatusService);

app.use(cors({
    origin: ['http://127.0.0.1:3000', 'https://social-reading-tracker-2me1z2t9d-best-specs-projects.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json());
app.use(cookieParser());

app.use('/api', allroutes);
app.get('/', middleware, (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    res.json({ message: `ยินดีต้อนรับ ${req.user.username}` });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

