import { useCallback, useRef, useState } from 'react';
import { DISPATCH_ACTIONS } from '../utils/dispatchCatalog';

/**
 * Custom React hook managing dispatch task completions and state.
 * Completing a task applies its declared zone adjustments exactly once
 * via the provided `applyZoneAdjustment` callback.
 *
 * Guards against rapid repeated calls (e.g. double-click) by tracking completion
 * in a ref checked-and-set synchronously, rather than relying on state values.
 *
 * @param {Function} applyZoneAdjustment - Callback to mutate zone density/wait metrics.
 * @returns {{ actions: Array<Object>, completedActionIds: Set<string>, toggleAction: Function }}
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
