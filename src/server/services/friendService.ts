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
            avatar: true
          }
        },
        following: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      }
    });
  }

  async acceptFriendRequest(followerId: string, followingId: string) {
    const followRequest = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    });

    if (!followRequest) {
      throw new Error('Friend request not found');
    }

    if (followRequest.status !== FriendStatus.PENDING) {
      throw new Error('Friend request is not pending');
    }

    return await prisma.follows.update({
      where: {
        followerId_followingId: {
          followerId,
          followingId
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
            avatar: true
          }
        },
        following: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      }
    });
  }

  async rejectFriendRequest(followerId: string, followingId: string) {
    const followRequest = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    });

    if (!followRequest) {
      throw new Error('Friend request not found');
    }

    if (followRequest.status !== FriendStatus.PENDING) {
      throw new Error('Friend request is not pending');
    }

    return await prisma.follows.update({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      },
      data: {
        status: FriendStatus.REJECTED
      }
    });
  }

  async removeFriend(followerId: string, followingId: string) {
    const followRecord = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    });

    if (!followRecord) {
      throw new Error('Friend relationship not found');
    }

    await prisma.follows.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    });

    return { message: 'Friend removed successfully' };
  }

  async getFriends(userId: string) {
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
            avatar: true
          }
        },
        following: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      }
    });

    return friends.map(friend => {
      if (friend.followerId === userId) {
        return friend.following;
      } else {
        return friend.follower;
      }
    });
  }

  async getPendingRequests(userId: string) {
    return await prisma.follows.findMany({
      where: {
        followingId: userId,
        status: FriendStatus.PENDING
      },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      }
    });
  }

  async getOnlineFriends(userId: string) {
    const friends = await this.getFriends(userId);
    
    return friends.filter(friend => {
      return true;
    });
  }

  async getFriendReadingStats(friendId: string) {
    const stats = await prisma.readingLog.findMany({
      where: {
        userId: friendId
      },
      include: {
        book: true
      }
    });

    const totalBooks = stats.length;
    const finishedBooks = stats.filter(log => log.status === 'FINISHED').length;
    const currentlyReading = stats.filter(log => log.status === 'READING').length;
    const totalPagesRead = stats.reduce((sum, log) => sum + log.currentPage, 0);

    return {
      totalBooks,
      finishedBooks,
      currentlyReading,
      totalPagesRead,
      recentBooks: stats.slice(0, 5).map(log => ({
        title: log.book.title,
        author: log.book.author,
        status: log.status,
        currentPage: log.currentPage,
        totalPages: log.book.totalPages
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
}
