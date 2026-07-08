import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import IncidentForm from '../components/incidents/IncidentForm';
import { translate, LOCALES } from '../i18n/dictionaries';

const t = (key, params) => translate(LOCALES.EN, key, params);

const zones = [
  { id: 'gate-a', label: 'Gate A', category: 'gate', capacityLimit: 1200, densityPercent: 40, waitMinutes: 5, status: 'safe', lastUpdatedAt: Date.now() },
];

describe('IncidentForm accessibility', () => {
  it('associates a label with the incident type select', () => {
    render(
      <IncidentForm
        formState={{ incidentType: 'medical', zoneLabel: 'Gate A', description: '' }}
        updateField={vi.fn()}
        submitForm={vi.fn()}
        zones={zones}
        t={t}
      />
    );
    expect(screen.getByLabelText('Incident Type')).toBeInTheDocument();
  });

  it('associates a label with the zone select', () => {
    render(
      <IncidentForm
        formState={{ incidentType: 'medical', zoneLabel: 'Gate A', description: '' }}
        updateField={vi.fn()}
        submitForm={vi.fn()}
        zones={zones}
        t={t}
      />
    );
    expect(screen.getByLabelText('Zone')).toBeInTheDocument();
  });

  it('associates a label with the description textarea', () => {
    render(
      <IncidentForm
        formState={{ incidentType: 'medical', zoneLabel: 'Gate A', description: '' }}
        updateField={vi.fn()}
        submitForm={vi.fn()}
        zones={zones}
        t={t}
      />
    );
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
  });

  it('renders a submit button reachable by role', () => {
    render(
      <IncidentForm
        formState={{ incidentType: 'medical', zoneLabel: 'Gate A', description: '' }}
        updateField={vi.fn()}
        submitForm={vi.fn()}
        zones={zones}
        t={t}
      />
    );
    expect(screen.getByRole('button', { name: 'Log Incident' })).toBeInTheDocument();
  });
});
