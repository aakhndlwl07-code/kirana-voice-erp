import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/PageHeader'
import { BigButton } from '../../components/BigButton'

export function AccountsPage() {
  const { t } = useTranslation()

  return (
    <div>
      <PageHeader title={t('accounts.title')} subtitle={t('accounts.subtitle')} />
      <div className="flex flex-col gap-4">
        <BigButton icon="🧑‍🤝‍🧑" label={t('accounts.customers')} />
        <BigButton icon="🚚" label={t('accounts.suppliers')} variant="secondary" />
      </div>
    </div>
  )
}
