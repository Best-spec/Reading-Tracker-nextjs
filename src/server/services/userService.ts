import { prisma } from '../prisma.js';
import { User } from '@prisma/client';

export class UserService {
    async getProfile(userId: string) {
        return await prisma.user.findUnique({
            where: { id: userId },
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
                isPublic: true,
                createdAt: true,
            }
        });
    }

    async updateProfile(userId: string, data: Partial<User> & { isPublic?: boolean }) {
        return await prisma.user.update({
            where: { id: userId },
            data: {
                displayName: data.displayName,
                bio: data.bio,
                location: data.location,
                website: data.website,
                status: (data as any).status,
                isPublic: data.isPublic,
                avatar: data.avatar,
            },
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
                isPublic: true,
                createdAt: true,
            }
        });
    }
}
