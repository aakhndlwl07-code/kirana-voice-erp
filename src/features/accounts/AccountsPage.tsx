import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { BigButton } from '../../components/BigButton'

export function AccountsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div>
      <PageHeader title={t('accounts.title')} subtitle={t('accounts.subtitle')} />
      <div className="flex flex-col gap-4">
        <BigButton
          icon="🧑‍🤝‍🧑"
          label={t('accounts.customers')}
          onClick={() => navigate('/accounts/customers')}
        />
        <BigButton
          icon="🚚"
          label={t('accounts.suppliers')}
          variant="secondary"
          onClick={() => navigate('/accounts/suppliers')}
        />
      </div>
    </div>
  )
}
