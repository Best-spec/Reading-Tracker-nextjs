import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ReadingSessionService {
  async startReadingSession(userId: string, bookId: string, section?: string) {
    try {
      // ตรวจสอบว่ามี ReadingLog สำหรับ user และ book นี้หรือไม่
      let readingLog = await prisma.readingLog.findFirst({
        where: {
          userId,
          bookId
        }
      });

      // ถ้าไม่มีให้สร้างใหม่
      if (!readingLog) {
        readingLog = await prisma.readingLog.create({
          data: {
            userId,
            bookId,
            status: 'READING'
          }
        });
      } else {
        // ถ้ามีอยู่แล้วให้อัพเดต status เป็น READING
        readingLog = await prisma.readingLog.update({
          where: { id: readingLog.id },
          data: { status: 'READING' }
        });
      }

      // สร้าง reading session ใหม่
      const session = await prisma.readingSession.create({
        data: {
          readingLogId: readingLog.id,
          section
        },
        include: {
          readingLog: {
            include: {
              book: true
            }
          }
        }
      });

      return session;
    } catch (error) {
      throw new Error(`Failed to start reading session: ${error}`);
    }
  }

  async stopReadingSession(sessionId: string, pagesRead?: number) {
    try {
      const session = await prisma.readingSession.findUnique({
        where: { id: sessionId },
        include: { readingLog: true }
      });

      if (!session) {
        throw new Error('Reading session not found');
      }

      if (session.endTime) {
        throw new Error('Reading session already ended');
      }

      const endTime = new Date();
      const startTime = new Date(session.startTime);
      const minutesRead = Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60));

      // อัพเดต session
      const updatedSession = await prisma.readingSession.update({
        where: { id: sessionId },
        data: {
          endTime,
          minutesRead,
          pagesRead
        }
      });

      // อัพเดต currentPage ใน ReadingLog ถ้ามี pagesRead
      if (pagesRead) {
        await prisma.readingLog.update({
          where: { id: session.readingLogId },
          data: {
            currentPage: session.readingLog.currentPage + pagesRead
          }
        });
      }

      return updatedSession;
    } catch (error) {
      throw new Error(`Failed to stop reading session: ${error}`);
    }
  }

  async getReadingHistory(userId: string) {
    try {
      const sessions = await prisma.readingSession.findMany({
        where: {
          readingLog: {
            userId
          }
        },
        include: {
          readingLog: {
            include: {
              book: true
            }
          }
        },
        orderBy: {
          startTime: 'desc'
        }
      });

      return sessions;
    } catch (error) {
      throw new Error(`Failed to get reading history: ${error}`);
    }
  }

  async getActiveSession(userId: string) {
    try {
      const activeSession = await prisma.readingSession.findFirst({
        where: {
          readingLog: {
            userId
          },
          endTime: null
        },
        include: {
          readingLog: {
            include: {
              book: true
            }
          }
        }
      });

      return activeSession;
    } catch (error) {
      throw new Error(`Failed to get active session: ${error}`);
    }
  }
}
