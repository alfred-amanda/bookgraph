'use client';

import { useState } from 'react';
import { Plus, BookOpen } from 'lucide-react';
import AddBookModal from './AddBookModal';

export default function TopHeader() {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <>
      <header className="bg-[--color-surface] border-b border-[--color-border]">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen size={28} className="text-[--color-accent]" strokeWidth={1.5} />
            <div>
              <h1 className="text-2xl font-bold text-[--color-accent]" style={{ fontFamily: 'var(--font-merriweather)' }}>
                BookGraph
              </h1>
              <p className="text-xs text-[--color-text-secondary] -mt-0.5">Every book leads to the next.</p>
            </div>
          </div>

          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[--color-accent] text-white text-sm font-medium rounded-md hover:bg-[--color-accent-hover] transition-colors shadow-sm"
          >
            <Plus size={16} />
            Add Book
          </button>
        </div>
      </header>

      {showAdd && <AddBookModal onClose={() => setShowAdd(false)} />}
    </>
  );
}