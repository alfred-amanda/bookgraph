# BookGraph — Recommendation Engine MVP

## 1. Concept & Vision

BookGraph is a personal book recommendation engine built as a graph. You add books you've read, mark them as liked, and the app builds a similarity network — books connected by genre, author, and description keywords. It then recommends new books from the graph's edges. It feels like your own private librarian who remembers everything you've read and what connects them.

**Name**: BookGraph
**Tagline**: "Every book leads to the next."

---

## 2. Design Language

### Aesthetic Direction
Literary warmth meets data visualization. Think a well-loved independent bookstore crossed with a clean graph diagram. Warm paper tones with a rich amber accent. Feels curated, not algorithmic.

### Color Palette
| Role | Hex | Usage |
|------|-----|-------|
| Background | `#FAF8F5` | Page background (warm off-white) |
| Surface | `#FFFFFF` | Cards, panels, modals |
| Border | `#E8E2D9` | Dividers, card borders |
| Text Primary | `#1C1917` | Headings, titles |
| Text Secondary | `#78716C` | Labels, metadata, placeholders |
| Accent | `#D97706` | Primary actions, active states, graph edges |
| Accent Hover | `#B45309` | Button hover, link hover |
| Accent Light | `#FEF3C7` | Highlight backgrounds, tags |
| Graph Node | `#F59E0B` | Active/liked book nodes |
| Graph Edge | `#D1D5DB` | Similarity connections |
| Success | `#059669` | Liked/read indicators |
| Danger | `#DC2626` | Delete actions |

### Typography
- **Font**: Merriweather (serif) for headings + book titles — feels literary
- **Font**: Inter for body text and UI elements
- **Headings**: Merriweather 700
- **Body**: Inter 400
- **Scale**: 12px (labels), 14px (body), 16px (book title), 20px (section), 28px (page title)

### Spatial System
- Base unit: 8px
- Card padding: 16px
- Section gap: 32px
- Border radius: 8px (cards), 6px (inputs), 12px (modals)

### Motion Philosophy
- **Graph nodes**: pulse gently on hover, scale up when selected
- **Book cards**: fade in staggered on load, shadow lift on hover (150ms)
- **Recommendation panel**: slide in from right (300ms ease-out)
- **Add book**: fade + slide down (200ms)
- **Delete**: fade out (150ms)
- No jarring transitions — everything is smooth and deliberate

---

## 3. Layout & Structure

### Page Structure
```
[Top Header]
  - Logo ("BookGraph")
  - Tagline
  - "Add Book" button

[Main Content — 2 columns]
  Left (60%): [Library] book grid
  Right (40%): [Recommendations] panel (sticky)

[Add Book Modal — overlay]
```

### Top Header
- Centered, warm background with subtle bottom border
- "BookGraph" in Merriweather, accent color
- Tagline in secondary text below
- "Add Book" button right-aligned

### Library Grid (Left)
- 2-column responsive grid of book cards
- Each card shows: title, author, genres as tags, liked indicator
- Filter bar above: filter by genre tags or liked-only toggle
- Empty state: friendly message + prompt to add first book

### Recommendations Panel (Right)
- Sticky, stays in view as you scroll
- Shows top 5 recommended books ranked by score
- Each recommendation shows why (shared genres/authors with liked books)
- Score = sum of similarity weights to liked books
- Empty state when no liked books: "Like a book to get recommendations"

### Responsive
- Below 900px: panel moves below the library (stacked)
- Books remain 2 columns until very small screens

---

## 4. Features & Interactions

### Books
- **Add**: Click "Add Book" → modal with: Title, Author, Genre(s) (multi-select from predefined + custom), Description (optional)
- **Mark as Liked**: Heart icon on card. Toggle. When liked, book contributes to recommendations.
- **View Details**: Click card → opens book detail modal
- **Delete**: Inside detail modal → confirm → remove + remove from graph edges

### Recommendation Graph
- Each book is a **node** in an undirected weighted graph
- **Edges** connect books that share:
  - Same author: weight +0.5
  - Each shared genre: weight +0.3
  - Each shared keyword in description (3+ letter words, stemmed): weight +0.1
