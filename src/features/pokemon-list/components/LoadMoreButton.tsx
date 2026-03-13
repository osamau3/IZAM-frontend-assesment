import { memo } from 'react';
import './LoadMoreButton.css';

interface LoadMoreButtonProps {
  onLoadMore: () => void;
  isFetching: boolean;
  totalShown: number;
}

/**
 * "Load More" button for the infinite scroll variant.
 *
 * Why React.memo: Prevents re-renders when the grid above it updates
 * (e.g., new cards animating in). Only re-renders when isFetching
 * or totalShown actually change.
 */
function LoadMoreButtonInner({
  onLoadMore,
  isFetching,
  totalShown,
}: LoadMoreButtonProps) {
  return (
    <div className="load-more" id="load-more-section">
      {isFetching ? (
        <div className="load-more__loading">
          <div className="load-more__spinner" />
          <span>Loading more Pokémon...</span>
        </div>
      ) : (
        <button
          className="load-more__btn"
          onClick={onLoadMore}
          type="button"
          id="load-more-button"
        >
          Load More
        </button>
      )}
      <p className="load-more__count">Showing {totalShown} Pokémon</p>
    </div>
  );
}

export const LoadMoreButton = memo(LoadMoreButtonInner);
