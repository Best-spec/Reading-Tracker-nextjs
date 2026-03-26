import { prisma } from '../prisma.js';

export class DashboardService {
  // คำนวณเวลาอ่านรวมของผู้ใช้
  async getTotalReadingTime(userId: string): Promise<number> {
    const sessions = await prisma.readingSession.findMany({
      where: {
        readingLog: {
          userId: userId
        },
        minutesRead: {
          not: null
        }
      }
    });

    return sessions.reduce((total: number, session: any) => total + (session.minutesRead || 0), 0);
  }

  // คำนวณเวลาอ่านรายสัปดาห์
  async getWeeklyReadingTime(userId: string): Promise<number> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const sessions = await prisma.readingSession.findMany({
      where: {
        readingLog: {
          userId: userId
        },
        startTime: {
          gte: oneWeekAgo
        },
        minutesRead: {
          not: null
        }
      }
    });

    return sessions.reduce((total: number, session: any) => total + (session.minutesRead || 0), 0);
  }

  // คำนวณเวลาอ่านรายเดือน
  async getMonthlyReadingTime(userId: string): Promise<number> {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const sessions = await prisma.readingSession.findMany({
      where: {
        readingLog: {
          userId: userId
        },
        startTime: {
          gte: oneMonthAgo
        },
        minutesRead: {
          not: null
        }
      }
    });

    return sessions.reduce((total: number, session: any) => total + (session.minutesRead || 0), 0);
  }

  // หา top หนังสือที่อ่านมากสุด (ตามเวลาอ่าน)
  async getTopBooksByReadingTime(userId: string, limit: number = 5): Promise<any[]> {
    const books = await prisma.readingSession.groupBy({
      by: ['readingLogId'],
      where: {
        readingLog: {
          userId: userId
        },
        minutesRead: {
          not: null
        }
      },
      _sum: {
        minutesRead: true
      },
      orderBy: {
        _sum: {
          minutesRead: 'desc'
        }
      },
      take: limit
    });

    const bookDetails = await Promise.all(
      books.map(async (book: any) => {
        const readingLog = await prisma.readingLog.findUnique({
          where: { id: book.readingLogId },
          include: { book: true }
        });
        
        return {
          book: readingLog?.book,
          totalMinutes: book._sum.minutesRead || 0
        };
      })
    );

    return bookDetails;
  }

  // สรุปแนวโน้มการอ่าน (ข้อมูล 7 วันล่าสุด)
  async getReadingTrend(userId: string): Promise<any[]> {
    const days = 7;
    const trends = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const sessions = await prisma.readingSession.findMany({
        where: {
          readingLog: {
            userId: userId
          },
          startTime: {
            gte: date,
            lt: nextDate
          },
          minutesRead: {
            not: null
          }
        }
      });

      const totalMinutes = sessions.reduce((total: number, session: any) => total + (session.minutesRead || 0), 0);
      
      trends.push({
        date: date.toISOString().split('T')[0],
        minutesRead: totalMinutes,
        sessionsCount: sessions.length
      });
    }
    
    return trends;
  }

  // สรุปข้อมูลทั้งหมดสำหรับ dashboard
  async getDashboardSummary(userId: string) {
    const [
      totalTime,
      weeklyTime,
      monthlyTime,
      topBooks,
      trend
    ] = await Promise.all([
      this.getTotalReadingTime(userId),
      this.getWeeklyReadingTime(userId),
      this.getMonthlyReadingTime(userId),
      this.getTopBooksByReadingTime(userId),
      this.getReadingTrend(userId)
    ]);

    return {
      totalReadingMinutes: totalTime,
      weeklyReadingMinutes: weeklyTime,
      monthlyReadingMinutes: monthlyTime,
      topBooks,
      readingTrend: trend
    };
  }
}
