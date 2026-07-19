import { useCallback, useState } from 'react';
import { getProtocolKeyForIncidentType } from '../utils/incidentCatalog';

/** Maximum allowed character length for incident descriptions. */
const MAX_DESCRIPTION_LENGTH = 1000;

let incidentSequence = 0;

/**
 * Generates a unique incident ID using an incremental sequence number and timestamp.
 * @returns {string} Unique incident identifier string.
 */
function generateIncidentId() {
  incidentSequence += 1;
  return `incident-${incidentSequence}-${Date.now()}`;
}

/**
 * Custom React hook that owns the list of logged administrative incidents.
 * Validates inputs and binds automated protocol responses to incident types.
 *
 * @returns {{ incidents: Array<Object>, logIncident: Function }}
 */
export function useIncidentLog() {
  const [incidents, setIncidents] = useState([]);

  const logIncident = useCallback(({ incidentType, zoneLabel, description }) => {
    const trimmedDescription = (description || '').trim().slice(0, MAX_DESCRIPTION_LENGTH);
    if (!incidentType || !zoneLabel || trimmedDescription.length === 0) {
      return { success: false };
    }

    const entry = {
      id: generateIncidentId(),
      incidentType,
      zoneLabel,
      description: trimmedDescription,
      protocolKey: getProtocolKeyForIncidentType(incidentType),
      loggedAt: Date.now(),
    };

    setIncidents((previous) => [entry, ...previous]);
    return { success: true, entry };
  }, []);

  return { incidents, logIncident };
}
