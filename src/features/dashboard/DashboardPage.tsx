import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/PageHeader'

export function DashboardPage() {
  const { t } = useTranslation()

  return (
    <div>
      <PageHeader title={t('dashboard.title')} subtitle={t('dashboard.subtitle')} />
      <div className="rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center text-gray-400">
        📊
      </div>
    </div>
  )
}
