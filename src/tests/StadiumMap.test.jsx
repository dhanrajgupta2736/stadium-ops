import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StadiumMap from '../components/dashboard/StadiumMap';
import { translate, LOCALES } from '../i18n/dictionaries';

const t = (key, params) => translate(LOCALES.EN, key, params);

const mockZones = [
  { id: 'gate-a', label: 'Gate A', category: 'gate', capacityLimit: 1000, densityPercent: 60, waitMinutes: 10, status: 'safe', lastUpdatedAt: Date.now() },
  { id: 'concourse-b', label: 'Concourse B', category: 'concourse', capacityLimit: 2000, densityPercent: 96, waitMinutes: 0, status: 'critical', lastUpdatedAt: Date.now() },
  { id: 'seating-lower', label: 'Seating — Lower Bowl', category: 'seating', capacityLimit: 15000, densityPercent: 88, waitMinutes: 0, status: 'warning', lastUpdatedAt: Date.now() }
];

describe('StadiumMap', () => {
  it('renders the SVG map and label strings', () => {
    render(<StadiumMap zones={mockZones} t={t} />);
    expect(screen.getByText('Stadium Layout Map')).toBeInTheDocument();
    expect(screen.getByText('Gate A')).toBeInTheDocument();
    expect(screen.getByText('Concourse B')).toBeInTheDocument();
  });

  it('displays default placeholder select message', () => {
    render(<StadiumMap zones={mockZones} t={t} />);
    expect(screen.getByText('Click on a zone sector above to inspect details')).toBeInTheDocument();
  });

  it('displays details when clicking a zone sector', () => {
    render(<StadiumMap zones={mockZones} t={t} />);
    const gateAButton = screen.getByRole('button', { name: /Gate A, status: safe, density: 60%/ });
    
    fireEvent.click(gateAButton);
    
    expect(screen.getAllByText('Gate A').length).toBeGreaterThan(0);
    expect(screen.getByText(/Density/)).toBeInTheDocument();
    expect(screen.getByText(/60%/)).toBeInTheDocument();
    expect(screen.getByText(/10 min/)).toBeInTheDocument();
  });

  it('selects a zone via keyboard Enter/Space key', () => {
    render(<StadiumMap zones={mockZones} t={t} />);
    const concourseBButton = screen.getByRole('button', { name: /Concourse B, status: critical, density: 96%/ });
    
    fireEvent.keyDown(concourseBButton, { key: 'Enter', code: 'Enter' });
    expect(screen.getAllByText('Concourse B').length).toBeGreaterThan(0);
    expect(screen.getByText('Critical')).toBeInTheDocument();
    expect(screen.getByText('96%')).toBeInTheDocument();
  });
});
