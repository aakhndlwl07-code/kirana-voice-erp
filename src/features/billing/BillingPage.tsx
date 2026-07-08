import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/PageHeader'
import { BigButton } from '../../components/BigButton'

export function BillingPage() {
  const { t } = useTranslation()

  return (
    <div>
      <PageHeader title={t('billing.title')} subtitle={t('billing.subtitle')} />
      <div className="flex flex-col gap-4">
        <BigButton icon="🛒" label={t('billing.customerBill')} />
        <BigButton icon="📦" label={t('billing.supplierBill')} variant="secondary" />
      </div>
    </div>
  )
}
