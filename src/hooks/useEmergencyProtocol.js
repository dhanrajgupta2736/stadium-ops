import { useCallback, useState } from 'react';

/**
 * Emergency evacuation protocol state manager.
 * Provides a one-button activation system that transitions the entire
 * stadium into an emergency state, suitable for mass evacuations,
 * severe weather events, or security threats.
 *
 * When activated:
 * - Sets the `isActive` flag to true (consumed by UI for visual alerts)
 * - Records the activation timestamp for audit trails
 * - Calls the provided `onActivate` callback so the parent can
 *   cascade effects (e.g., auto-logging an incident, notifying the AI)
 *
 * @param {Object} options
 * @param {Function} options.onActivate - Callback invoked when evacuation is triggered
 * @returns {{ isActive: boolean, activatedAt: number|null, activate: Function, deactivate: Function }}
 */
export function useEmergencyProtocol({ onActivate } = {}) {
  const [isActive, setIsActive] = useState(false);
  const [activatedAt, setActivatedAt] = useState(null);

  const activate = useCallback(() => {
    if (isActive) return;
    const timestamp = Date.now();
    setIsActive(true);
    setActivatedAt(timestamp);
    if (typeof onActivate === 'function') {
      onActivate(timestamp);
    }
  }, [isActive, onActivate]);

  const deactivate = useCallback(() => {
    setIsActive(false);
    setActivatedAt(null);
  }, []);

  return { isActive, activatedAt, activate, deactivate };
}
