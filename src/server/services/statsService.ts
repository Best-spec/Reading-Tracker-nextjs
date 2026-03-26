import { prisma } from '../prisma.js';

const startOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

const startOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const endOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

const subDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() - days);
  return d;
};

const format = (date: Date, pattern: string) => {
  if (pattern === 'yyyy-MM-dd') {
    return date.toISOString().split('T')[0];
  } else if (pattern === 'yyyy-MM') {
    return date.toISOString().slice(0, 7);
  }
  return date.toISOString();
};

export class StatsService {
  // รวมเวลาอ่านรายวัน
  async getDailyReadingTime(userId: string, date: Date = new Date()) {
    const start = startOfDay(date);
    const end = endOfDay(date);

    const sessions = await prisma.readingSession.findMany({
      where: {
        readingLog: {
          userId: userId
        },
        startTime: {
          gte: start,
          lte: end
        }
      }
    });

    const totalMinutes = sessions.reduce((sum: number, session: any) => {
      return sum + (session.minutesRead || 0);
    }, 0);

    return {
      date: format(date, 'yyyy-MM-dd'),
      totalMinutes,
      totalHours: Math.round(totalMinutes / 60 * 100) / 100,
      sessionCount: sessions.length,
      pagesRead: sessions.reduce((sum: number, session: any) => sum + (session.pagesRead || 0), 0)
    };
  }

  // แสดงปฏิทินการอ่าน (ข้อมูล 30 วันล่าสุด)
  async getReadingCalendar(userId: string, days: number = 30) {
    const calendar = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(today, i);
      const dayStats = await this.getDailyReadingTime(userId, date);
      
      calendar.push({
        date: dayStats.date,
        totalMinutes: dayStats.totalMinutes,
        hasActivity: dayStats.totalMinutes > 0,
        sessionCount: dayStats.sessionCount
      });
    }

    return calendar;
  }

  // คำนวณ streak (ติดต่อกันกี่วัน)
  async getCurrentStreak(userId: string) {
    let streak = 0;
    let currentDate = new Date();
    
    while (true) {
      const dayStats = await this.getDailyReadingTime(userId, currentDate);
      
      if (dayStats.totalMinutes > 0) {
        streak++;
        currentDate = subDays(currentDate, 1);
      } else {
        break;
      }
    }

    return streak;
  }

  // ดึงเวลาอ่านของวันนี้
  async getTodayReadingTime(userId: string) {
    return this.getDailyReadingTime(userId, new Date());
  }

  // ดึงเวลาอ่านรายเดือน
  async getMonthlyReadingTime(userId: string, date: Date = new Date()) {
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    const sessions = await prisma.readingSession.findMany({
      where: {
        readingLog: {
          userId: userId
        },
        startTime: {
          gte: start,
          lte: end
        }
      }
    });

    const totalMinutes = sessions.reduce((sum, session) => {
      return sum + (session.minutesRead || 0);
    }, 0);

    // จัดกลุ่มตามวัน
    const dailyStats = new Map();
    
    sessions.forEach((session: any) => {
      const dayKey = format(session.startTime, 'yyyy-MM-dd');
      if (!dailyStats.has(dayKey)) {
        dailyStats.set(dayKey, {
          minutes: 0,
          sessions: 0,
          pages: 0
        });
      }
      
      const stats = dailyStats.get(dayKey);
      stats.minutes += session.minutesRead || 0;
      stats.sessions += 1;
      stats.pages += session.pagesRead || 0;
    });

    return {
      month: format(date, 'yyyy-MM'),
      totalMinutes,
      totalHours: Math.round(totalMinutes / 60 * 100) / 100,
      totalSessions: sessions.length,
      totalPagesRead: sessions.reduce((sum, session) => sum + (session.pagesRead || 0), 0),
      activeDays: dailyStats.size,
      dailyBreakdown: Array.from(dailyStats.entries()).map(([date, stats]) => ({
        date,
        minutes: stats.minutes,
        sessions: stats.sessions,
        pages: stats.pages
      }))
    };
  }

  // สถิติรวมทั้งหมด
  async getAllTimeStats(userId: string) {
    const sessions = await prisma.$queryRaw<{
      minutesRead: number;
      pagesRead: number;
      startTime: Date;
    }[]>`
      SELECT * FROM "ReadingSession" 
      WHERE "readingLogId" IN (
        SELECT id FROM "ReadingLog" WHERE "userId" = ${userId}
      )
    `;

    const totalMinutes = sessions.reduce((sum, session) => {
      return sum + (session.minutesRead || 0);
    }, 0);

    const firstSession = sessions.sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    )[0];

    return {
      totalMinutes,
      totalHours: Math.round(totalMinutes / 60 * 100) / 100,
      totalSessions: sessions.length,
      totalPagesRead: sessions.reduce((sum, session) => sum + (session.pagesRead || 0), 0),
      firstReadingDate: firstSession ? firstSession.startTime : null,
      averageSessionMinutes: sessions.length > 0 ? Math.round(totalMinutes / sessions.length) : 0
    };
  }
}
