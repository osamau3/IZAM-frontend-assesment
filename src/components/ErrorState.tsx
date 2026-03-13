import './ErrorState.css';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

/**
 * Reusable error display with retry button.
 *
 * Why extracted into a shared component: Both the list and detail pages
 * require identical error-handling UX (error message + retry CTA), so
 * this prevents duplication and ensures consistent behavior.
 */
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="error-state" role="alert">
      <div className="error-state__icon">⚠️</div>
      <h2 className="error-state__title">Something went wrong</h2>
      <p className="error-state__message">{message}</p>
      <button
        className="error-state__retry-btn"
        onClick={onRetry}
        type="button"
        id="retry-button"
      >
        Try Again
      </button>
    </div>
  );
}
