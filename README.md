# ✨ Pokédex Browser

A responsive Pokémon browser built with **React 19**, **TypeScript**, and **Vite** — featuring grid views, pagination, infinite scroll, and detailed Pokémon profiles.

## 🚀 Live Demo

> **[View Live →](https://izam-frontend-assesment.vercel.app)** 

## 📸 Screenshots

| Grid View | Detail Page |
|---|---|
| 4-column responsive grid with official artwork | Gradient header, stats bars, type badges, abilities |

## 🛠 Tech Stack

- **React 19** + **TypeScript** (strict mode)
- **Vite** — build tooling with HMR
- **React Router v7** — client-side routing
- **TanStack React Query** — data fetching, caching, infinite queries
- **Framer Motion** — animations and page transitions
- **Vanilla CSS** — custom properties design system

## ✅ Features

### Core
- **Grid view** with 4-column responsive layout (desktop → 2-column mobile)
- **Pagination** with sliding page window and ellipsis
- **Infinite Scroll** with Load More button and item counter
- **Detail page** (`/pokemon/:id`) — separate route with:
  - Gradient header (purple → pink) with Pokémon name & ID
  - Official artwork sprite
  - Color-coded type badges
  - Height & weight display
  - Animated base stats progress bars
  - Abilities list (with hidden ability tags)
  - Base experience highlight
- **Loading states** — skeleton loaders matching page layout
- **Error states** — error display with retry mechanism
- **Responsive design** — desktop, tablet, mobile

### Bonus
- ✅ **React Query** — caching, stale time, `useInfiniteQuery`
- ✅ **React Suspense** — `<Suspense>` with skeleton fallbacks for lazy-loaded routes
- ✅ **Error Boundaries** — class component catching runtime errors with recovery UI
- ✅ **Code Splitting** — `React.lazy` for route-based chunking

### Performance Optimizations
- `React.memo` on 5 leaf components (PokemonCard, Pagination, LoadMoreButton, TypeBadge, StatBar)
- `useCallback` on all event handlers passed to memoized children
- `useMemo` for computed values (pagination meta, stat percentages, skeleton arrays)
- Lazy image loading with `loading="lazy"`

## 📁 Project Structure

```
src/
├── features/
│   ├── pokemon-list/          # Grid view + pagination + infinite scroll
│   │   ├── components/        # PokemonCard, SkeletonCard, Pagination, LoadMoreButton
│   │   ├── hooks/             # usePokemonList, usePokemonInfiniteList
│   │   └── PokemonListPage.tsx
│   └── pokemon-detail/        # Detail page with stats, types, abilities
│       ├── components/        # TypeBadge, StatBar, DetailSkeleton
│       ├── hooks/             # usePokemonDetail
│       └── PokemonDetailPage.tsx
├── services/pokemonApi.ts     # PokéAPI service layer
├── types/pokemon.ts           # Shared TypeScript interfaces
├── components/                # Shared components (ErrorState, ErrorBoundary)
├── App.tsx                    # Router + Suspense + ErrorBoundary
├── main.tsx                   # Entry point + QueryClientProvider
└── index.css                  # Design system (CSS custom properties)
```

## 🏃 Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📡 API

Uses the public [PokéAPI](https://pokeapi.co/):
- `GET /api/v2/pokemon?limit=20&offset=0` — paginated list
- `GET /api/v2/pokemon/{id}` — individual Pokémon details

## 📄 License

MIT
