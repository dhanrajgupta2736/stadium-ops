import { useCallback, useEffect, useRef, useState } from 'react';
import { ZONE_DEFINITIONS } from '../utils/zoneCatalog';
import { deriveZoneStatus, clampPercent, clampWaitMinutes } from '../utils/zoneStatus';

/** Update interval (ms) for the stadium simulation tick. */
const TICK_INTERVAL_MS = 4000;

/** Drift bias to simulate crowd movement (negative bias means slight downward drift towards equilibrium). */
const DRIFT_BIAS = 0.42;

/** Maximum random drift magnitude for gate density metric per tick. */
const GATE_DENSITY_DRIFT_MAGNITUDE = 6;

/** Maximum random drift magnitude for non-gate density metric per tick. */
const NON_GATE_DENSITY_DRIFT_MAGNITUDE = 4;

/** Maximum random drift magnitude for gate wait time (minutes) per tick. */
const GATE_WAIT_DRIFT_MAGNITUDE = 3;

/**
 * Builds the initial state array for all stadium zones from static definitions.
 * @returns {Array<Object>} Array of initialized zone objects.
 */
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

/**
 * Calculates a stochastic value drift around the current value.
 * @param {number} current - Current numeric value.
 * @param {number} magnitude - Maximum scale of the drift step.
 * @returns {number} The drifted value.
 */
function driftValue(current, magnitude) {
  const delta = (Math.random() - DRIFT_BIAS) * magnitude;
  return current + delta;
}

/**
 * Owns the simulated live state of every stadium zone.
 * Drifts values on a 4-second interval and exposes an imperative adjustment
 * function so dispatch actions can push corrections (e.g. lower density
 * after opening an auxiliary exit).
 *
 * @param {Object} [options]
 * @param {boolean} [options.paused=false] - Whether to pause automated simulation ticks.
 * @returns {{ zones: Array<Object>, applyZoneAdjustment: Function, findZoneById: Function }}
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
          const densityMagnitude = isGate ? GATE_DENSITY_DRIFT_MAGNITUDE : NON_GATE_DENSITY_DRIFT_MAGNITUDE;
          const nextDensity = clampPercent(driftValue(zone.densityPercent, densityMagnitude));
          const nextWait = isGate
            ? clampWaitMinutes(driftValue(zone.waitMinutes, GATE_WAIT_DRIFT_MAGNITUDE))
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
