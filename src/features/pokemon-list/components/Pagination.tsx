import { memo, useMemo, useCallback } from 'react';
import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  itemsShown: number;
  onPageChange: (page: number) => void;
}

/**
 * Pagination controls matching the reference design.
 *
 * Why React.memo + useMemo: The page number array is recomputed
 * on every render even when currentPage/totalPages haven't changed.
 * Memoizing both the component and the computation prevents wasteful
 * work during unrelated parent re-renders.
 */
function PaginationInner({
  currentPage,
  totalPages,
  totalCount,
  itemsShown,
  onPageChange,
}: PaginationProps) {
  /** Memoized page window computation — only recalculates when page or total changes */
  const pageNumbers = useMemo((): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) pages.push('...');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push('...');

    pages.push(totalPages);
    return pages;
  }, [currentPage, totalPages]);

  /** Stabilized callbacks to prevent child button re-renders */
  const handlePrev = useCallback(() => onPageChange(currentPage - 1), [onPageChange, currentPage]);
  const handleNext = useCallback(() => onPageChange(currentPage + 1), [onPageChange, currentPage]);

  return (
    <nav className="pagination" aria-label="Pokémon list pagination" id="pagination-controls">
      <div className="pagination__controls">
        <button
          className="pagination__btn pagination__btn--nav"
          onClick={handlePrev}
          disabled={currentPage === 1}
          aria-label="Previous page"
          id="pagination-prev"
        >
          ‹ Previous
        </button>

        <div className="pagination__pages">
          {pageNumbers.map((page, index) =>
            typeof page === 'string' ? (
              <span key={`ellipsis-${index}`} className="pagination__ellipsis">
                {page}
              </span>
            ) : (
              <button
                key={page}
                className={`pagination__btn pagination__btn--page ${
                  page === currentPage ? 'pagination__btn--active' : ''
                }`}
                onClick={() => onPageChange(page)}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
                id={`pagination-page-${page}`}
              >
                {page}
              </button>
            )
          )}
        </div>

        <button
          className="pagination__btn pagination__btn--nav"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          id="pagination-next"
        >
          Next ›
        </button>
      </div>

      <p className="pagination__info">
        Page {currentPage} of {totalPages} · {itemsShown} of {totalCount} Pokémon shown
      </p>
    </nav>
  );
}

export const Pagination = memo(PaginationInner);
