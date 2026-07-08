import { useCallback, useState } from 'react';
import { getProtocolKeyForIncidentType } from '../utils/incidentCatalog';

let incidentSequence = 0;

function generateIncidentId() {
  incidentSequence += 1;
  return `incident-${incidentSequence}-${Date.now()}`;
}

/**
 * Owns the list of logged incidents. Returns whether a submission
 * succeeded so the form can decide how to react (e.g. clear itself).
 */
export function useIncidentLog() {
  const [incidents, setIncidents] = useState([]);

  const logIncident = useCallback(({ incidentType, zoneLabel, description }) => {
    const trimmedDescription = description.trim();
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
