import { useMemo } from 'react';

/**
 * Computes a single weighted overall-load percentage across all zones,
 * weighted by each zone's capacity limit so large seating zones influence
 * the headline figure more than small gates.
 */
export function useOverallLoad(zones) {
  return useMemo(() => {
    if (zones.length === 0) return 0;
    const totalCapacity = zones.reduce((sum, zone) => sum + zone.capacityLimit, 0);
    const weightedSum = zones.reduce(
      (sum, zone) => sum + zone.densityPercent * zone.capacityLimit,
      0
    );
    return Math.round(weightedSum / totalCapacity);
  }, [zones]);
}
