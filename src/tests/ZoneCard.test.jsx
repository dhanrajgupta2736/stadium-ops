import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ZoneCard from '../components/dashboard/ZoneCard';
import { translate } from '../i18n/dictionaries';
import { LOCALES } from '../i18n/dictionaries';

const t = (key, params) => translate(LOCALES.EN, key, params);

function makeZone(overrides) {
  return {
    id: 'zone-1',
    label: 'Gate A',
    category: 'gate',
    capacityLimit: 1200,
    densityPercent: 50,
    waitMinutes: 5,
    status: 'safe',
    lastUpdatedAt: Date.now(),
    ...overrides,
  };
}

describe('ZoneCard', () => {
  it('renders 0% density without error', () => {
    render(<ZoneCard zone={makeZone({ densityPercent: 0, waitMinutes: 0, status: 'safe' })} t={t} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('renders an over-capacity (120%) zone with critical status', () => {
    render(<ZoneCard zone={makeZone({ densityPercent: 120, waitMinutes: 0, status: 'critical' })} t={t} />);
    expect(screen.getByText('120%')).toBeInTheDocument();
    expect(screen.getByText('Critical')).toBeInTheDocument();
  });

  it('hides the wait-time row when wait is 0', () => {
    render(<ZoneCard zone={makeZone({ waitMinutes: 0 })} t={t} />);
    expect(screen.queryByText(/min$/)).not.toBeInTheDocument();
  });

  it('shows the wait-time row when wait is greater than 0', () => {
    render(<ZoneCard zone={makeZone({ waitMinutes: 27 })} t={t} />);
    expect(screen.getByText('27 min')).toBeInTheDocument();
  });

  it('exposes an accessible label combining zone name and status', () => {
    render(<ZoneCard zone={makeZone({ label: 'Concourse B', status: 'warning' })} t={t} />);
    expect(screen.getByRole('article', { name: 'Concourse B: Approaching Threshold' })).toBeInTheDocument();
  });
});
