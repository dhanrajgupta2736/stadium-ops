import { describe, it, expect } from 'vitest';
import { deriveZoneStatus, clampPercent, clampWaitMinutes } from '../utils/zoneStatus';

describe('deriveZoneStatus', () => {
  it('returns safe at 0% density and 0 min wait', () => {
    expect(deriveZoneStatus(0, 0)).toBe('safe');
  });

  it('returns safe just below the warning threshold', () => {
    expect(deriveZoneStatus(74.9, 14.9)).toBe('safe');
  });

  it('returns warning exactly at the density warning threshold', () => {
    expect(deriveZoneStatus(75, 0)).toBe('warning');
  });

  it('returns warning exactly at the wait warning threshold', () => {
    expect(deriveZoneStatus(0, 15)).toBe('warning');
  });

  it('returns critical exactly at the density critical threshold', () => {
    expect(deriveZoneStatus(95, 0)).toBe('critical');
  });

  it('returns critical exactly at the wait critical threshold', () => {
    expect(deriveZoneStatus(0, 25)).toBe('critical');
  });

  it('returns critical when density is over 100% (over-capacity)', () => {
    expect(deriveZoneStatus(120, 0)).toBe('critical');
  });

  it('critical wait time overrides an otherwise-safe density', () => {
    expect(deriveZoneStatus(10, 30)).toBe('critical');
  });

  it('critical density overrides an otherwise-safe wait time', () => {
    expect(deriveZoneStatus(96, 2)).toBe('critical');
  });
});

describe('clampPercent', () => {
  it('clamps negative values up to 0', () => {
    expect(clampPercent(-15)).toBe(0);
  });

  it('leaves in-range values untouched', () => {
    expect(clampPercent(62.5)).toBe(62.5);
  });

  it('clamps values above 130 (over-capacity ceiling) down to 130', () => {
    expect(clampPercent(200)).toBe(130);
  });

  it('allows up to 130 to represent 120%+ over-capacity scenarios', () => {
    expect(clampPercent(122)).toBe(122);
  });
});

describe('clampWaitMinutes', () => {
  it('clamps negative values up to 0', () => {
    expect(clampWaitMinutes(-5)).toBe(0);
  });

  it('clamps values above 90 down to 90', () => {
    expect(clampWaitMinutes(500)).toBe(90);
  });
});
