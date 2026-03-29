export interface CreateBookInput {
  title: string;
  author: string;
  totalPages: number;
  coverUrl?: string;
  isbn?: string;
  metadata?: any;
  status?: string;
  currentPage?: number;
  rating?: number;
  genre?: string;
}