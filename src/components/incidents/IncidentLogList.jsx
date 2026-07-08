import PropTypes from 'prop-types';
import { incidentEntryShape, translateFnPropType } from '../../utils/propShapes';
import IncidentLogRow from './IncidentLogRow';

export default function IncidentLogList({ incidents, t }) {
  return (
    <div>
      <h3 className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
        {t('incidentLogHeading')}
      </h3>
      {incidents.length === 0 ? (
        <p className="mt-2 text-sm text-ink-muted">{t('incidentLogEmpty')}</p>
      ) : (
        <ul className="mt-2 max-h-64 space-y-2 overflow-y-auto" aria-live="polite">
          {incidents.map((entry) => (
            <IncidentLogRow key={entry.id} entry={entry} t={t} />
          ))}
        </ul>
      )}
    </div>
  );
}

IncidentLogList.propTypes = {
  incidents: PropTypes.arrayOf(incidentEntryShape).isRequired,
  t: translateFnPropType,
};
