import { useCallback, useRef, useState } from 'react';
import { DISPATCH_ACTIONS } from '../utils/dispatchCatalog';

/**
 * Owns which dispatch tasks have been completed. Completing a task
 * applies its declared zone adjustments exactly once via the provided
 * applyZoneAdjustment callback (typically from useZoneSimulation).
 *
 * Guards against rapid repeated calls (e.g. a fast double-click, or
 * several toggles inside the same React batch) by tracking completion
 * in a ref that is checked-and-set synchronously, rather than relying
 * on the `completedActionIds` state value, which can be stale within
 * a single batch.
 */
export function useDispatchActions(applyZoneAdjustment) {
  const [completedActionIds, setCompletedActionIds] = useState(() => new Set());
  const completedIdsRef = useRef(new Set());

  const toggleAction = useCallback(
    (actionId) => {
      if (completedIdsRef.current.has(actionId)) return;

      const action = DISPATCH_ACTIONS.find((candidate) => candidate.id === actionId);
      if (!action) return;

      completedIdsRef.current.add(actionId);

      action.adjustments.forEach(({ zoneId, densityDelta, waitDelta }) => {
        applyZoneAdjustment(zoneId, { densityDelta, waitDelta });
      });

      setCompletedActionIds((previous) => {
        const next = new Set(previous);
        next.add(actionId);
        return next;
      });
    },
    [applyZoneAdjustment]
  );

  return { actions: DISPATCH_ACTIONS, completedActionIds, toggleAction };
}
