import './SkeletonCard.css';

/**
 * Skeleton loader matching the PokemonCard layout.
 *
 * Why skeleton over spinner: Skeletons provide structural hints about
 * the content being loaded, reducing perceived wait time and preventing
 * layout shifts (CLS) when real cards render.
 */
export function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton-card__sprite skeleton-pulse" />
      <div className="skeleton-card__name skeleton-pulse" />
      <div className="skeleton-card__id skeleton-pulse" />
    </div>
  );
}
