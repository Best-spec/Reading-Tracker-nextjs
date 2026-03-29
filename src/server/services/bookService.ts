import { Book, ReadingLog, Status } from '@prisma/client';
import { prisma } from '../prisma.js';
import { CreateBookInput } from '../types/booktype.js';

const prismaClient = prisma;

export class BookService {
  async createBook(userId: string, bookData: CreateBookInput) { 
    return await prismaClient.book.create({
      data: {
        ...bookData,
        user_id: userId,
      },
    });
  }

  async updateBook(bookId: string, bookData: Partial<{
    title: string;
    author: string;
    totalPages: number;
    coverUrl: string;
    isbn: string;
    metadata: any;
  }>): Promise<Book> {
    return await prismaClient.book.update({
      where: { id: bookId },
      data: bookData,
    });
  }

  async deleteBook(bookId: string): Promise<void> {
    await prismaClient.book.delete({
      where: { id: bookId },
    });
  }

  async getUserBooks(userId: string): Promise<Book[]> {
    return await prismaClient.book.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async getBookById(bookId: string): Promise<Book | null> {
    return await prismaClient.book.findUnique({
      where: { id: bookId },
    });
  }

  async updateReadingProgress(userId: string, bookId: string, currentPage: number, status?: Status): Promise<ReadingLog> {
    return await prismaClient.readingLog.upsert({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
      update: {
        currentPage,
        status,
        finishedAt: status === 'FINISHED' ? new Date() : undefined,
      },
      create: {
        userId,
        bookId,
        currentPage,
        status: status || 'READING',
      },
    });
  }

  async getReadingProgress(userId: string, bookId: string): Promise<ReadingLog | null> {
    return await prismaClient.readingLog.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
      include: {
        book: true,
      },
    });
  }

  async getAllReadingProgress(userId: string): Promise<ReadingLog[]> {
    return await prismaClient.readingLog.findMany({
      where: {
        userId,
      },
      include: {
        book: true,
      },
      orderBy: {
        startedAt: 'desc',
      },
    });
  }

  async addBookSection(bookId: string, sectionData: {
    title: string;
    startPage: number;
    endPage: number;
    content?: string;
    notes?: string;
  }): Promise<Book> {
    const book = await this.getBookById(bookId);
    if (!book) {
      throw new Error('Book not found');
    }

    const updatedMetadata = {
      ...(book.metadata as any || {}),
      sections: [
        ...((book.metadata as any)?.sections || []),
        {
          id: crypto.randomUUID(),
          ...sectionData,
          createdAt: new Date(),
        },
      ],
    };

    return await prismaClient.book.update({
      where: { id: bookId },
      data: {
        metadata: updatedMetadata,
      },
    });
  }

  async updateBookSection(bookId: string, sectionId: string, sectionData: Partial<{
    title: string;
    startPage: number;
    endPage: number;
    content: string;
    notes: string;
  }>): Promise<Book> {
    const book = await this.getBookById(bookId);
    if (!book) {
      throw new Error('Book not found');
    }

    const metadata = book.metadata as any || {};
    const sections = metadata.sections || [];
    
    const sectionIndex = sections.findIndex((section: any) => section.id === sectionId);
    if (sectionIndex === -1) {
      throw new Error('Section not found');
    }

    sections[sectionIndex] = {
      ...sections[sectionIndex],
      ...sectionData,
      updatedAt: new Date(),
    };

    return await prismaClient.book.update({
      where: { id: bookId },
      data: {
        metadata: {
          ...metadata,
          sections,
        },
      },
    });
  }

  async deleteBookSection(bookId: string, sectionId: string): Promise<Book> {
    const book = await this.getBookById(bookId);
    if (!book) {
      throw new Error('Book not found');
    }

    const metadata = book.metadata as any || {};
    const sections = metadata.sections || [];
    
    const filteredSections = sections.filter((section: any) => section.id !== sectionId);

    return await prismaClient.book.update({
      where: { id: bookId },
      data: {
        metadata: {
          ...metadata,
          sections: filteredSections,
        },
      },
    });
  }
}
