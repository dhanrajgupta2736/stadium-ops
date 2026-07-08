import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIncidentLog } from '../hooks/useIncidentLog';

describe('useIncidentLog', () => {
  it('starts with an empty incident list', () => {
    const { result } = renderHook(() => useIncidentLog());
    expect(result.current.incidents).toEqual([]);
  });

  it('rejects a submission with an empty description', () => {
    const { result } = renderHook(() => useIncidentLog());
    act(() => {
      const outcome = result.current.logIncident({
        incidentType: 'medical',
        zoneLabel: 'Gate A',
        description: '   ',
      });
      expect(outcome.success).toBe(false);
    });
    expect(result.current.incidents).toHaveLength(0);
  });

  it('rejects a submission missing a zone label', () => {
    const { result } = renderHook(() => useIncidentLog());
    act(() => {
      const outcome = result.current.logIncident({
        incidentType: 'medical',
        zoneLabel: '',
        description: 'Fan requires assistance near section 12',
      });
      expect(outcome.success).toBe(false);
    });
    expect(result.current.incidents).toHaveLength(0);
  });

  it('accepts a valid submission and prepends it to the list', () => {
    const { result } = renderHook(() => useIncidentLog());
    act(() => {
      result.current.logIncident({
        incidentType: 'blockage',
        zoneLabel: 'Gate B',
        description: 'Barrier fallen across entry lane',
      });
    });
    expect(result.current.incidents).toHaveLength(1);
    expect(result.current.incidents[0].zoneLabel).toBe('Gate B');
    expect(result.current.incidents[0].protocolKey).toBe('incidentProtocolBlockage');
  });

  it('places the most recent incident first', () => {
    const { result } = renderHook(() => useIncidentLog());
    act(() => {
      result.current.logIncident({ incidentType: 'medical', zoneLabel: 'Gate A', description: 'first' });
    });
    act(() => {
      result.current.logIncident({ incidentType: 'medical', zoneLabel: 'Gate A', description: 'second' });
    });
    expect(result.current.incidents[0].description).toBe('second');
    expect(result.current.incidents[1].description).toBe('first');
  });
});
