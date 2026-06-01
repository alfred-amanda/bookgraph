'use client';

import { useState, useMemo } from 'react';
import { Library } from 'lucide-react';
import { useBookStore } from '@/lib/store';
import BookCard from './BookCard';
import FilterBar from './FilterBar';

export default function LibraryGrid() {
  const { books } = useBookStore();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [likedOnly, setLikedOnly] = useState(false);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      if (likedOnly && !book.liked) return false;
      if (selectedGenres.length > 0 && !selectedGenres.some((g) => book.genres.includes(g))) return false;
      return true;
    });
  }, [books, selectedGenres, likedOnly]);

  const allGenres = useMemo(() => {
    return [...new Set(books.flatMap((b) => b.genres))].sort();
  }, [books]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  return (
    <div className="flex-1">
      {/* Filter bar */}
      <div className="mb-5">
        {allGenres.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            <span className="text-xs text-[--color-text-secondary] self-center mr-1">Filter:</span>
            {allGenres.map((genre) => (
              <button
                key={genre}
                onClick={() => toggleGenre(genre)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  selectedGenres.includes(genre)
                    ? 'bg-[--color-accent] border-[--color-accent] text-white'
                    : 'border-[--color-border] text-[--color-text-secondary] hover:border-[--color-accent] hover:text-[--color-accent]'
                }`}
              >
                {genre}
              </button>
            ))}
            {(selectedGenres.length > 0 || likedOnly) && (
              <button
                onClick={() => { setSelectedGenres([]); setLikedOnly(false); }}
                className="text-xs px-2.5 py-1 text-[--color-text-secondary] hover:text-[--color-danger] transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLikedOnly(!likedOnly)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors ${
              likedOnly
                ? 'bg-[--color-danger] border-[--color-danger] text-white'
                : 'border-[--color-border] text-[--color-text-secondary] hover:border-[--color-danger] hover:text-[--color-danger]'
            }`}
          >
            ♥ Liked only
          </button>
          <span className="text-xs text-[--color-text-secondary]">
            {filteredBooks.length} of {books.length} books
          </span>
        </div>
      </div>

      {/* Grid */}
      {filteredBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Library size={48} className="text-[--color-text-secondary] mb-4 opacity-30" />
          {books.length === 0 ? (
            <>
              <p className="text-base font-medium text-[--color-text-primary]" style={{ fontFamily: 'var(--font-merriweather)' }}>
                Your library is empty
              </p>
              <p className="text-sm text-[--color-text-secondary] mt-1">
                Add your first book to get started
              </p>
            </>
          ) : (
            <>
              <p className="text-base font-medium text-[--color-text-primary]">
                No books match your filters
              </p>
              <p className="text-sm text-[--color-text-secondary] mt-1">
                Try adjusting your filter settings
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredBooks.map((book, i) => (
            <div
              key={book.id}
              className="animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'both' }}
            >
              <BookCard book={book} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}