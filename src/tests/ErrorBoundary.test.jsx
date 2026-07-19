import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../components/layout/ErrorBoundary';

function ProblematicComponent({ shouldThrow }) {
  if (shouldThrow) {
    throw new Error('Test render failure');
  }
  return <div>Component loaded normally</div>;
}

function TestHarness() {
  const [shouldThrow, setShouldThrow] = useState(true);
  return (
    <div>
      <button onClick={() => setShouldThrow(false)}>Fix Error</button>
      <ErrorBoundary>
        <ProblematicComponent shouldThrow={shouldThrow} />
      </ErrorBoundary>
    </div>
  );
}

describe('ErrorBoundary', () => {
  /* eslint-disable no-console */
  const originalError = console.error;
  beforeEach(() => {
    console.error = vi.fn();
  });
  afterEach(() => {
    console.error = originalError;
  });
  /* eslint-enable no-console */

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <ProblematicComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Component loaded normally')).toBeInTheDocument();
  });

  it('catches render error and displays fallback UI', () => {
    render(
      <ErrorBoundary>
        <ProblematicComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('System Error')).toBeInTheDocument();
    expect(screen.getByText(/Test render failure/)).toBeInTheDocument();
  });

  it('allows user to attempt recovery via button', () => {
    render(<TestHarness />);

    expect(screen.getByText('System Error')).toBeInTheDocument();

    // First fix the underlying condition
    fireEvent.click(screen.getByText('Fix Error'));

    // Then click attempt recovery on the boundary
    const recoveryBtn = screen.getByRole('button', { name: /Attempt Recovery/i });
    fireEvent.click(recoveryBtn);

    expect(screen.getByText('Component loaded normally')).toBeInTheDocument();
  });
});
