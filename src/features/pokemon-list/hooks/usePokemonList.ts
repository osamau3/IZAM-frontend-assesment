import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { fetchPokemonList } from '../../../services/pokemonApi';

const ITEMS_PER_PAGE = 20;

/**
 * Hook for paginated Pokémon list (Page Controls mode).
 *
 * Why `placeholderData: keepPreviousData`: Prevents flash of empty content
 * while navigating between pages. The old data stays visible until the
 * new page finishes loading, creating a smoother UX.
 */
export function usePokemonList(page: number) {
  return useQuery({
    queryKey: ['pokemon-list', page],
    queryFn: () => fetchPokemonList(ITEMS_PER_PAGE, (page - 1) * ITEMS_PER_PAGE),
    staleTime: 5 * 60 * 1000, // 5 minutes — PokéAPI data is static
  });
}

/**
 * Hook for infinite-scroll Pokémon list (Load More mode).
 *
 * Why `useInfiniteQuery`: React Query natively manages the "append next page"
 * pattern, deduplicates requests, and caches each page independently.
 */
export function usePokemonInfiniteList() {
  return useInfiniteQuery({
    queryKey: ['pokemon-infinite'],
    queryFn: ({ pageParam = 0 }) => fetchPokemonList(ITEMS_PER_PAGE, pageParam),
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next);
      return parseInt(url.searchParams.get('offset') || '0', 10);
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
  });
}

export { ITEMS_PER_PAGE };
