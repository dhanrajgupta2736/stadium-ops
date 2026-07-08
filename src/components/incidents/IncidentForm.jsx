import PropTypes from 'prop-types';
import { zoneShape, translateFnPropType } from '../../utils/propShapes';
import { INCIDENT_TYPE_OPTIONS } from '../../utils/incidentCatalog';

export default function IncidentForm({ formState, updateField, submitForm, zones, t }) {
  return (
    <form onSubmit={submitForm} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="sm:col-span-1">
        <label htmlFor="incident-type" className="block font-mono text-[11px] uppercase tracking-wider text-ink-muted">
          {t('incidentTypeLabel')}
        </label>
        <select
          id="incident-type"
          value={formState.incidentType}
          onChange={(event) => updateField('incidentType', event.target.value)}
          className="mt-1 w-full rounded border border-line bg-surface px-2.5 py-2 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          {INCIDENT_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.labelKey)}
            </option>
          ))}
        </select>
      </div>

      <div className="sm:col-span-1">
        <label htmlFor="incident-zone" className="block font-mono text-[11px] uppercase tracking-wider text-ink-muted">
          {t('incidentZoneLabel')}
        </label>
        <select
          id="incident-zone"
          value={formState.zoneLabel}
          onChange={(event) => updateField('zoneLabel', event.target.value)}
          className="mt-1 w-full rounded border border-line bg-surface px-2.5 py-2 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          {zones.map((zone) => (
            <option key={zone.id} value={zone.label}>
              {zone.label}
            </option>
          ))}
        </select>
      </div>

      <div className="sm:col-span-2">
        <label
          htmlFor="incident-description"
          className="block font-mono text-[11px] uppercase tracking-wider text-ink-muted"
        >
          {t('incidentDescriptionLabel')}
        </label>
        <textarea
          id="incident-description"
          value={formState.description}
          onChange={(event) => updateField('description', event.target.value)}
          placeholder={t('incidentDescriptionPlaceholder')}
          rows={2}
          className="mt-1 w-full rounded border border-line bg-surface px-2.5 py-2 text-sm text-ink placeholder:text-ink-muted/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        />
      </div>

      <div className="sm:col-span-2">
        <button
          type="submit"
          className="rounded bg-accent px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-panel transition-colors hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {t('incidentSubmit')}
        </button>
      </div>
    </form>
  );
}

IncidentForm.propTypes = {
  formState: PropTypes.shape({
    incidentType: PropTypes.string.isRequired,
    zoneLabel: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  updateField: PropTypes.func.isRequired,
  submitForm: PropTypes.func.isRequired,
  zones: PropTypes.arrayOf(zoneShape).isRequired,
  t: translateFnPropType,
};
