import React from 'react';
import Link from 'next/link';
import { RecentBook } from '@/types/profile';

interface RecentBooksProps {
  books: RecentBook[];
}

export function RecentBooks({ books }: RecentBooksProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FINISHED': return 'bg-green-100 text-green-700';
      case 'READING': return 'bg-blue-100 text-blue-700';
      case 'TO_READ': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Books</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {books.map(book => (
              <div key={book.id} className="flex items-center gap-4">
                <img
                  src={book.coverUrl || 'https://via.placeholder.com/60x90?text=No+Cover'}
                  alt={book.title}
                  className="w-12 h-18 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{book.title}</h4>
                  <p className="text-sm text-gray-600">{book.author}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(book.status || '')}`}>
                      {(book.status || 'PLAN').replace('_', ' ')}
                    </span>
                    {book.rating && (
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm text-gray-600">{book.rating}</span>
                      </div>
                    )}
                    {book.finishedDate && (
                      <span className="text-xs text-gray-500">
                        Finished {formatDate(book.finishedDate)}
                      </span>
                    )}
                  </div>
                  {book.status === 'READING' && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{ width: `${(book.pagesRead / book.totalPages) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {book.pagesRead} / {book.totalPages} pages
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/books"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View All Books →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
