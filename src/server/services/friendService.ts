import { FriendStatus } from '@prisma/client';
import { prisma } from '../prisma.js';

export class FriendService {
  async sendFriendRequest(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new Error('Cannot send friend request to yourself');
    }

    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    });

    if (existingFollow) {
      throw new Error('Friend request already exists');
    }

    return await prisma.follows.create({
      data: {
        followerId,
        followingId,
        status: FriendStatus.PENDING
      },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            avatar: true,
            status: true
          }
        },
        following: {
          select: {
            id: true,
            username: true,
            avatar: true,
            status: true
          }
        }
      }
    });
  }

  async acceptFriendRequest(requesterId: string, currentUserId: string) {
    const followRequest = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: requesterId,
          followingId: currentUserId
        }
      }
    });

    if (!followRequest) {
      throw new Error('Friend request not found');
    }

    if (followRequest.status !== FriendStatus.PENDING) {
      throw new Error('Friend request is already ' + followRequest.status);
    }

    return await prisma.follows.update({
      where: {
        followerId_followingId: {
          followerId: requesterId,
          followingId: currentUserId
        }
      },
      data: {
        status: FriendStatus.ACCEPTED
      },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            avatar: true,
            status: true
          }
        },
        following: {
          select: {
            id: true,
            username: true,
            avatar: true,
            status: true
          }
        }
      }
    });
  }

  async rejectFriendRequest(requesterId: string, currentUserId: string) {
    const followRequest = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: requesterId,
          followingId: currentUserId
        }
      }
    });

    if (!followRequest) {
      throw new Error('Friend request not found');
    }

    return await prisma.follows.delete({
      where: {
        followerId_followingId: {
          followerId: requesterId,
          followingId: currentUserId
        }
      }
    });
  }

  async removeFriend(userId1: string, userId2: string) {
    // Check both directions
    const followRecord = await prisma.follows.findFirst({
      where: {
        OR: [
          { followerId: userId1, followingId: userId2 },
          { followerId: userId2, followingId: userId1 }
        ]
      }
    });

    if (!followRecord) {
      throw new Error('Friend relationship not found');
    }

    await prisma.follows.delete({
      where: {
        followerId_followingId: {
          followerId: followRecord.followerId,
          followingId: followRecord.followingId
        }
      }
    });

    return { message: 'Friend removed successfully' };
  }

  async getFriends(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const friends = await prisma.follows.findMany({
      where: {
        OR: [
          {
            followerId: userId,
            status: FriendStatus.ACCEPTED
          },
          {
            followingId: userId,
            status: FriendStatus.ACCEPTED
          }
        ]
      },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            avatar: true,
            status: true
          }
        },
        following: {
          select: {
            id: true,
            username: true,
            avatar: true,
            status: true
          }
        }
      },
      skip,
      take: limit
    });

    const uniqueFriends = Array.from(new Map(friends.map(friend => {
      const friendData = friend.followerId === userId ? friend.following : friend.follower;
      return [friendData.id, friendData];
    })).values());

    return uniqueFriends;
  }

  async getPendingRequests(userId: string) {
    const requests = await prisma.follows.findMany({
      where: {
        followingId: userId,
        status: FriendStatus.PENDING
      },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            avatar: true,
            email: true,
            status: true
          }
        }
      }
    });

    return requests.map(req => ({
      id: req.followerId + '_' + req.followingId, // Composite ID for frontend
      from: req.follower,
      createdAt: new Date().toISOString() // Or use createdAt from DB if available
    }));
  }

  async getSentRequests(userId: string) {
    const requests = await prisma.follows.findMany({
      where: {
        followerId: userId,
        status: FriendStatus.PENDING
      },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            avatar: true,
            email: true,
            status: true
          }
        }
      }
    });

    return requests.map(req => ({
      id: req.followerId + '_' + req.followingId,
      to: req.following,
      createdAt: new Date().toISOString()
    }));
  }

  async cancelFriendRequest(requesterId: string, targetId: string) {
    const followRequest = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: requesterId,
          followingId: targetId
        }
      }
    });

    if (!followRequest) {
      throw new Error('Friend request not found');
    }

    if (followRequest.status !== FriendStatus.PENDING) {
      throw new Error('Cannot cancel a request that is not pending');
    }

    return await prisma.follows.delete({
      where: {
        followerId_followingId: {
          followerId: requesterId,
          followingId: targetId
        }
      }
    });
  }

  async getOnlineFriends(userId: string) {
    const friends = await this.getFriends(userId);
    return friends.filter(friend => friend.status === 'ONLINE' || friend.status === 'READING');
  }

  async getFriendProfile(friendId: string) {
    const friend = await prisma.user.findUnique({
      where: { id: friendId },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        displayName: true,
        bio: true,
        location: true,
        website: true,
        status: true,
        createdAt: true
      }
    });

    if (!friend) {
      throw new Error('Friend not found');
    }

    const stats = await this.getFriendReadingStats(friendId);

    return {
      ...friend,
      stats,
      isOnline: friend.status !== 'OFFLINE'
    };
  }

  async getFriendReadingStats(friendId: string) {
    const logs = await prisma.readingLog.findMany({
      where: { userId: friendId },
      include: {
        book: true,
        sessions: true
      }
    });

    const totalBooks = logs.length;
    const finishedBooks = logs.filter(log => log.status === 'FINISHED').length;
    const currentlyReading = logs.filter(log => log.status === 'READING').length;
    
    // Calculate total pages from sessions for accuracy, or use currentPage from logs
    const totalPagesRead = logs.reduce((sum, log) => sum + (log.currentPage || 0), 0);
    
    // Calculate total reading time from sessions
    let totalMinutes = 0;
    logs.forEach(log => {
      log.sessions.forEach(session => {
        totalMinutes += session.minutesRead || 0;
      });
    });

    return {
      totalBooks,
      finishedBooks,
      currentlyReading,
      totalPagesRead,
      totalHours: Math.round(totalMinutes / 60),
      recentBooks: logs.slice(0, 5).map(log => ({
        id: log.bookId,
        title: log.book.title,
        author: log.book.author,
        coverUrl: log.book.coverUrl || null,
        status: log.status,
        pagesRead: log.currentPage || 0,
        totalPages: log.book.totalPages || 1,
        rating: log.book.rating || null,
        finishedDate: log.finishedAt ? log.finishedAt.toISOString() : null
      }))
    };
  }

  async checkFriendStatus(userId1: string, userId2: string) {
    const followRecord = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId1,
          followingId: userId2
        }
      }
    });

    if (!followRecord) {
      return { status: 'NONE' };
    }

    return { status: followRecord.status };
  }

  async searchUsers(query: string, currentUserId: string) {
    return await prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { username: { contains: query, mode: 'insensitive' } },
              { id: query }
            ]
          },
          {
            id: { not: currentUserId }
          }
        ]
      },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        status: true
      },
      take: 10
    });
  }
}
