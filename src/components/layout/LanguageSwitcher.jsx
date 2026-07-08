import PropTypes from 'prop-types';
import { Languages } from 'lucide-react';
import { translateFnPropType } from '../../utils/propShapes';

export default function LanguageSwitcher({ t, locale, setLocale, availableLocales, localeMeta }) {
  const handleChange = (event) => {
    setLocale(event.target.value);
  };

  return (
    <div className="flex items-center gap-2">
      <Languages className="h-4 w-4 text-ink-muted" aria-hidden="true" />
      <label className="sr-only" htmlFor="locale-select">
        {t('languageLabel')}
      </label>
      <select
        id="locale-select"
        value={locale}
        onChange={handleChange}
        className="rounded border border-line bg-surface px-2 py-1.5 font-mono text-xs text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        {Object.values(availableLocales).map((localeValue) => (
          <option key={localeValue} value={localeValue}>
            {localeMeta[localeValue]?.label ?? localeValue}
          </option>
        ))}
      </select>
    </div>
  );
}

LanguageSwitcher.propTypes = {
  t: translateFnPropType,
  locale: PropTypes.string.isRequired,
  setLocale: PropTypes.func.isRequired,
  availableLocales: PropTypes.objectOf(PropTypes.string).isRequired,
  localeMeta: PropTypes.objectOf(
    PropTypes.shape({ label: PropTypes.string.isRequired, direction: PropTypes.string.isRequired })
  ).isRequired,
};
