import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/PageHeader'
import { useSettingsStore } from '../../store/useSettingsStore'
import type { Language } from '../../lib/i18n'

export function SettingsPage() {
  const { t } = useTranslation()
  const language = useSettingsStore((s) => s.language)
  const setLanguage = useSettingsStore((s) => s.setLanguage)

  const options: { code: Language; labelKey: 'hindi' | 'english' }[] = [
    { code: 'hi', labelKey: 'hindi' },
    { code: 'en', labelKey: 'english' },
  ]

  return (
    <div>
      <PageHeader title={t('settings.title')} />
      <div>
        <p className="mb-3 text-sm font-medium text-gray-500">{t('settings.language')}</p>
        <div className="grid grid-cols-2 gap-4">
          {options.map((opt) => {
            const selected = language === opt.code
            return (
              <button
                key={opt.code}
                type="button"
                onClick={() => setLanguage(opt.code)}
                className={`min-h-20 rounded-2xl border-2 text-xl font-semibold transition-colors ${
                  selected
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-white text-gray-700'
                }`}
                aria-pressed={selected}
              >
                {t(`settings.${opt.labelKey}`)}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
