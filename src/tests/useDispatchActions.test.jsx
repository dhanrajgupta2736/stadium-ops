import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDispatchActions } from '../hooks/useDispatchActions';

describe('useDispatchActions', () => {
  it('applies the declared zone adjustments when a task is completed', () => {
    const applyZoneAdjustment = vi.fn();
    const { result } = renderHook(() => useDispatchActions(applyZoneAdjustment));

    act(() => {
      result.current.toggleAction('open-auxiliary-exit-4');
    });

    expect(applyZoneAdjustment).toHaveBeenCalledWith('seating-lower', {
      densityDelta: -14,
      waitDelta: 0,
    });
    expect(result.current.completedActionIds.has('open-auxiliary-exit-4')).toBe(true);
  });

  it('applies adjustments to multiple zones for actions that affect more than one', () => {
    const applyZoneAdjustment = vi.fn();
    const { result } = renderHook(() => useDispatchActions(applyZoneAdjustment));

    act(() => {
      result.current.toggleAction('redirect-gate-a-to-c');
    });

    expect(applyZoneAdjustment).toHaveBeenCalledTimes(2);
    expect(applyZoneAdjustment).toHaveBeenCalledWith('gate-a', { densityDelta: -10, waitDelta: -16 });
    expect(applyZoneAdjustment).toHaveBeenCalledWith('gate-c', { densityDelta: 12, waitDelta: 5 });
  });

  it('does not re-apply adjustments when a completed task is toggled again rapidly', () => {
    const applyZoneAdjustment = vi.fn();
    const { result } = renderHook(() => useDispatchActions(applyZoneAdjustment));

    act(() => {
      result.current.toggleAction('open-hospitality-overflow');
      result.current.toggleAction('open-hospitality-overflow');
      result.current.toggleAction('open-hospitality-overflow');
    });

    expect(applyZoneAdjustment).toHaveBeenCalledTimes(1);
  });

  it('ignores an unknown action id without throwing', () => {
    const applyZoneAdjustment = vi.fn();
    const { result } = renderHook(() => useDispatchActions(applyZoneAdjustment));

    expect(() => {
      act(() => {
        result.current.toggleAction('does-not-exist');
      });
    }).not.toThrow();
    expect(applyZoneAdjustment).not.toHaveBeenCalled();
  });
});
