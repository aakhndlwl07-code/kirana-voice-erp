import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '../../locales/en.json'
import hi from '../../locales/hi.json'

export type Language = 'en' | 'hi'

const STORAGE_KEY = 'kirana-erp-language'

export function getStoredLanguage(): Language {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'en' || stored === 'hi' ? stored : 'hi'
}

export function setStoredLanguage(lang: Language) {
  localStorage.setItem(STORAGE_KEY, lang)
  i18n.changeLanguage(lang)
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
  },
  lng: getStoredLanguage(),
  fallbackLng: 'hi',
  interpolation: { escapeValue: false },
})

export default i18n
