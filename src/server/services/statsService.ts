import { prisma } from '../prisma.js';

export class StatsService {
    async getStats(userId: string) {
        // Get all reading logs for this user to calculate total pages and rating
        const readingLogs = await prisma.readingLog.findMany({ 
            where: { userId },
            include: { book: true, sessions: true }
        });

        const totalFinishedBooks = readingLogs.filter(log => log.status === 'FINISHED').length;
        const totalPages = readingLogs.reduce((acc, log) => acc + (log.currentPage || 0), 0);
        
        // Sum all minutes from all sessions
        const allSessions = readingLogs.flatMap(log => log.sessions);
        const totalMinutes = allSessions.reduce((acc, session) => acc + (session.minutesRead || 0), 0);
        const totalHours = Math.round((totalMinutes / 60) * 10) / 10; // Round to 1 decimal place

        // Calculate Average Rating
        const ratedLogs = readingLogs.filter(log => log.book.rating && log.book.rating > 0);
        const averageRating = ratedLogs.length > 0 
            ? Math.round((ratedLogs.reduce((acc, log) => acc + (log.book.rating || 0), 0) / ratedLogs.length) * 10) / 10 
            : 0;

        // Calculate Favorite Genre
        const genres = readingLogs.map(log => log.book.genre).filter(Boolean);
        const genreCounts = genres.reduce((acc: any, g) => {
            acc[g!] = (acc[g!] || 0) + 1;
            return acc;
        }, {});
        const favoriteGenre = Object.keys(genreCounts).reduce((a, b) => genreCounts[a] > genreCounts[b] ? a : b, "None");

        return {
            totalBooks: totalFinishedBooks,
            totalPages: totalPages,
            totalHours: totalHours,
            currentStreak: 0, // Placeholder for streak logic
            longestStreak: 0,
            favoriteGenre: favoriteGenre,
            averageRating: averageRating
        };
    }
}
