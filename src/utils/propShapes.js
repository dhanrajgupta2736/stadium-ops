import PropTypes from 'prop-types';

export const zoneShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  capacityLimit: PropTypes.number.isRequired,
  densityPercent: PropTypes.number.isRequired,
  waitMinutes: PropTypes.number.isRequired,
  status: PropTypes.oneOf(['safe', 'warning', 'critical']).isRequired,
  lastUpdatedAt: PropTypes.number.isRequired,
});

export const directiveEntryShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  severity: PropTypes.oneOf(['info', 'advisory', 'critical']).isRequired,
  messageKey: PropTypes.string.isRequired,
  messageParams: PropTypes.object.isRequired,
  occurredAt: PropTypes.number.isRequired,
});

export const dispatchActionShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  labelKey: PropTypes.string.isRequired,
  descriptionKey: PropTypes.string.isRequired,
  adjustments: PropTypes.arrayOf(
    PropTypes.shape({
      zoneId: PropTypes.string.isRequired,
      densityDelta: PropTypes.number.isRequired,
      waitDelta: PropTypes.number.isRequired,
    })
  ).isRequired,
});

export const incidentEntryShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  incidentType: PropTypes.string.isRequired,
  zoneLabel: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  protocolKey: PropTypes.string.isRequired,
  loggedAt: PropTypes.number.isRequired,
});

export const translateFnPropType = PropTypes.func.isRequired;
