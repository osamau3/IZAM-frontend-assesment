import { useQuery } from '@tanstack/react-query';
import { fetchPokemonDetail } from '../../../services/pokemonApi';

/**
 * Hook for fetching a single Pokémon's full detail.
 *
 * Why separate hook: Isolates the detail-page data concern so the
 * component can focus purely on presentation. Also enables React Query's
 * automatic caching — navigating back to the same Pokémon is instant.
 */
export function usePokemonDetail(id: string) {
  return useQuery({
    queryKey: ['pokemon-detail', id],
    queryFn: () => fetchPokemonDetail(id),
    staleTime: 10 * 60 * 1000, // 10 minutes — detail data rarely changes
    enabled: !!id,
  });
}
