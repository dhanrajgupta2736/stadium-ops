export const DIRECTIVE_SEVERITY = {
  INFO: 'info',
  ADVISORY: 'advisory',
  CRITICAL: 'critical',
};

function findZone(zonesById, id) {
  return zonesById.get(id) ?? null;
}

/**
 * Each rule receives a Map of zoneId -> zone and returns either null
 * (rule does not fire) or a directive descriptor. Rules are evaluated
 * in order; all firing rules are surfaced, most severe first.
 */
export const DIRECTIVE_RULES = [
  {
    id: 'gate-a-to-concourse-b-critical',
    evaluate(zonesById) {
      const gateA = findZone(zonesById, 'gate-a');
      const concourseB = findZone(zonesById, 'concourse-b');
      if (!gateA || !concourseB) return null;
      if (gateA.waitMinutes > 25 && concourseB.status === 'critical') {
        return {
          severity: DIRECTIVE_SEVERITY.CRITICAL,
          messageKey: 'directiveGateAConcourseBCritical',
          messageParams: { waitMinutes: Math.round(gateA.waitMinutes) },
        };
      }
      return null;
    },
  },
  {
    id: 'any-gate-critical-wait',
    evaluate(zonesById) {
      const directives = [];
      for (const zone of zonesById.values()) {
        if (zone.category !== 'gate') continue;
        if (zone.waitMinutes >= 25) {
          directives.push({
            severity: DIRECTIVE_SEVERITY.CRITICAL,
            messageKey: 'directiveGateWaitCritical',
            messageParams: { zoneLabel: zone.label, waitMinutes: Math.round(zone.waitMinutes) },
          });
        }
      }
      return directives.length > 0 ? directives : null;
    },
  },
  {
    id: 'seating-density-critical',
    evaluate(zonesById) {
      const directives = [];
      for (const zone of zonesById.values()) {
        if (zone.category !== 'seating') continue;
        if (zone.status === 'critical') {
          directives.push({
            severity: DIRECTIVE_SEVERITY.CRITICAL,
            messageKey: 'directiveSeatingCritical',
            messageParams: { zoneLabel: zone.label, density: Math.round(zone.densityPercent) },
          });
        }
      }
      return directives.length > 0 ? directives : null;
    },
  },
  {
    id: 'concourse-warning-advisory',
    evaluate(zonesById) {
      const directives = [];
      for (const zone of zonesById.values()) {
        if (zone.category !== 'concourse') continue;
        if (zone.status === 'warning') {
          directives.push({
            severity: DIRECTIVE_SEVERITY.ADVISORY,
            messageKey: 'directiveConcourseAdvisory',
            messageParams: { zoneLabel: zone.label, density: Math.round(zone.densityPercent) },
          });
        }
      }
      return directives.length > 0 ? directives : null;
    },
  },
  {
    id: 'all-nominal',
    evaluate(zonesById) {
      const hasAnyNonSafeZone = Array.from(zonesById.values()).some(
        (zone) => zone.status !== 'safe'
      );
      if (hasAnyNonSafeZone) return null;
      return {
        severity: DIRECTIVE_SEVERITY.INFO,
        messageKey: 'directiveAllNominal',
        messageParams: {},
      };
    },
  },
];

const SEVERITY_ORDER = {
  [DIRECTIVE_SEVERITY.CRITICAL]: 0,
  [DIRECTIVE_SEVERITY.ADVISORY]: 1,
  [DIRECTIVE_SEVERITY.INFO]: 2,
};

/**
 * Runs every rule against the current zone state and returns a flat,
 * severity-sorted list of directive descriptors (message not yet resolved
 * to a locale string — that happens at render time via the i18n dictionary).
 */
export function evaluateDirectives(zones) {
  const zonesById = new Map(zones.map((zone) => [zone.id, zone]));
  const results = [];

  for (const rule of DIRECTIVE_RULES) {
    const outcome = rule.evaluate(zonesById);
    if (!outcome) continue;

    if (Array.isArray(outcome)) {
      results.push(...outcome);
      continue;
    }

    results.push(outcome);
  }

  return results.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
}
