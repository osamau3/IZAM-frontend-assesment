import { useState, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { usePokemonList, usePokemonInfiniteList, ITEMS_PER_PAGE } from './hooks/usePokemonList';
import { extractIdFromUrl } from '../../services/pokemonApi';
import type { PokemonListItem } from '../../types/pokemon';
import { PokemonCard } from './components/PokemonCard';
import { SkeletonCard } from './components/SkeletonCard';
import { Pagination } from './components/Pagination';
import { LoadMoreButton } from './components/LoadMoreButton';
import { ErrorState } from '../../components/ErrorState';
import './PokemonListPage.css';

type ViewMode = 'pagination' | 'infinite';

/**
 * Main Pokémon list page with two view modes.
 *
 * Why useCallback for handlers: `handlePageChange` and `handleLoadMore`
 * are passed as props to memoized children (`Pagination`, `LoadMoreButton`).
 * Without stable references, every parent re-render would invalidate the
 * child's memo gate, defeating the optimization entirely.
 */
export function PokemonListPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('pagination');
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination mode query
  const paginatedQuery = usePokemonList(currentPage);

  // Infinite scroll mode query
  const infiniteQuery = usePokemonInfiniteList();

  /**
   * useCallback: Stabilized page change handler — prevents Pagination
   * from re-rendering when unrelated state (e.g., viewMode) changes.
   */
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  /**
   * useCallback: Stabilized load more handler — ensures LoadMoreButton
   * doesn't re-render when the grid above it appends new cards.
   */
  const handleLoadMore = useCallback(() => {
    infiniteQuery.fetchNextPage();
  }, [infiniteQuery.fetchNextPage]);

  /** useCallback: Stabilized error retry — prevents ErrorState re-renders */
  const handleRetry = useCallback(() => {
    if (viewMode === 'pagination') {
      paginatedQuery.refetch();
    } else {
      infiniteQuery.refetch();
    }
  }, [viewMode, paginatedQuery.refetch, infiniteQuery.refetch]);

  /** Determines which query is active based on the current view mode */
  const isLoading = viewMode === 'pagination' ? paginatedQuery.isLoading : infiniteQuery.isLoading;
  const isError = viewMode === 'pagination' ? paginatedQuery.isError : infiniteQuery.isError;
  const errorMessage = viewMode === 'pagination'
    ? paginatedQuery.error?.message
    : infiniteQuery.error?.message;

  /**
   * useMemo: Pre-compute pagination metadata only when data changes.
   * Avoids Math.ceil and Math.min recalculations on every render.
   */
  const paginationMeta = useMemo(() => {
    if (!paginatedQuery.data) return null;
    return {
      totalPages: Math.ceil(paginatedQuery.data.count / ITEMS_PER_PAGE),
      totalCount: paginatedQuery.data.count,
      itemsShown: Math.min(currentPage * ITEMS_PER_PAGE, paginatedQuery.data.count),
    };
  }, [paginatedQuery.data, currentPage]);

  /**
   * useMemo: Pre-compute total shown count for infinite mode to avoid
   * reduce() on every render cycle.
   */
  const infiniteTotalShown = useMemo(() => {
    if (!infiniteQuery.data) return 0;
    return infiniteQuery.data.pages.reduce((acc, page) => acc + page.results.length, 0);
  }, [infiniteQuery.data]);

  /**
   * useMemo: Skeleton array — stable reference prevents re-creating
   * 20 skeleton elements on every render.
   */
  const skeletons = useMemo(
    () => Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
      <SkeletonCard key={`skeleton-${i}`} />
    )),
    []
  );

  return (
    <div className="list-page" id="pokemon-list-page">
      {/* Header */}
      <header className="list-page__header">
        <h1 className="list-page__title">✨ Pokédex</h1>
        <p className="list-page__subtitle">
          Discover and explore Pokémon with {viewMode === 'pagination' ? 'page controls' : 'infinite scroll'}
        </p>

        {/* View mode toggle */}
        <div className="list-page__toggle" role="tablist" aria-label="View mode" id="view-mode-toggle">
          <button
            className={`list-page__toggle-btn ${viewMode === 'pagination' ? 'list-page__toggle-btn--active' : ''}`}
            onClick={() => handleViewModeChange('pagination')}
            role="tab"
            aria-selected={viewMode === 'pagination'}
            id="toggle-pagination"
          >
            Page Controls
          </button>
          <button
            className={`list-page__toggle-btn ${viewMode === 'infinite' ? 'list-page__toggle-btn--active' : ''}`}
            onClick={() => handleViewModeChange('infinite')}
            role="tab"
            aria-selected={viewMode === 'infinite'}
            id="toggle-infinite"
          >
            Infinite Scroll
          </button>
        </div>
      </header>

      {/* Error State */}
      {isError && (
        <ErrorState
          message={errorMessage || 'Failed to load Pokémon. Please check your connection.'}
          onRetry={handleRetry}
        />
      )}

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="list-page__grid" aria-busy="true" aria-label="Loading Pokémon">
          {skeletons}
        </div>
      )}

      {/* Pagination Mode */}
      {!isLoading && !isError && viewMode === 'pagination' && paginatedQuery.data && paginationMeta && (
        <>
          <div className="list-page__grid" id="pokemon-grid">
            <AnimatePresence mode="wait">
              {paginatedQuery.data.results.map((pokemon: PokemonListItem) => {
                const id = extractIdFromUrl(pokemon.url);
                return (
                  <PokemonCard
                    key={pokemon.name}
                    id={id}
                    name={pokemon.name}
                  />
                );
              })}
            </AnimatePresence>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={paginationMeta.totalPages}
            totalCount={paginationMeta.totalCount}
            itemsShown={paginationMeta.itemsShown}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Infinite Scroll Mode */}
      {!isLoading && !isError && viewMode === 'infinite' && infiniteQuery.data && (
        <>
          <div className="list-page__grid" id="pokemon-grid-infinite">
            <AnimatePresence>
              {infiniteQuery.data.pages.flatMap((page) =>
                page.results.map((pokemon: PokemonListItem) => {
                  const id = extractIdFromUrl(pokemon.url);
                  return (
                    <PokemonCard
                      key={pokemon.name}
                      id={id}
                      name={pokemon.name}
                    />
                  );
                })
              )}
            </AnimatePresence>
          </div>

          {infiniteQuery.hasNextPage && (
            <LoadMoreButton
              onLoadMore={handleLoadMore}
              isFetching={infiniteQuery.isFetchingNextPage}
              totalShown={infiniteTotalShown}
            />
          )}

          {!infiniteQuery.hasNextPage && (
            <p className="list-page__end-message">
              Showing all {infiniteTotalShown} Pokémon
            </p>
          )}
        </>
      )}
    </div>
  );
}
