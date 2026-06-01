/**
 * Extract keywords from a description.
 * Takes 3+ letter words, lowercases them.
 */
export function extractKeywords(description: string): string[] {
  if (!description.trim()) return [];
  const words = description
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3);
  return [...new Set(words)];
}

/**
 * Build the similarity graph between all books.
 * Returns an adjacency map: bookId -> Map<bookId, weight>
 */
export function buildGraph(books: { id: string; author: string; genres: string[]; keywords: string[] }[]): Map<string, Map<string, number>> {
  const adjacency = new Map<string, Map<string, number>>();

  // Initialize
  for (const book of books) {
    adjacency.set(book.id, new Map());
  }

  // Compare every pair
  for (let i = 0; i < books.length; i++) {
    for (let j = i + 1; j < books.length; j++) {
      const a = books[i];
      const b = books[j];
      const weight = computeSimilarity(a, b);

      if (weight > 0) {
        adjacency.get(a.id)!.set(b.id, weight);
        adjacency.get(b.id)!.set(a.id, weight);
      }
    }
  }

  return adjacency;
}

/**
 * Compute similarity weight between two books (0 to 1).
 */
export function computeSimilarity(
  a: { author: string; genres: string[]; keywords: string[] },
  b: { author: string; genres: string[]; keywords: string[] }
): number {
  let score = 0;

  // Same author: +0.5
  if (a.author.trim().toLowerCase() === b.author.trim().toLowerCase() && a.author.trim()) {
    score += 0.5;
  }

  // Shared genres: +0.3 per shared genre
  const sharedGenres = a.genres.filter((g) =>
    b.genres.map((g2) => g2.toLowerCase()).includes(g.toLowerCase())
  );
  score += sharedGenres.length * 0.3;

  // Shared keywords: +0.1 per shared keyword
  const sharedKeywords = a.keywords.filter((k) => b.keywords.includes(k));
  score += Math.min(sharedKeywords.length * 0.1, 0.4); // cap keyword contribution

  return Math.min(score, 1.0);
}