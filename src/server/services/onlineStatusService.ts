import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { UserStatus, OnlineStatusEvent, FriendStatus } from '../types/onlineStatus.js';

export class OnlineStatusService {
  private io: SocketIOServer;
  private userStatuses: Map<string, UserStatus> = new Map();
  private socketToUser: Map<string, string> = new Map();

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: "http://127.0.0.1:5500",
        methods: ["GET", "POST"],
        credentials: true
      }
    });
    this.setupSocketHandlers();
  }

  private setupSocketHandlers(): void {
    this.io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);

      socket.on('authenticate', (data: { userId: string; username: string }) => {
        this.handleUserAuthentication(socket, data.userId, data.username);
      });

      socket.on('disconnect', () => {
        this.handleUserDisconnection(socket);
      });

      socket.on('get_friends_status', (friendIds: string[]) => {
        this.handleGetFriendsStatus(socket, friendIds);
      });
    });
  }

  private handleUserAuthentication(socket: any, userId: string, username: string): void {
    this.socketToUser.set(socket.id, userId);

    const existingStatus = this.userStatuses.get(userId);
    
    if (existingStatus) {
      existingStatus.socketIds.push(socket.id);
      existingStatus.isOnline = true;
      existingStatus.lastSeen = new Date();
    } else {
      this.userStatuses.set(userId, {
        userId,
        username,
        isOnline: true,
        lastSeen: new Date(),
        socketIds: [socket.id]
      });
    }

    socket.emit('authentication_success', { userId, username });
    
    this.broadcastStatusUpdate(userId, username, true);
    
    console.log(`User ${username} (${userId}) authenticated with socket ${socket.id}`);
  }

  private handleUserDisconnection(socket: any): void {
    const userId = this.socketToUser.get(socket.id);
    
    if (!userId) {
      console.log(`Unknown socket disconnected: ${socket.id}`);
      return;
    }

    const userStatus = this.userStatuses.get(userId);
    if (userStatus) {
      userStatus.socketIds = userStatus.socketIds.filter(id => id !== socket.id);
      
      if (userStatus.socketIds.length === 0) {
        userStatus.isOnline = false;
        userStatus.lastSeen = new Date();
        
        this.broadcastStatusUpdate(userId, userStatus.username, false);
      }
    }

    this.socketToUser.delete(socket.id);
    console.log(`User ${userId} disconnected from socket ${socket.id}`);
  }

  private handleGetFriendsStatus(socket: any, friendIds: string[]): void {
    const friendsStatus: FriendStatus[] = friendIds.map(friendId => {
      const status = this.userStatuses.get(friendId);
      return {
        userId: friendId,
        username: status?.username || 'Unknown',
        isOnline: status?.isOnline || false,
        lastSeen: status?.lastSeen || new Date()
      };
    });

    socket.emit('friends_status', friendsStatus);
  }

  private broadcastStatusUpdate(userId: string, username: string, isOnline: boolean): void {
    const event: OnlineStatusEvent = {
      type: isOnline ? 'user_connected' : 'user_disconnected',
      userId,
      username,
      isOnline,
      timestamp: new Date()
    };

    this.io.emit('user_status_update', event);
  }

  public getUserStatus(userId: string): UserStatus | undefined {
    return this.userStatuses.get(userId);
  }

  public getAllOnlineUsers(): UserStatus[] {
    return Array.from(this.userStatuses.values()).filter(user => user.isOnline);
  }

  public getFriendsStatus(friendIds: string[]): FriendStatus[] {
    return friendIds.map(friendId => {
      const status = this.userStatuses.get(friendId);
      return {
        userId: friendId,
        username: status?.username || 'Unknown',
        isOnline: status?.isOnline || false,
        lastSeen: status?.lastSeen || new Date()
      };
    });
  }

  public forceUserOffline(userId: string): void {
    const userStatus = this.userStatuses.get(userId);
    if (userStatus) {
      userStatus.socketIds.forEach(socketId => {
        const socket = this.io.sockets.sockets.get(socketId);
        if (socket) {
          socket.disconnect(true);
        }
      });
      
      userStatus.isOnline = false;
      userStatus.lastSeen = new Date();
      userStatus.socketIds = [];
      
      this.broadcastStatusUpdate(userId, userStatus.username, false);
    }
  }
}
