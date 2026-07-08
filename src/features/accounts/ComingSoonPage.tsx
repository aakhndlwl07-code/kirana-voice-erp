import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

type Props = {
  title: string
}

export function ComingSoonPage({ title }: Props) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div>
      <button
        type="button"
        onClick={() => navigate('/accounts')}
        className="mb-4 text-sm font-medium text-gray-500"
      >
        ← {t('billing.back')}
      </button>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">{title}</h1>
      <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-gray-200 px-4 py-12 text-center text-gray-400">
        <span className="mb-3 text-4xl">🚧</span>
        <p className="text-sm">{t('accounts.comingSoon')}</p>
      </div>
    </div>
  )
}
