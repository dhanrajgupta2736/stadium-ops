import { useCallback, useState } from 'react';
import { LOCALES, LOCALE_META, translate } from '../i18n/dictionaries';

export function useLocale(initialLocale = LOCALES.EN) {
  const [locale, setLocale] = useState(initialLocale);

  const t = useCallback((key, params) => translate(locale, key, params), [locale]);

  const direction = LOCALE_META[locale]?.direction ?? 'ltr';

  return { locale, setLocale, t, direction, availableLocales: LOCALES, localeMeta: LOCALE_META };
}
