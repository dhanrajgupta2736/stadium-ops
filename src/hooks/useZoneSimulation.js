import { useCallback, useEffect, useRef, useState } from 'react';
import { ZONE_DEFINITIONS } from '../utils/zoneCatalog';
import { deriveZoneStatus, clampPercent, clampWaitMinutes } from '../utils/zoneStatus';

const TICK_INTERVAL_MS = 4000;

function buildInitialZones() {
  return ZONE_DEFINITIONS.map((def) => ({
    id: def.id,
    label: def.label,
    category: def.category,
    capacityLimit: def.capacityLimit,
    densityPercent: def.baseDensity,
    waitMinutes: def.baseWaitMinutes,
    status: deriveZoneStatus(def.baseDensity, def.baseWaitMinutes),
    lastUpdatedAt: Date.now(),
  }));
}

function driftValue(current, magnitude) {
  const delta = (Math.random() - 0.42) * magnitude;
  return current + delta;
}

/**
 * Owns the simulated live state of every stadium zone.
 * Drifts values on an interval and exposes an imperative adjustment
 * function so dispatch actions can push corrections (e.g. lower density
 * after opening an auxiliary exit).
 */
export function useZoneSimulation({ paused = false } = {}) {
  const [zones, setZones] = useState(buildInitialZones);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (pausedRef.current) return;
      setZones((previousZones) =>
        previousZones.map((zone) => {
          const isGate = zone.category === 'gate';
          const nextDensity = clampPercent(driftValue(zone.densityPercent, isGate ? 6 : 4));
          const nextWait = isGate
            ? clampWaitMinutes(driftValue(zone.waitMinutes, 3))
            : zone.waitMinutes;
          return {
            ...zone,
            densityPercent: Math.round(nextDensity * 10) / 10,
            waitMinutes: Math.round(nextWait * 10) / 10,
            status: deriveZoneStatus(nextDensity, nextWait),
            lastUpdatedAt: Date.now(),
          };
        })
      );
    }, TICK_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []);

  const applyZoneAdjustment = useCallback((zoneId, { densityDelta = 0, waitDelta = 0 }) => {
    setZones((previousZones) =>
      previousZones.map((zone) => {
        if (zone.id !== zoneId) return zone;
        const nextDensity = clampPercent(zone.densityPercent + densityDelta);
        const nextWait = clampWaitMinutes(zone.waitMinutes + waitDelta);
        return {
          ...zone,
          densityPercent: Math.round(nextDensity * 10) / 10,
          waitMinutes: Math.round(nextWait * 10) / 10,
          status: deriveZoneStatus(nextDensity, nextWait),
          lastUpdatedAt: Date.now(),
        };
      })
    );
  }, []);

  const findZoneById = useCallback((zoneId) => zones.find((zone) => zone.id === zoneId), [zones]);

  return { zones, applyZoneAdjustment, findZoneById };
}
