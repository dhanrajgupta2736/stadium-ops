import PropTypes from 'prop-types';
import { zoneShape, translateFnPropType } from '../../utils/propShapes';
import ZoneCard from './ZoneCard';

export default function ZoneGrid({ zones, t }) {
  return (
    <section aria-labelledby="zone-grid-heading">
      <h2 id="zone-grid-heading" className="font-display text-xl uppercase tracking-wide text-ink-muted">
        {t('zoneGridHeading')}
      </h2>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {zones.map((zone) => (
          <ZoneCard key={zone.id} zone={zone} t={t} />
        ))}
      </div>
    </section>
  );
}

ZoneGrid.propTypes = {
  zones: PropTypes.arrayOf(zoneShape).isRequired,
  t: translateFnPropType,
};
