import PropTypes from 'prop-types';
import { Radar, ShieldAlert, ShieldOff } from 'lucide-react';
import { translateFnPropType } from '../../utils/propShapes';
import LanguageSwitcher from './LanguageSwitcher';

/**
 * Resolves the CSS color class for the overall load percentage display.
 * @param {number} overallLoad - The current overall stadium load percentage.
 * @returns {string} Tailwind text color class.
 */
function getLoadTone(overallLoad) {
  if (overallLoad >= 90) return 'text-critical';
  if (overallLoad >= 75) return 'text-warning';
  return 'text-safe';
}

/**
 * Top-level header bar displaying the application title, overall load,
 * language switcher, and emergency evacuation controls.
 */
export default function StatusBar({
  t,
  overallLoad,
  locale,
  setLocale,
  availableLocales,
  localeMeta,
  emergencyActive,
  onEmergencyActivate,
  onEmergencyDeactivate,
}) {
  const loadTone = getLoadTone(overallLoad);

  const handleEmergencyClick = () => {
    if (emergencyActive) {
      onEmergencyDeactivate();
    } else {
      // Confirmation dialog to prevent accidental activation
      const confirmed = typeof window !== 'undefined'
        && window.confirm('⚠️ INITIATE EMERGENCY EVACUATION?\n\nThis will set all zones to high alert and log an emergency incident. Proceed?');
      if (confirmed) {
        onEmergencyActivate();
      }
    }
  };

  return (
    <header className="relative border-b border-line bg-panel">
      <div className="scan-line" aria-hidden="true" />

      {/* Emergency Banner */}
      {emergencyActive && (
        <div
          className="bg-critical/90 text-panel text-center py-2 font-mono text-xs font-semibold uppercase tracking-widest animate-pulse"
          role="alert"
          aria-live="assertive"
        >
          🚨 {t('emergencyBannerActive')} 🚨
        </div>
      )}

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

        <div className="flex items-center gap-4">
          {/* Emergency Protocol Button */}
          <button
            onClick={handleEmergencyClick}
            className={`flex items-center gap-1.5 rounded px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
              emergencyActive
                ? 'bg-critical/15 text-critical border border-critical/40 hover:bg-critical/25'
                : 'bg-surface text-ink-muted border border-line hover:border-critical/40 hover:text-critical'
            }`}
            aria-pressed={emergencyActive}
            title={emergencyActive ? t('emergencyDeactivate') : t('emergencyActivate')}
          >
            {emergencyActive ? (
              <ShieldOff className="h-3.5 w-3.5" />
            ) : (
              <ShieldAlert className="h-3.5 w-3.5" />
            )}
            {emergencyActive ? t('emergencyDeactivate') : t('emergencyActivate')}
          </button>

          {/* Overall Load Display */}
          <div className="text-right" aria-live="polite">
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
  emergencyActive: PropTypes.bool.isRequired,
  onEmergencyActivate: PropTypes.func.isRequired,
  onEmergencyDeactivate: PropTypes.func.isRequired,
};
