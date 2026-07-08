export const DISPATCH_ACTIONS = [
  {
    id: 'open-auxiliary-exit-4',
    labelKey: 'dispatchOpenExit4',
    descriptionKey: 'dispatchOpenExit4Desc',
    adjustments: [{ zoneId: 'seating-lower', densityDelta: -14, waitDelta: 0 }],
  },
  {
    id: 'dispatch-stewards-concourse-b',
    labelKey: 'dispatchStewardsToConcourseB',
    descriptionKey: 'dispatchStewardsToConcourseBDesc',
    adjustments: [{ zoneId: 'concourse-b', densityDelta: -18, waitDelta: 0 }],
  },
  {
    id: 'redirect-gate-a-to-c',
    labelKey: 'dispatchRedirectGateA',
    descriptionKey: 'dispatchRedirectGateADesc',
    adjustments: [
      { zoneId: 'gate-a', densityDelta: -10, waitDelta: -16 },
      { zoneId: 'gate-c', densityDelta: 12, waitDelta: 5 },
    ],
  },
  {
    id: 'open-hospitality-overflow',
    labelKey: 'dispatchOpenHospitalityOverflow',
    descriptionKey: 'dispatchOpenHospitalityOverflowDesc',
    adjustments: [{ zoneId: 'hospitality', densityDelta: -8, waitDelta: -6 }],
  },
];
