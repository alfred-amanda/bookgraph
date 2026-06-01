'use client';

import { Heart, Sparkles, ChevronRight } from 'lucide-react';
import { Recommendation } from '@/lib/types';
import BookDetailModal from './BookDetailModal';
import { useState } from 'react';

interface RecommendationsPanelProps {
  recommendations: Recommendation[];
}

export default function RecommendationsPanel({ recommendations }: RecommendationsPanelProps) {
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const { books } = require('@/lib/store').useBookStore.getState();
  const selectedBookData = selectedBook ? books.find((b: any) => b.id === selectedBook) : null;

  const maxScore = recommendations.length > 0 ? Math.max(...recommendations.map((r) => r.score)) : 1;

  return (
    <aside className="w-80 shrink-0">
      <div className="sticky top-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={18} className="text-[--color-accent]" />
          <h2 className="text-base font-semibold" style={{ fontFamily: 'var(--font-merriweather)' }}>
            Recommended for You
          </h2>
        </div>

        {recommendations.length === 0 ? (
          <div className="bg-[--color-surface] border border-[--color-border] rounded-lg p-6 text-center">
            <Heart size={32} className="text-[--color-text-secondary] mx-auto mb-3 opacity-40" />
            <p className="text-sm text-[--color-text-secondary]">
              Like a book to get personalized recommendations
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {recommendations.map((rec, i) => (
              <div
                key={rec.book.id}
                onClick={() => setSelectedBook(rec.book.id)}
                className="bg-[--color-surface] border border-[--color-border] rounded-lg p-3 cursor-pointer hover:shadow-md hover:border-[--color-accent]/30 transition-all group"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Score bar */}
                <div className="h-1 rounded-full bg-[--color-border] mb-3 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[--color-accent] transition-all duration-500"
                    style={{ width: `${(rec.score / maxScore) * 100}%` }}
                  />
                </div>

                {/* Book info */}
                <h3 className="text-sm font-semibold text-[--color-text-primary] leading-snug line-clamp-2"
                    style={{ fontFamily: 'var(--font-merriweather)' }}>
                  {rec.book.title}
                </h3>
                <p className="text-xs text-[--color-text-secondary] mt-0.5">{rec.book.author}</p>

                {/* Reasons */}
                <div className="mt-2 flex flex-col gap-1">
                  {rec.reasons.slice(0, 2).map((reason, j) => (
                    <div key={j} className="flex items-start gap-1.5">
                      <span className="text-[10px] font-medium text-[--color-accent] bg-[--color-accent-light] px-1.5 py-0.5 rounded uppercase">
                        {reason.type}
                      </span>
                      <span className="text-[11px] text-[--color-text-secondary] line-clamp-1">
                        {reason.type === 'author' ? `Same author: ${reason.value}` :
                         reason.type === 'genre' ? `Shared genre: ${reason.value}` :
                         `Shared: ${reason.value}`}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Connected books */}
                <div className="mt-2 flex items-center gap-1 text-[10px] text-[--color-text-secondary]">
                  <Heart size={10} className="text-[--color-danger]" />
                  <span>
                    Matches {rec.reasons[0]?.connectedTo.length ?? 0} liked book
                    {(rec.reasons[0]?.connectedTo.length ?? 0) !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedBookData && (
        <BookDetailModal book={selectedBookData} onClose={() => setSelectedBook(null)} />
      )}
    </aside>
  );
}