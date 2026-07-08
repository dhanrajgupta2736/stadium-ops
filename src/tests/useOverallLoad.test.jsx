import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useOverallLoad } from '../hooks/useOverallLoad';

function makeZone(densityPercent, capacityLimit) {
  return {
    id: `zone-${densityPercent}-${capacityLimit}`,
    label: 'Zone',
    category: 'gate',
    capacityLimit,
    densityPercent,
    waitMinutes: 0,
    status: 'safe',
    lastUpdatedAt: Date.now(),
  };
}

describe('useOverallLoad', () => {
  it('returns 0 for an empty zone list', () => {
    const { result } = renderHook(() => useOverallLoad([]));
    expect(result.current).toBe(0);
  });

  it('returns the exact density when there is a single zone', () => {
    const { result } = renderHook(() => useOverallLoad([makeZone(64, 1000)]));
    expect(result.current).toBe(64);
  });

  it('weights larger-capacity zones more heavily in the aggregate', () => {
    const zones = [makeZone(100, 9000), makeZone(0, 1000)];
    const { result } = renderHook(() => useOverallLoad(zones));
    expect(result.current).toBe(90);
  });

  it('handles a 0% capacity zone mixed with a 120% over-capacity zone', () => {
    const zones = [makeZone(0, 500), makeZone(120, 500)];
    const { result } = renderHook(() => useOverallLoad(zones));
    expect(result.current).toBe(60);
  });

  it('recomputes correctly across rapid simulated data shifts', () => {
    const initial = renderHook(({ zones }) => useOverallLoad(zones), {
      initialProps: { zones: [makeZone(20, 1000)] },
    });
    expect(initial.result.current).toBe(20);

    initial.rerender({ zones: [makeZone(55, 1000)] });
    expect(initial.result.current).toBe(55);

    initial.rerender({ zones: [makeZone(130, 1000)] });
    expect(initial.result.current).toBe(130);

    initial.rerender({ zones: [makeZone(0, 1000)] });
    expect(initial.result.current).toBe(0);
  });
});
