import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { Book, Recommendation, RecommendationReason } from './types';
import { extractKeywords, buildGraph, computeSimilarity } from './graph';

interface BookState {
  books: Book[];
  // Actions
  addBook: (book: Omit<Book, 'id' | 'createdAt' | 'keywords'>) => void;
  updateBook: (id: string, updates: Partial<Omit<Book, 'id' | 'createdAt'>>) => void;
  deleteBook: (id: string) => void;
  toggleLike: (id: string) => void;
  // Computed
  getRecommendations: () => Recommendation[];
}

const SAMPLE_BOOKS: Omit<Book, 'id' | 'createdAt' | 'keywords'>[] = [
  {
    title: 'The Wild Robot',
    author: 'Peter Brown',
    genres: ['Sci-Fi', 'Children\'s', 'Fiction'],
    description: 'A robot named Roz opens her eyes for the first time and discovers she is all alone on a remote, wild island. She has no idea how she got there or what her purpose is. But she knows she needs to survive.',
    liked: true,
  },
  {
    title: 'Charlotte\'s Web',
    author: 'E.B. White',
    genres: ['Fiction', 'Children\'s'],
    description: 'The tale of a pig named Wilbur and his friendship with a barn spider named Charlotte. A classic story of friendship, love, and the cycle of life on a farm.',
    liked: true,
  },
  {
    title: 'The One and Only Ivan',
    author: 'Katherine Applegate',
    genres: ['Fiction', 'Children\'s', 'Sci-Fi'],
    description: 'Inspired by a real gorilla, this is the story of Ivan, a gorilla who has lived for years in a cage at a mall. He barely remembers his old life in the jungle.',
    liked: false,
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    genres: ['Fantasy', 'Fiction'],
    description: 'Bilbo Baggins is a hobbit who enjoys a comfortable life, rarely traveling far from home. But his contentment is disturbed when Gandalf and thirteen dwarves arrive at his door.',
    liked: false,
  },
];

function createSampleBooks(): Book[] {
  return SAMPLE_BOOKS.map((b) => ({
    ...b,
    id: nanoid(),
    createdAt: Date.now(),
    keywords: extractKeywords(b.description),
  }));
}

export const useBookStore = create<BookState>()(
  persist(
    (set, get) => ({
      books: createSampleBooks(),

      addBook: (bookData) => {
        const book: Book = {
          ...bookData,
          id: nanoid(),
          createdAt: Date.now(),
          keywords: extractKeywords(bookData.description),
        };
        set((state) => ({ books: [...state.books, book] }));
      },

      updateBook: (id, updates) => {
        set((state) => ({
          books: state.books.map((b) => {
            if (b.id !== id) return b;
            const updated = { ...b, ...updates };
            if (updates.description !== undefined) {
              updated.keywords = extractKeywords(updates.description);
            }
            return updated;
          }),
        }));
      },

      deleteBook: (id) => {
        set((state) => ({ books: state.books.filter((b) => b.id !== id) }));
      },

      toggleLike: (id) => {
        set((state) => ({
          books: state.books.map((b) =>
            b.id === id ? { ...b, liked: !b.liked } : b
          ),
        }));
      },

      getRecommendations: () => {
        const { books } = get();
        const likedBooks = books.filter((b) => b.liked);
        const unlikedBooks = books.filter((b) => !b.liked);

        if (likedBooks.length === 0 || unlikedBooks.length === 0) return [];

        const adjacency = buildGraph(books);

        const recommendations: Recommendation[] = unlikedBooks.map((book) => {
          const reasonsMap = new Map<string, RecommendationReason>();
          let totalScore = 0;

          for (const liked of likedBooks) {
            const weight = adjacency.get(book.id)?.get(liked.id) ?? 0;
            if (weight === 0) continue;

            totalScore += weight;

            // Same author
            if (
              book.author.trim().toLowerCase() === liked.author.trim().toLowerCase() &&
              book.author.trim()
            ) {
              const key = `author:${book.author.toLowerCase()}`;
              if (!reasonsMap.has(key)) {
                reasonsMap.set(key, {
                  type: 'author',
                  value: book.author,
                  connectedTo: [liked],
                });
              } else {
                reasonsMap.get(key)!.connectedTo.push(liked);
              }
            }

            // Shared genres
            for (const genre of book.genres) {
              if (liked.genres.map((g) => g.toLowerCase()).includes(genre.toLowerCase())) {
                const key = `genre:${genre.toLowerCase()}`;
                if (!reasonsMap.has(key)) {
                  reasonsMap.set(key, {
                    type: 'genre',
                    value: genre,
                    connectedTo: [liked],
                  });
                } else {
                  reasonsMap.get(key)!.connectedTo.push(liked);
                }
              }
            }

            // Shared keywords (top 3 per book pair)
            const shared = book.keywords.filter((k) => liked.keywords.includes(k));
            for (const kw of shared.slice(0, 3)) {
              const key = `keyword:${kw}`;
              if (!reasonsMap.has(key)) {
                reasonsMap.set(key, {
                  type: 'keyword',
                  value: kw,
                  connectedTo: [liked],
                });
              } else if (!reasonsMap.get(key)!.connectedTo.find((b) => b.id === liked.id)) {
                reasonsMap.get(key)!.connectedTo.push(liked);
              }
            }
          }

          const reasons = Array.from(reasonsMap.values()).sort((a, b) => {
            const order = { author: 0, genre: 1, keyword: 2 };
            return order[a.type] - order[b.type];
          });

          return { book, score: totalScore, reasons };
        });

        return recommendations
          .filter((r) => r.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);
      },
    }),
    { name: 'bookgraph_state' }
  )
);