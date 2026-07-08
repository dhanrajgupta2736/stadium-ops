import { zoneShape, translateFnPropType } from '../../utils/propShapes';
import { getStatusPresentation } from '../../utils/statusPresentation';

export default function ZoneCard({ zone, t }) {
  const presentation = getStatusPresentation(zone.status);
  const densityBarWidth = Math.min(zone.densityPercent, 100);

  return (
    <article
      className={`rounded-lg border bg-surface p-4 transition-colors duration-500 ${presentation.borderClass} ${presentation.glowClass}`}
      aria-label={`${zone.label}: ${t(presentation.labelKey)}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-lg uppercase tracking-wide text-ink">{zone.label}</h3>
        <span className="flex items-center gap-1.5 whitespace-nowrap">
          <span className={`h-2 w-2 rounded-full ${presentation.dotClass}`} aria-hidden="true" />
          <span className={`font-mono text-[11px] uppercase tracking-wider ${presentation.textClass}`}>
            {t(presentation.labelKey)}
          </span>
        </span>
      </div>

      <dl className="mt-3 space-y-2.5">
        <div>
          <div className="flex items-baseline justify-between">
            <dt className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
              {t('densityLabel')}
            </dt>
            <dd className="font-mono text-sm font-semibold text-ink">
              {zone.densityPercent.toFixed(0)}%
            </dd>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-line" role="presentation">
            <div
              className={`h-full rounded-full transition-all duration-700 ${presentation.dotClass}`}
              style={{ width: `${densityBarWidth}%` }}
            />
          </div>
        </div>

        {zone.waitMinutes > 0 && (
          <div className="flex items-baseline justify-between">
            <dt className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
              {t('waitLabel')}
            </dt>
            <dd className="font-mono text-sm font-semibold text-ink">
              {zone.waitMinutes.toFixed(0)} {t('minutesAbbrev')}
            </dd>
          </div>
        )}
      </dl>
    </article>
  );
}

ZoneCard.propTypes = {
  zone: zoneShape,
  t: translateFnPropType,
};
