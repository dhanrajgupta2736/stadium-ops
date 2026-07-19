import { renderHook, act } from '@testing-library/react';
import { useEmergencyProtocol } from '../hooks/useEmergencyProtocol';

describe('useEmergencyProtocol', () => {
  it('initializes with inactive emergency state', () => {
    const { result } = renderHook(() => useEmergencyProtocol());
    expect(result.current.isActive).toBe(false);
    expect(result.current.activatedAt).toBeNull();
  });

  it('activates emergency state and invokes callback', () => {
    const onActivate = vi.fn();
    const { result } = renderHook(() => useEmergencyProtocol({ onActivate }));

    act(() => {
      result.current.activate();
    });

    expect(result.current.isActive).toBe(true);
    expect(result.current.activatedAt).toBeGreaterThan(0);
    expect(onActivate).toHaveBeenCalledTimes(1);
  });

  it('does not re-trigger callback if already active', () => {
    const onActivate = vi.fn();
    const { result } = renderHook(() => useEmergencyProtocol({ onActivate }));

    act(() => {
      result.current.activate();
    });

    act(() => {
      result.current.activate();
    });

    expect(onActivate).toHaveBeenCalledTimes(1);
  });

  it('deactivates emergency state when requested', () => {
    const { result } = renderHook(() => useEmergencyProtocol());

    act(() => {
      result.current.activate();
    });
    expect(result.current.isActive).toBe(true);

    act(() => {
      result.current.deactivate();
    });
    expect(result.current.isActive).toBe(false);
    expect(result.current.activatedAt).toBeNull();
  });
});
