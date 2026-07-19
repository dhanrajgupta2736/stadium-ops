import { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * React Error Boundary that catches render-time errors in its subtree.
 * Prevents the entire application from crashing when a single component
 * fails, instead displaying a user-friendly fallback UI with the option
 * to recover by resetting state.
 *
 * @see https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // In production, this would forward to an external monitoring service
    // such as Sentry, Datadog, or a custom telemetry endpoint.
    /* eslint-disable-next-line no-console */
    console.error('[ErrorBoundary] Uncaught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="flex min-h-screen flex-col items-center justify-center bg-base p-8 text-center"
        >
          <div className="max-w-md rounded-lg border border-critical/30 bg-panel p-8">
            <h1 className="font-display text-2xl uppercase tracking-wide text-critical">
              System Error
            </h1>
            <p className="mt-3 text-sm text-ink-muted leading-relaxed">
              An unexpected error occurred in the Stadium Command Center.
              Operations data is safe. Reload to restore the dashboard.
            </p>
            {this.state.error && (
              <pre className="mt-4 max-h-24 overflow-auto rounded border border-line bg-surface p-3 text-left font-mono text-[10px] text-critical/80">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleReset}
              className="mt-6 rounded bg-accent px-6 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-panel transition-colors hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              Attempt Recovery
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};
