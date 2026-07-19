import { useCallback, useState } from 'react';
import { INCIDENT_TYPE_OPTIONS } from '../utils/incidentCatalog';

const EMPTY_FORM_STATE = {
  incidentType: INCIDENT_TYPE_OPTIONS[0].value,
  zoneLabel: '',
  description: '',
};

/**
 * Custom React hook that owns the incident report form's field values and submit handling.
 * Delegates actual persistence to the `logIncident` callback and resets itself on success.
 *
 * @param {Function} logIncident - Persistence callback from useIncidentLog.
 * @param {Array<Object>} zoneOptions - Available stadium zones to populate the zone dropdown.
 * @returns {{ formState: Object, updateField: Function, submitForm: Function, lastLoggedEntry: Object|null }}
 */
export function useIncidentForm(logIncident, zoneOptions) {
  const [formState, setFormState] = useState(() => ({
    ...EMPTY_FORM_STATE,
    zoneLabel: zoneOptions[0]?.label ?? '',
  }));
  const [lastLoggedEntry, setLastLoggedEntry] = useState(null);

  const updateField = useCallback((fieldName, value) => {
    setFormState((previous) => ({ ...previous, [fieldName]: value }));
  }, []);

  const submitForm = useCallback(
    (event) => {
      event.preventDefault();
      const result = logIncident(formState);
      if (!result.success) return;
      setLastLoggedEntry(result.entry);
      setFormState({ ...EMPTY_FORM_STATE, zoneLabel: zoneOptions[0]?.label ?? '' });
    },
    [formState, logIncident, zoneOptions]
  );

  return { formState, updateField, submitForm, lastLoggedEntry };
}
