import { useCallback, useState } from 'react';
import { INCIDENT_TYPE_OPTIONS } from '../utils/incidentCatalog';

const EMPTY_FORM_STATE = {
  incidentType: INCIDENT_TYPE_OPTIONS[0].value,
  zoneLabel: '',
  description: '',
};

/**
 * Owns the incident report form's field values and submit handling.
 * Delegates actual persistence to the logIncident callback and resets
 * itself only when that submission reports success.
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
