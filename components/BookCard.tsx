'use client';

import { useState } from 'react';
import { Heart, Pencil } from 'lucide-react';
import { Book } from '@/lib/types';
import { useBookStore } from '@/lib/store';
import BookDetailModal from './BookDetailModal';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const { toggleLike } = useBookStore();
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      <div
        onClick={() => setShowDetail(true)}
        className="bg-[--color-surface] border border-[--color-border] rounded-lg p-4 cursor-pointer group hover:shadow-md transition-all duration-150 hover:border-[--color-accent]/30 relative"
      >
        {/* Heart / Like */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(book.id);
          }}
          className={`absolute top-3 right-3 p-1.5 rounded-full transition-colors ${
            book.liked
              ? 'text-[--color-danger] bg-red-50'
              : 'text-[--color-text-secondary] opacity-0 group-hover:opacity-100 hover:text-[--color-danger]'
          }`}
        >
          <Heart size={15} fill={book.liked ? 'currentColor' : 'none'} />
        </button>

        {/* Title */}
        <h3
          className="text-base font-semibold text-[--color-text-primary] pr-8 leading-snug"
          style={{ fontFamily: 'var(--font-merriweather)' }}
        >
          {book.title}
        </h3>

        {/* Author */}
        <p className="text-sm text-[--color-text-secondary] mt-0.5">{book.author}</p>

        {/* Genres */}
        {book.genres.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {book.genres.slice(0, 3).map((genre) => (
              <span
                key={genre}
                className="text-xs px-2 py-0.5 bg-[--color-accent-light] text-[--color-accent-hover] rounded-full font-medium"
              >
                {genre}
              </span>
            ))}
            {book.genres.length > 3 && (
              <span className="text-xs px-2 py-0.5 text-[--color-text-secondary]">
                +{book.genres.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {showDetail && (
        <BookDetailModal book={book} onClose={() => setShowDetail(false)} />
      )}
    </>
  );
}