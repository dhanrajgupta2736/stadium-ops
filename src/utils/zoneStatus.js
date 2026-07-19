import { ZONE_STATUS, DENSITY_THRESHOLDS, WAIT_THRESHOLDS } from './zoneCatalog';

/** Maximum allowed percentage clamp upper bound. */
const MAX_PERCENT_BOUND = 130;

/** Maximum allowed wait time clamp upper bound in minutes. */
const MAX_WAIT_BOUND_MINUTES = 90;

/**
 * Derives a zone's status from density and wait time.
 * Critical wins over warning; either metric can independently trigger a level.
 * Pure function — same input always produces same output.
 *
 * @param {number} densityPercent - Current density percent.
 * @param {number} waitMinutes - Current wait time in minutes.
 * @returns {string} Status string: 'safe', 'warning', or 'critical'.
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

/**
 * Clamps a percentage value between 0% and 130%.
 * @param {number} value - Raw percentage value.
 * @returns {number} Clamped value.
 */
export function clampPercent(value) {
  if (value < 0) return 0;
  if (value > MAX_PERCENT_BOUND) return MAX_PERCENT_BOUND;
  return value;
}

/**
 * Clamps a wait time value between 0 and 90 minutes.
 * @param {number} value - Raw wait time value.
 * @returns {number} Clamped value.
 */
export function clampWaitMinutes(value) {
  if (value < 0) return 0;
  if (value > MAX_WAIT_BOUND_MINUTES) return MAX_WAIT_BOUND_MINUTES;
  return value;
}
