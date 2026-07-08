import PropTypes from 'prop-types';
import { MessageSquareWarning } from 'lucide-react';
import { zoneShape, incidentEntryShape, translateFnPropType } from '../../utils/propShapes';
import IncidentForm from './IncidentForm';
import IncidentLogList from './IncidentLogList';

export default function IncidentReporterPanel({
  formState,
  updateField,
  submitForm,
  incidents,
  zones,
  t,
}) {
  return (
    <section aria-labelledby="incident-heading" className="rounded-lg border border-line bg-panel p-4">
      <div className="flex items-center gap-2">
        <MessageSquareWarning className="h-5 w-5 text-accent" aria-hidden="true" />
        <h2 id="incident-heading" className="font-display text-lg uppercase tracking-wide text-ink">
          {t('incidentHeading')}
        </h2>
      </div>

      <div className="mt-3">
        <IncidentForm formState={formState} updateField={updateField} submitForm={submitForm} zones={zones} t={t} />
      </div>

      <div className="mt-4 border-t border-line pt-3">
        <IncidentLogList incidents={incidents} t={t} />
      </div>
    </section>
  );
}

IncidentReporterPanel.propTypes = {
  formState: PropTypes.shape({
    incidentType: PropTypes.string.isRequired,
    zoneLabel: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  updateField: PropTypes.func.isRequired,
  submitForm: PropTypes.func.isRequired,
  incidents: PropTypes.arrayOf(incidentEntryShape).isRequired,
  zones: PropTypes.arrayOf(zoneShape).isRequired,
  t: translateFnPropType,
};
