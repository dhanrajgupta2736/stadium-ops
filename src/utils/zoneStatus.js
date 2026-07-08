import { ZONE_STATUS, DENSITY_THRESHOLDS, WAIT_THRESHOLDS } from './zoneCatalog';

/**
 * Derives a zone's status from density and wait time.
 * Critical wins over warning; either metric can independently trigger a level.
 * Pure function — same input always produces same output.
 */
export function deriveZoneStatus(densityPercent, waitMinutes) {
  const isDensityCritical = densityPercent >= DENSITY_THRESHOLDS.CRITICAL;
  const isWaitCritical = waitMinutes >= WAIT_THRESHOLDS.CRITICAL;
  if (isDensityCritical || isWaitCritical) return ZONE_STATUS.CRITICAL;

  const isDensityWarning = densityPercent >= DENSITY_THRESHOLDS.WARNING;
  const isWaitWarning = waitMinutes >= WAIT_THRESHOLDS.WARNING;
  if (isDensityWarning || isWaitWarning) return ZONE_STATUS.WARNING;

  return ZONE_STATUS.SAFE;
}

export function clampPercent(value) {
  if (value < 0) return 0;
  if (value > 130) return 130;
  return value;
}

export function clampWaitMinutes(value) {
  if (value < 0) return 0;
  if (value > 90) return 90;
  return value;
}
