# BookGraph

> Every book leads to the next.

A personal book recommendation engine built as a similarity graph. Add books you've read, mark them as liked, and BookGraph builds a web of connections between them — by shared author, genre, and description keywords — then surfaces the best matches.

## Features

- **Add Books** — Title, author, genres (predefined + custom), and an optional description
- **Like Books** — Mark books as liked to train the recommendation engine
- **Smart Recommendations** — Graph-based engine ranks unliked books by similarity to your liked collection
- **Why Recommendations?** — Each suggestion shows exactly why it was recommended (shared author, genre, or keywords)
- **Filter & Search** — Filter your library by genre or liked status
- **Edit & Delete** — Full CRUD on every book via detail modal
- **Persistence** — All data saved to localStorage automatically
- **Sample Data** — Ships with a few pre-loaded books to demonstrate the graph

## The Recommendation Graph

Books are connected by edges weighted by similarity:

| Connection | Weight |
|------------|--------|
| Same author | +0.5 |
| Shared genre | +0.3 per genre |
| Shared keyword (from description) | +0.1 per keyword (max 0.4) |

Edge weight between any two books is capped at 1.0. A book's recommendation score is the sum of all edge weights to your liked books.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | Zustand (with localStorage persistence) |
| Icons | Lucide React |
| Fonts | Merriweather (headings) + Inter (UI) |

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
bookgraph/
├── app/
│   ├── layout.tsx       # Root layout with fonts
│   ├── page.tsx          # Main page
│   └── globals.css       # Tailwind + CSS variables
├── components/
│   ├── TopHeader.tsx           # Header + Add Book button
│   ├── LibraryGrid.tsx         # Book grid with filtering
│   ├── BookCard.tsx            # Individual book card
│   ├── AddBookModal.tsx        # Add new book form
│   ├── BookDetailModal.tsx     # View/edit/delete book
│   └── RecommendationsPanel.tsx # Graph recommendations sidebar
├── lib/
│   ├── types.ts         # TypeScript interfaces
│   ├── store.ts         # Zustand store + all mutations
│   ├── graph.ts         # Similarity computation
│   └── genres.ts        # Predefined genre list
└── SPEC.md              # Full design specification
```

## Design

- **Aesthetic**: Literary warmth — warm off-white (`#FAF8F5`) with amber accent (`#D97706`)
- **Fonts**: Merriweather (serif) for book titles, Inter for UI
- **Recommendations panel**: Sticky sidebar that updates live as you like books
- **Animations**: Staggered fade-in on book cards, smooth hover lifts

## License

MIT