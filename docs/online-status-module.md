# Online Status Module

## ภาพรวม

Module นี้จัดการสถานะออนไลน์แบบ real-time สำหรับผู้ใช้ในระบบ โดยใช้ Socket.io สำหรับการสื่อสารแบบ real-time และเก็บข้อมูลสถานะใน memory

## โครงสร้างไฟล์

```
src/server/
├── types/
│   └── onlineStatus.ts          # Type definitions
├── services/
│   └── onlineStatusService.ts   # Business logic และ Socket.io handling
├── controllers/
│   └── onlineStatusController.ts # HTTP request handlers
├── routes/
│   └── onlineStatus.ts          # Route definitions
└── index.ts                     # Main server integration
```

## Features

### ✅ ฟังก์ชันหลัก
- **อัปเดตสถานะ online** เมื่อ user connect
- **อัปเดตสถานะ offline** เมื่อ disconnect  
- **Broadcast ให้เพื่อนเห็น** การเปลี่ยนแปลงสถานะ
- **รองรับหลาย session** ต่อคน

### ✅ Technical Implementation
- **Socket.io** สำหรับ real-time communication
- **Memory storage** สำหรับเก็บสถานะ (สามารถเปลี่ยนเป็น Redis ได้)
- **TypeScript** พร้อม type safety
- **Separated concerns** ตาม MVC pattern

## API Endpoints

### HTTP Routes
```
GET    /api/online-status/status/:userId          - ดูสถานะของ user ที่ระบุ
POST   /api/online-status/friends/status          - ดูสถานะของเพื่อนทั้งหมด
GET    /api/online-status/online-users            - ดูรายชื่อ user ที่ online อยู่
POST   /api/online-status/force-offline/:userId   - บังคับให้ user offline (admin)
```

### Socket.io Events
```javascript
// Client emit
socket.emit('authenticate', { userId, username });
socket.emit('get_friends_status', [friendIds]);

// Server emit  
socket.on('authentication_success', { userId, username });
socket.on('friends_status', [friends]);
socket.on('user_status_update', { type, userId, username, isOnline, timestamp });
```

## การติดตั้ง

1. **ติดตั้ง dependencies**
```bash
pnpm add socket.io @types/socket.io
```

2. **รัน server**
```bash
pnpm dev
```

## การใช้งาน Client-side

```javascript
// เชื่อมต่อ Socket.io
const socket = io('http://localhost:3000');

// Authenticate
socket.emit('authenticate', {
  userId: 'user123',
  username: 'john_doe'
});

// รับการอัปเดตสถานะเพื่อน
socket.on('user_status_update', (event) => {
  console.log(`${event.username} is now ${event.isOnline ? 'online' : 'offline'}`);
});

// ขอสถานะเพื่อน
socket.emit('get_friends_status', ['friend1', 'friend2']);
socket.on('friends_status', (friends) => {
  friends.forEach(friend => {
    console.log(`${friend.username}: ${friend.isOnline ? 'online' : 'offline'}`);
  });
});
```

## Data Structures

### UserStatus
```typescript
interface UserStatus {
  userId: string;
  username: string;
  isOnline: boolean;
  lastSeen: Date;
  socketIds: string[];  // รองรับหลาย session
}
```

### OnlineStatusEvent
```typescript
interface OnlineStatusEvent {
  type: 'user_connected' | 'user_disconnected' | 'status_updated';
  userId: string;
  username: string;
  isOnline: boolean;
  timestamp: Date;
}
```

## การขยายระบบ

### เปลี่ยนเป็น Redis
แทนที่จะใช้ Map ใน memory สามารถเปลี่ยนเป็น Redis ได้:

```typescript
// ใน onlineStatusService.ts
import Redis from 'ioredis';

export class OnlineStatusService {
  private redis: Redis;
  
  constructor(server: HTTPServer) {
    this.redis = new Redis(process.env.REDIS_URL);
    // ... rest of implementation
  }
}
```

### เพิ่มฟีเจอร์
- **Typing indicators** - แสดงสถานะกำลังพิมพ์
- **Custom status** - สถานะที่กำหนดเอง (Busy, Away, etc.)
- **Presence groups** - จัดกลุ่มตามห้องหรือโปรเจกต์
