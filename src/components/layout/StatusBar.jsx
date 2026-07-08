import PropTypes from 'prop-types';
import { Radar } from 'lucide-react';
import { translateFnPropType } from '../../utils/propShapes';
import LanguageSwitcher from './LanguageSwitcher';

function getLoadTone(overallLoad) {
  if (overallLoad >= 90) return 'text-critical';
  if (overallLoad >= 75) return 'text-warning';
  return 'text-safe';
}

export default function StatusBar({
  t,
  overallLoad,
  locale,
  setLocale,
  availableLocales,
  localeMeta,
}) {
  const loadTone = getLoadTone(overallLoad);

  return (
    <header className="relative border-b border-line bg-panel">
      <div className="scan-line" aria-hidden="true" />
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <Radar className="h-7 w-7 text-accent" aria-hidden="true" />
          <div>
            <h1 className="font-display text-2xl uppercase tracking-wide text-ink">
              {t('appTitle')}
            </h1>
            <p className="font-mono text-xs text-ink-muted">{t('appSubtitle')}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="font-mono text-[11px] uppercase tracking-widest text-ink-muted">
              {t('overallLoad')}
            </p>
            <p className={`font-mono text-2xl font-semibold ${loadTone}`}>{overallLoad}%</p>
          </div>
          <LanguageSwitcher
            t={t}
            locale={locale}
            setLocale={setLocale}
            availableLocales={availableLocales}
            localeMeta={localeMeta}
          />
        </div>
      </div>
    </header>
  );
}

StatusBar.propTypes = {
  t: translateFnPropType,
  overallLoad: PropTypes.number.isRequired,
  locale: PropTypes.string.isRequired,
  setLocale: PropTypes.func.isRequired,
  availableLocales: PropTypes.objectOf(PropTypes.string).isRequired,
  localeMeta: PropTypes.objectOf(
    PropTypes.shape({ label: PropTypes.string.isRequired, direction: PropTypes.string.isRequired })
  ).isRequired,
};
