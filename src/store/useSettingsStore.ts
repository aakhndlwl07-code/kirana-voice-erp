import { create } from 'zustand'
import { getStoredLanguage, setStoredLanguage, type Language } from '../lib/i18n'

type SettingsState = {
  language: Language
  setLanguage: (lang: Language) => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  language: getStoredLanguage(),
  setLanguage: (lang) => {
    setStoredLanguage(lang)
    set({ language: lang })
  },
}))
