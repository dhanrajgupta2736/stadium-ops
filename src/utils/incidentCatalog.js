export const INCIDENT_TYPE = {
  MEDICAL: 'medical',
  BLOCKAGE: 'blockage',
  ASSET_FAILURE: 'asset_failure',
};

export const INCIDENT_TYPE_OPTIONS = [
  { value: INCIDENT_TYPE.MEDICAL, labelKey: 'incidentTypeMedical', protocolKey: 'incidentProtocolMedical' },
  { value: INCIDENT_TYPE.BLOCKAGE, labelKey: 'incidentTypeBlockage', protocolKey: 'incidentProtocolBlockage' },
  {
    value: INCIDENT_TYPE.ASSET_FAILURE,
    labelKey: 'incidentTypeAssetFailure',
    protocolKey: 'incidentProtocolAssetFailure',
  },
];

export function getProtocolKeyForIncidentType(incidentType) {
  const match = INCIDENT_TYPE_OPTIONS.find((option) => option.value === incidentType);
  return match ? match.protocolKey : 'incidentProtocolBlockage';
}
