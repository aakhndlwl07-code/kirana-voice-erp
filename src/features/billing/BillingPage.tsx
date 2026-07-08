import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { BigButton } from '../../components/BigButton'

export function BillingPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div>
      <PageHeader title={t('billing.title')} subtitle={t('billing.subtitle')} />
      <div className="flex flex-col gap-4">
        <BigButton
          icon="🛒"
          label={t('billing.customerBill')}
          onClick={() => navigate('/billing/customer')}
        />
        <BigButton
          icon="📦"
          label={t('billing.supplierBill')}
          variant="secondary"
          onClick={() => navigate('/billing/supplier')}
        />
      </div>
    </div>
  )
}
