import { describe, it, expect } from 'vitest';
import { evaluateDirectives } from '../utils/directiveRules';

function makeZone(overrides) {
  return {
    id: 'zone-x',
    label: 'Zone X',
    category: 'gate',
    capacityLimit: 1000,
    densityPercent: 20,
    waitMinutes: 5,
    status: 'safe',
    lastUpdatedAt: Date.now(),
    ...overrides,
  };
}

describe('evaluateDirectives', () => {
  it('fires the spec example: Gate A wait > 25 AND Concourse B critical', () => {
    const zones = [
      makeZone({ id: 'gate-a', label: 'Gate A', category: 'gate', waitMinutes: 27 }),
      makeZone({
        id: 'concourse-b',
        label: 'Concourse B',
        category: 'concourse',
        densityPercent: 97,
        status: 'critical',
      }),
    ];

    const directives = evaluateDirectives(zones);
    const hasCrossZoneDirective = directives.some(
      (directive) => directive.messageKey === 'directiveGateAConcourseBCritical'
    );
    expect(hasCrossZoneDirective).toBe(true);
    expect(directives[0].severity).toBe('critical');
  });

  it('does not fire the cross-zone rule when only Gate A wait is high', () => {
    const zones = [
      makeZone({ id: 'gate-a', label: 'Gate A', category: 'gate', waitMinutes: 27 }),
      makeZone({ id: 'concourse-b', label: 'Concourse B', category: 'concourse', status: 'safe' }),
    ];

    const directives = evaluateDirectives(zones);
    const hasCrossZoneDirective = directives.some(
      (directive) => directive.messageKey === 'directiveGateAConcourseBCritical'
    );
    expect(hasCrossZoneDirective).toBe(false);
  });

  it('returns the all-nominal directive when every zone is safe', () => {
    const zones = [makeZone({ status: 'safe' }), makeZone({ id: 'zone-y', status: 'safe' })];
    const directives = evaluateDirectives(zones);
    expect(directives).toHaveLength(1);
    expect(directives[0].messageKey).toBe('directiveAllNominal');
  });

  it('sorts critical directives before advisory directives', () => {
    const zones = [
      makeZone({
        id: 'seating-lower',
        category: 'seating',
        label: 'Seating Lower',
        densityPercent: 98,
        status: 'critical',
      }),
      makeZone({
        id: 'concourse-a',
        category: 'concourse',
        label: 'Concourse A',
        densityPercent: 80,
        status: 'warning',
      }),
    ];

    const directives = evaluateDirectives(zones);
    expect(directives[0].severity).toBe('critical');
    expect(directives[directives.length - 1].severity).toBe('advisory');
    const severityValues = directives.map((directive) => directive.severity);
    const firstAdvisoryIndex = severityValues.indexOf('advisory');
    const firstCriticalIndex = severityValues.indexOf('critical');
    expect(firstCriticalIndex).toBeLessThan(firstAdvisoryIndex);
  });

  it('handles an empty zone list without throwing', () => {
    expect(() => evaluateDirectives([])).not.toThrow();
    expect(evaluateDirectives([])).toEqual([
      expect.objectContaining({ messageKey: 'directiveAllNominal' }),
    ]);
  });
});
