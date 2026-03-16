import { Request, Response } from 'express';
import { BookService } from '../services/bookService.js';
import { AuthenticatedRequest } from '../types/user.js';
import { Status } from '@prisma/client';

const bookService = new BookService();

export class BookController {
  async createBook(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { title, author, totalPages, coverUrl, isbn, metadata } = req.body;

      if (!title || !author || !totalPages) {
        return res.status(400).json({ error: 'Title, author, and totalPages are required' });
      }

      const book = await bookService.createBook(req.user.id.toString(), {
        title,
        author,
        totalPages,
        coverUrl,
        isbn,
        metadata,
      });

      res.status(201).json(book);
    } catch (error) {
      console.error('Error creating book:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateBook(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { bookId } = req.params;
      const updateData = req.body;

      if (Array.isArray(bookId)) {
        return res.status(400).json({ error: 'Invalid book ID' });
      }

      const book = await bookService.getBookById(bookId);
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }

      if ((book as any).user_id !== req.user.id.toString()) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const updatedBook = await bookService.updateBook(bookId, updateData);
      res.json(updatedBook);
    } catch (error) {
      console.error('Error updating book:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteBook(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { bookId } = req.params;

      if (Array.isArray(bookId)) {
        return res.status(400).json({ error: 'Invalid book ID' });
      }

      const book = await bookService.getBookById(bookId);
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }

      if ((book as any).user_id !== req.user.id.toString()) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      await bookService.deleteBook(bookId);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting book:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getUserBooks(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const books = await bookService.getUserBooks(req.user.id.toString());
      res.json(books);
    } catch (error) {
      console.error('Error fetching user books:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getBookById(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { bookId } = req.params;

      if (Array.isArray(bookId)) {
        return res.status(400).json({ error: 'Invalid book ID' });
      }

      const book = await bookService.getBookById(bookId);

      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }

      if ((book as any).user_id !== req.user.id.toString()) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      res.json(book);
    } catch (error) {
      console.error('Error fetching book:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateReadingProgress(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { bookId } = req.params;
      const { currentPage, status } = req.body;

      if (Array.isArray(bookId)) {
        return res.status(400).json({ error: 'Invalid book ID' });
      }

      if (typeof currentPage !== 'number' || currentPage < 0) {
        return res.status(400).json({ error: 'Current page must be a non-negative number' });
      }

      const book = await bookService.getBookById(bookId);
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }

      if ((book as any).user_id !== req.user.id.toString()) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const readingLog = await bookService.updateReadingProgress(
        req.user.id.toString(),
        bookId,
        currentPage,
        status as Status
      );

      res.json(readingLog);
    } catch (error) {
      console.error('Error updating reading progress:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getReadingProgress(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { bookId } = req.params;

      if (Array.isArray(bookId)) {
        return res.status(400).json({ error: 'Invalid book ID' });
      }

      const progress = await bookService.getReadingProgress(req.user.id.toString(), bookId);

      if (!progress) {
        return res.status(404).json({ error: 'Reading progress not found' });
      }

      res.json(progress);
    } catch (error) {
      console.error('Error fetching reading progress:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getAllReadingProgress(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const progress = await bookService.getAllReadingProgress(req.user.id.toString());
      res.json(progress);
    } catch (error) {
      console.error('Error fetching all reading progress:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async addBookSection(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { bookId } = req.params;
      const { title, startPage, endPage, content, notes } = req.body;

      if (Array.isArray(bookId)) {
        return res.status(400).json({ error: 'Invalid book ID' });
      }

      if (!title || typeof startPage !== 'number' || typeof endPage !== 'number') {
        return res.status(400).json({ error: 'Title, startPage, and endPage are required' });
      }

      if (startPage >= endPage) {
        return res.status(400).json({ error: 'Start page must be less than end page' });
      }

      const book = await bookService.getBookById(bookId);
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }

      if ((book as any).user_id !== req.user.id.toString()) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const updatedBook = await bookService.addBookSection(bookId, {
        title,
        startPage,
        endPage,
        content,
        notes,
      });

      res.json(updatedBook);
    } catch (error) {
      console.error('Error adding book section:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateBookSection(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { bookId, sectionId } = req.params;
      const updateData = req.body;

      if (Array.isArray(bookId) || Array.isArray(sectionId)) {
        return res.status(400).json({ error: 'Invalid book ID or section ID' });
      }

      const book = await bookService.getBookById(bookId);
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }

      if ((book as any).user_id !== req.user.id.toString()) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const updatedBook = await bookService.updateBookSection(bookId, sectionId, updateData);
      res.json(updatedBook);
    } catch (error) {
      console.error('Error updating book section:', error);
      if (error instanceof Error && error.message === 'Section not found') {
        return res.status(404).json({ error: 'Section not found' });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteBookSection(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { bookId, sectionId } = req.params;

      if (Array.isArray(bookId) || Array.isArray(sectionId)) {
        return res.status(400).json({ error: 'Invalid book ID or section ID' });
      }

      const book = await bookService.getBookById(bookId);
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }

      if ((book as any).user_id !== req.user.id.toString()) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const updatedBook = await bookService.deleteBookSection(bookId, sectionId);
      res.json(updatedBook);
    } catch (error) {
      console.error('Error deleting book section:', error);
      if (error instanceof Error && error.message === 'Section not found') {
        return res.status(404).json({ error: 'Section not found' });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
