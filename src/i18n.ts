import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ptTranslation from './locales/pt/translation.json';
import enTranslation from './locales/en/translation.json';

const resources = {
    en: { translation: enTranslation },
    pt: { translation: ptTranslation }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'pt', // Usa PT como padrão
        interpolation: {
            escapeValue: false // O React já faz escape de XSS por padrão
        }
    });

export default i18n;
