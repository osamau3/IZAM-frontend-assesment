import './DetailSkeleton.css';

/**
 * Full-page skeleton loader for the detail page.
 * Matches the detail layout: gradient header, sprite, stats.
 */
export function DetailSkeleton() {
  return (
    <div className="detail-skeleton" aria-hidden="true">
      <div className="detail-skeleton__header skeleton-pulse" />
      <div className="detail-skeleton__body">
        <div className="detail-skeleton__left">
          <div className="detail-skeleton__sprite skeleton-pulse" />
          <div className="detail-skeleton__badges">
            <div className="detail-skeleton__badge skeleton-pulse" />
            <div className="detail-skeleton__badge skeleton-pulse" />
          </div>
        </div>
        <div className="detail-skeleton__right">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="detail-skeleton__stat skeleton-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
