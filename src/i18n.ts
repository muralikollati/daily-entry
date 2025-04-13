// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import en from './locales/en.json';
import te from './locales/te.json';

const resources = {
  en: { translation: en },
  te: { translation: te },
};

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: (callback: any) => {
    const locales = RNLocalize.getLocales();
    const lng = locales[0]?.languageCode || 'en';
    callback(lng);
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector as any)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    resources,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
