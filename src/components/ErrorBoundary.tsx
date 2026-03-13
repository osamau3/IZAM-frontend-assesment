import { Component, type ReactNode } from 'react';
import './ErrorBoundary.css';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Optional fallback UI; defaults to an internal error card */
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * React Error Boundary — catches unhandled runtime errors in the
 * component tree and renders a recovery UI instead of a white screen.
 *
 * Why a class component: React does not yet expose error boundary
 * lifecycle hooks (componentDidCatch / getDerivedStateFromError) to
 * function components. This is the only sanctioned approach as of
 * React 19.
 *
 * @see https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // In production, forward to an error tracking service (e.g. Sentry)
    console.error('[ErrorBoundary] Caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="error-boundary" role="alert" id="error-boundary">
          <div className="error-boundary__card">
            <div className="error-boundary__icon">💥</div>
            <h2 className="error-boundary__title">Oops! Something crashed</h2>
            <p className="error-boundary__message">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <button
              className="error-boundary__btn"
              onClick={this.handleReset}
              type="button"
              id="error-boundary-reset"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
