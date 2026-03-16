export interface UserStatus {
  userId: string;
  username: string;
  isOnline: boolean;
  lastSeen: Date;
  socketIds: string[];
}

export interface OnlineStatusEvent {
  type: 'user_connected' | 'user_disconnected' | 'status_updated';
  userId: string;
  username: string;
  isOnline: boolean;
  timestamp: Date;
}

export interface FriendStatus {
  userId: string;
  username: string;
  isOnline: boolean;
  lastSeen: Date;
}
