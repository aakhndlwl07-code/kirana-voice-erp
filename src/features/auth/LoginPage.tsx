import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../store/useAuthStore'

export function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setPhone = useAuthStore((s) => s.setPhone)
  const [value, setValue] = useState('')
  const [showError, setShowError] = useState(false)

  const isValid = /^\d{10}$/.test(value)

  const handleContinue = () => {
    if (!isValid) {
      setShowError(true)
      return
    }
    setPhone(value)
    navigate('/billing', { replace: true })
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center bg-gray-50 px-6">
      <div className="mb-10 text-center">
        <div className="mb-3 text-5xl">🏪</div>
        <h1 className="text-2xl font-bold text-gray-900">{t('auth.title')}</h1>
        <p className="mt-2 text-sm text-gray-500">{t('auth.subtitle')}</p>
      </div>

      <input
        type="tel"
        inputMode="numeric"
        maxLength={10}
        autoFocus
        value={value}
        onChange={(e) => {
          setValue(e.target.value.replace(/\D/g, '').slice(0, 10))
          setShowError(false)
        }}
        placeholder={t('auth.phonePlaceholder')}
        className="mb-2 w-full rounded-2xl border-2 border-gray-200 px-5 py-4 text-center text-xl tracking-widest text-gray-900 focus:border-green-600 focus:outline-none"
      />
      {showError && (
        <p className="mb-2 text-center text-sm text-red-600">{t('auth.invalid')}</p>
      )}

      <button
        type="button"
        onClick={handleContinue}
        className="mt-4 min-h-16 w-full rounded-2xl bg-green-600 text-lg font-semibold text-white active:bg-green-700"
      >
        {t('auth.continue')}
      </button>
    </div>
  )
}
