import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import en from '@/locales/en.json'
import es from '@/locales/es.json'

export const IDIOMAS = ['es', 'en'] as const
export type Idioma = (typeof IDIOMAS)[number]

export const CLAVE_IDIOMA = 'idioma'

/** Sincroniza `<html lang>` con el idioma activo. */
function sincronizarLang(): void {
  document.documentElement.lang = i18n.resolvedLanguage ?? 'es'
}

/**
 * i18n (Const. A16 a). Detector SOLO `localStorage`: sin `navigator`, el primer
 * uso arranca en español aunque el navegador esté en inglés (RN-12).
 */
void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
    },
    fallbackLng: 'es',
    supportedLngs: [...IDIOMAS],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage'],
      lookupLocalStorage: CLAVE_IDIOMA,
      caches: ['localStorage'],
    },
  })
  .then(sincronizarLang)
  .catch((error: unknown) => {
    console.error('i18n: no se pudo inicializar', error)
  })

i18n.on('languageChanged', sincronizarLang)

export default i18n
