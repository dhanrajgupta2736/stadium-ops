export const ZONE_CATEGORY = {
  GATE: 'gate',
  CONCOURSE: 'concourse',
  SEATING: 'seating',
  HOSPITALITY: 'hospitality',
};

export const ZONE_STATUS = {
  SAFE: 'safe',
  WARNING: 'warning',
  CRITICAL: 'critical',
};

export const DENSITY_THRESHOLDS = {
  WARNING: 75,
  CRITICAL: 95,
};

export const WAIT_THRESHOLDS = {
  WARNING: 15,
  CRITICAL: 25,
};

export const ZONE_DEFINITIONS = [
  {
    id: 'gate-a',
    label: 'Gate A',
    category: ZONE_CATEGORY.GATE,
    capacityLimit: 1200,
    baseDensity: 58,
    baseWaitMinutes: 9,
  },
  {
    id: 'gate-b',
    label: 'Gate B',
    category: ZONE_CATEGORY.GATE,
    capacityLimit: 1200,
    baseDensity: 41,
    baseWaitMinutes: 6,
  },
  {
    id: 'gate-c',
    label: 'Gate C',
    category: ZONE_CATEGORY.GATE,
    capacityLimit: 1200,
    baseDensity: 22,
    baseWaitMinutes: 3,
  },
  {
    id: 'concourse-a',
    label: 'Concourse A',
    category: ZONE_CATEGORY.CONCOURSE,
    capacityLimit: 3000,
    baseDensity: 64,
    baseWaitMinutes: 0,
  },
  {
    id: 'concourse-b',
    label: 'Concourse B',
    category: ZONE_CATEGORY.CONCOURSE,
    capacityLimit: 3000,
    baseDensity: 71,
    baseWaitMinutes: 0,
  },
  {
    id: 'seating-lower',
    label: 'Seating — Lower Bowl',
    category: ZONE_CATEGORY.SEATING,
    capacityLimit: 22000,
    baseDensity: 88,
    baseWaitMinutes: 0,
  },
  {
    id: 'seating-upper',
    label: 'Seating — Upper Bowl',
    category: ZONE_CATEGORY.SEATING,
    capacityLimit: 18000,
    baseDensity: 76,
    baseWaitMinutes: 0,
  },
  {
    id: 'hospitality',
    label: 'Hospitality Suites',
    category: ZONE_CATEGORY.HOSPITALITY,
    capacityLimit: 800,
    baseDensity: 47,
    baseWaitMinutes: 4,
  },
];
