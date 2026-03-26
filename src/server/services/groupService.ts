import { Group, GroupMember, GroupRole, ReadingSession, ReadingLog } from '@prisma/client';
import { prisma } from '../prisma.js';

export class GroupService {
  async createGroup(ownerId: string, groupData: {
    name: string;
    description?: string;
  }): Promise<Group> {
    const group = await prisma.group.create({
      data: {
        ...groupData,
        ownerId,
      },
    });

    await prisma.groupMember.create({
      data: {
        groupId: group.id,
        userId: ownerId,
        role: GroupRole.OWNER,
      },
    });

    return group;
  }

  async deleteGroup(groupId: string, userId: string): Promise<void> {
    const group = await prisma.group.findFirst({
      where: {
        id: groupId,
        ownerId: userId,
      },
    });

    if (!group) {
      throw new Error('Group not found or you are not the owner');
    }

    await prisma.group.delete({
      where: { id: groupId },
    });
  }

  async updateGroup(groupId: string, userId: string, groupData: {
    name?: string;
    description?: string;
  }): Promise<Group> {
    const group = await prisma.group.findFirst({
      where: {
        id: groupId,
        ownerId: userId,
      },
    });

    if (!group) {
      throw new Error('Group not found or you are not the owner');
    }

    return await prisma.group.update({
      where: { id: groupId },
      data: groupData,
    });
  }

  async inviteMember(groupId: string, ownerUserId: string, memberUserId: string): Promise<GroupMember> {
    const group = await prisma.group.findFirst({
      where: {
        id: groupId,
        ownerId: ownerUserId,
      },
    });

    if (!group) {
      throw new Error('Group not found or you are not the owner');
    }

    const existingMember = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId: memberUserId,
        },
      },
    });

    if (existingMember) {
      throw new Error('User is already a member of this group');
    }

    return await prisma.groupMember.create({
      data: {
        groupId,
        userId: memberUserId,
        role: GroupRole.MEMBER,
      },
    });
  }

  async leaveGroup(groupId: string, userId: string): Promise<void> {
    const membership = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new Error('You are not a member of this group');
    }

    if (membership.role === GroupRole.OWNER) {
      const memberCount = await prisma.groupMember.count({
        where: { groupId },
      });

      if (memberCount > 1) {
        throw new Error('Group owner cannot leave. Transfer ownership or delete group first');
      }
    }

    await prisma.groupMember.delete({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
    });
  }

  async getGroupMembers(groupId: string, userId: string): Promise<GroupMember[]> {
    const membership = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new Error('You are not a member of this group');
    }

    return await prisma.groupMember.findMany({
      where: { groupId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        joinedAt: 'asc',
      },
    });
  }

  async getGroupLeaderboard(groupId: string, userId: string): Promise<any[]> {
    const membership = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new Error('You are not a member of this group');
    }

    const members = await prisma.groupMember.findMany({
      where: { groupId },
      select: { userId: true },
    });

    const userIds = members.map(m => m.userId);

    const readingStats = await prisma.readingLog.groupBy({
      by: ['userId'],
      where: {
        userId: { in: userIds },
        status: 'FINISHED',
      },
      _count: {
        id: true,
      },
    });

    const sessionStats = await prisma.readingSession.groupBy({
      by: ['readingLogId'],
      where: {
        readingLog: {
          userId: { in: userIds },
        },
        minutesRead: { not: null },
      },
      _sum: {
        minutesRead: true,
      },
    });

    const readingLogs = await prisma.readingLog.findMany({
      where: {
        id: { in: sessionStats.map(s => s.readingLogId) },
      },
      select: {
        id: true,
        userId: true,
      },
    });

    const users = await prisma.user.findMany({
      where: {
        id: { in: userIds },
      },
      select: {
        id: true,
        username: true,
        avatar: true,
      },
    });

    return users.map(user => {
      const booksFinished = readingStats.find(stat => stat.userId === user.id)?._count.id || 0;
      const userSessionStats = sessionStats.filter(stat => {
        const log = readingLogs.find(l => l.id === stat.readingLogId);
        return log?.userId === user.id;
      });
      const totalMinutes = userSessionStats.reduce((sum, stat) => sum + (stat._sum.minutesRead || 0), 0);

      return {
        user,
        booksFinished,
        totalMinutes,
        totalHours: Math.round((totalMinutes / 60) * 100) / 100,
      };
    }).sort((a, b) => b.booksFinished - a.booksFinished || b.totalMinutes - a.totalMinutes);
  }

  async getGroupTotalTime(groupId: string, userId: string): Promise<{ totalMinutes: number; totalHours: number }> {
    const membership = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new Error('You are not a member of this group');
    }

    const members = await prisma.groupMember.findMany({
      where: { groupId },
      select: { userId: true },
    });

    const userIds = members.map(m => m.userId);

    const sessionStats = await prisma.readingSession.aggregate({
      where: {
        readingLog: {
          userId: { in: userIds },
        },
        minutesRead: { not: null },
      },
      _sum: {
        minutesRead: true,
      },
    });

    const totalMinutes = sessionStats._sum.minutesRead || 0;

    return {
      totalMinutes,
      totalHours: Math.round((totalMinutes / 60) * 100) / 100,
    };
  }

  async getUserGroups(userId: string): Promise<Group[]> {
    const memberships = await prisma.groupMember.findMany({
      where: { userId },
      include: {
        group: true,
      },
    });

    return memberships.map(membership => membership.group);
  }

  async getGroupById(groupId: string, userId: string): Promise<Group | null> {
    const membership = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new Error('You are not a member of this group');
    }

    return await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
    });
  }
}