- Edge weight capped at 1.0 per pair
- **Recommendation score** for an unliked book = sum of edge weights to all liked books
- Recommendations sorted by score descending, show top 5

### Recommendation Insight
- Each recommended book shows which liked books it's connected to
- Shows the top 2 connection reasons (e.g. "Shared genre: Sci-Fi", "Same author")

### Filtering
- Filter by genre tag (click tag to filter, click again to clear)
- "Liked only" toggle filter

### Persistence
- All data stored in `localStorage` as JSON
- Key: `bookgraph_state`

---

## 5. Component Inventory

### `<TopHeader>`
- Logo + tagline centered
- "Add Book" button (accent color, right-aligned)
- Border-bottom: 1px solid border color

### `<LibraryGrid>`
- Filter bar: genre tag pills (multi-select), liked toggle
- Grid of `<BookCard>`
- Empty state with illustration prompt

### `<BookCard>`
- Surface background, border, rounded-md
- Title (Merriweather, semibold)
- Author (secondary text)
- Genre tags (small accent-light pills)
- Heart icon (liked indicator) — top right
- Hover: shadow lift
- Click: opens detail modal

### `<RecommendationsPanel>`
- Sticky sidebar
- Title: "Recommended for You"
- List of `<RecommendationItem>`
- Connection insight per item

### `<RecommendationItem>`
- Compact card
- Title + author
- Score bar (visual)
- Insight: "Because you liked X, Y"
- Click: opens book detail

### `<AddBookModal>`
- Overlay + backdrop
- Title input (required)
- Author input (required)
- Genre multi-select (predefined list + custom option)
- Description textarea (optional)
- Cancel / Save buttons

### `<BookDetailModal>`
- Full book info
- Edit capability (inline)
- Delete button (danger)
- Close on backdrop/Escape

### `<GenreTag>`
- Small pill with accent-light background
- Clickable for filtering

---

## 6. Technical Approach

### Stack
- **Framework**: Next.js 16 (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand (localStorage persistence)
- **Icons**: Lucide React
- **Fonts**: Merriweather + Inter via next/font

### Project Structure
```
bookgraph/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── TopHeader.tsx
│   ├── LibraryGrid.tsx
│   ├── BookCard.tsx
│   ├── RecommendationsPanel.tsx
│   ├── RecommendationItem.tsx
│   ├── AddBookModal.tsx
│   ├── BookDetailModal.tsx
│   ├── GenreTag.tsx
│   └── FilterBar.tsx
├── lib/
│   ├── types.ts
│   ├── store.ts
│   ├── graph.ts          # Recommendation graph logic
│   └── genres.ts         # Predefined genre list
├── SPEC.md
└── package.json
```

### Data Model
```typescript
interface Book {
  id: string;
  title: string;
  author: string;
  genres: string[];
  description: string;
  liked: boolean;
  createdAt: number;
  keywords: string[];  // extracted from description
}
```

### Predefined Genres
Fiction, Non-Fiction, Sci-Fi, Fantasy, Mystery, Thriller, Romance, Horror, Biography, Self-Help, History, Science, Philosophy, Business, Travel, Young Adult, Children's, Poetry, Graphic Novel

### Graph Algorithm (per iteration)

| Iteration | Features | Git Commit |
|-----------|---------|------------|
| 1 | SPEC + scaffold | `feat: scaffold BookGraph project` |
| 2 | Core types + store | `feat: add data model and Zustand store` |
| 3 | Add Book UI (modal, form, genres) | `feat: implement Add Book modal and form` |
| 4 | Library grid + book cards | `feat: build Library grid and book cards` |
| 5 | Book detail modal + edit/delete | `feat: add Book Detail modal with edit/delete` |
| 6 | Recommendation graph engine | `feat: add recommendation graph engine` |
| 7 | Recommendations panel UI | `feat: build Recommendations panel` |
| 8 | Filter bar + polish | `feat: add genre filter and polish` |
| 9 | README + final push | `docs: add README` |