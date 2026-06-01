export interface Book {
  id: string;
  title: string;
  author: string;
  genres: string[];
  description: string;
  liked: boolean;
  createdAt: number;
  keywords: string[];
}

export interface GraphEdge {
  from: string; // book id
  to: string;   // book id
  weight: number;
}

export interface Graph {
  nodes: Set<string>;    // book ids
  edges: GraphEdge[];
  // adjacency map for fast lookup
  adjacency: Map<string, Map<string, number>>;
}

export interface Recommendation {
  book: Book;
  score: number;
  reasons: RecommendationReason[];
}

export interface RecommendationReason {
  type: 'genre' | 'author' | 'keyword';
  value: string;
  connectedTo: Book[]; // liked books that share this
}