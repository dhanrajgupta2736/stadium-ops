import { incidentEntryShape, translateFnPropType } from '../../utils/propShapes';

function formatTimestamp(epochMs) {
  return new Date(epochMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function IncidentLogRow({ entry, t }) {
  return (
    <li className="rounded border border-line bg-surface px-3 py-2">
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-mono text-[11px] uppercase tracking-wider text-accent">
          {t('incidentLoggedPrefix')} · {entry.zoneLabel}
        </p>
        <p className="font-mono text-[10px] text-ink-muted">{formatTimestamp(entry.loggedAt)}</p>
      </div>
      <p className="mt-1 text-sm text-ink">{entry.description}</p>
      <p className="mt-1 font-mono text-[11px] text-ink-muted">{t(entry.protocolKey)}</p>
    </li>
  );
}

IncidentLogRow.propTypes = {
  entry: incidentEntryShape,
  t: translateFnPropType,
};
