# API Testing Guide for ReadFlow

## Quick Start

### 1. Start the Server
```bash
cd "c:\Coding\backend reading project"
npm run dev
```

Server will start at: `http://localhost:3000`

### 2. Run the Test Script
```bash
node test-api.mjs
```

---

## Manual Testing with cURL

### Auth APIs

#### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com", "password": "password123"}'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

---

### Book APIs (Need Auth Token)

#### Create Book
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title": "Atomic Habits", "author": "James Clear", "totalPages": 320}'
```

#### Get All Books
```bash
curl -X GET http://localhost:3000/api/books \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Get Book by ID
```bash
curl -X GET http://localhost:3000/api/books/BOOK_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Update Book
```bash
curl -X PUT http://localhost:3000/api/books/BOOK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title": "Updated Title", "currentPage": 50}'
```

#### Delete Book
```bash
curl -X DELETE http://localhost:3000/api/books/BOOK_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Dashboard APIs

#### Get Dashboard Summary
```bash
curl -X GET http://localhost:3000/api/dashboard/summary \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Get Reading Trend
```bash
curl -X GET http://localhost:3000/api/dashboard/trend \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Get Top Books
```bash
curl -X GET http://localhost:3000/api/dashboard/top-books \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Friend APIs

#### Get Friends List
```bash
curl -X GET http://localhost:3000/api/friends \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Send Friend Request
```bash
curl -X POST http://localhost:3000/api/friends/request \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"followingId": "USER_ID_TO_FOLLOW"}'
```

#### Accept Friend Request
```bash
curl -X POST http://localhost:3000/api/friends/accept \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"followerId": "USER_ID"}'
```

---

### Group APIs

#### Create Group
```bash
curl -X POST http://localhost:3000/api/groups \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name": "Book Club", "description": "Reading together"}'
```

#### Get User Groups
```bash
curl -X GET http://localhost:3000/api/groups \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Get Group by ID
```bash
curl -X GET http://localhost:3000/api/groups/GROUP_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Invite Member
```bash
curl -X POST http://localhost:3000/api/groups/GROUP_ID/invite \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"userId": "USER_ID_TO_INVITE"}'
```

#### Leave Group
```bash
curl -X POST http://localhost:3000/api/groups/GROUP_ID/leave \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Reading Session APIs

#### Start Session
```bash
curl -X POST http://localhost:3000/api/reading-sessions/start \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"bookId": "BOOK_ID"}'
```

#### Stop Session
```bash
curl -X POST http://localhost:3000/api/reading-sessions/stop \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"bookId": "BOOK_ID"}'
```

#### Get Active Session
```bash
curl -X GET http://localhost:3000/api/reading-sessions/active \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Get Reading History
```bash
curl -X GET http://localhost:3000/api/reading-sessions/history \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Database Verification

After testing, you can verify data in database:

```bash
# Enter database (if using PostgreSQL locally)
psql -U postgres -d readflow

# Check tables
\dt

# View users
SELECT * FROM "User";

# View books
SELECT * FROM "Book";

# View groups
SELECT * FROM "Group";
```

Or use Prisma Studio:
```bash
npx prisma studio
```

---

## Troubleshooting

### Server not starting
- Check if port 3000 is in use
- Verify `.env` file has DATABASE_URL
- Run `npm install` if dependencies missing

### Database connection error
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Run `npx prisma migrate dev` to sync schema

### Auth errors
- Ensure token is provided in Authorization header
- Token format: `Bearer YOUR_TOKEN`
- Token is returned from login response

---

## Expected Test Results

| API | Method | Expected Status |
|-----|--------|-----------------|
| Register | POST | 201 |
| Login | POST | 200 |
| Create Book | POST | 201 |
| Get Books | GET | 200 |
| Get Dashboard | GET | 200 |
| Get Friends | GET | 200 |
| Create Group | POST | 201 |
| Start Session | POST | 201 |
