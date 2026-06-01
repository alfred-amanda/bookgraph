'use client';

import { useState } from 'react';
import { useBookStore } from '@/lib/store';
import TopHeader from '@/components/TopHeader';
import LibraryGrid from '@/components/LibraryGrid';
import RecommendationsPanel from '@/components/RecommendationsPanel';
import BookDetailModal from '@/components/BookDetailModal';

export default function HomePage() {
  const { getRecommendations } = useBookStore();
  const recommendations = getRecommendations();

  return (
    <div className="h-screen flex flex-col bg-[--color-bg]">
      <TopHeader />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        <div className="flex gap-8 items-start">
          {/* Library — left 60% */}
          <div className="flex-1 min-w-0">
            <LibraryGrid />
          </div>

          {/* Recommendations — right sticky */}
          <RecommendationsPanel recommendations={recommendations} />
        </div>
      </main>
    </div>
  );
}