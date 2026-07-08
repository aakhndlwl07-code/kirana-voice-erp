import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './app/Layout'
import { RequireAuth } from './app/RequireAuth'
import { LoginPage } from './features/auth/LoginPage'
import { BillingPage } from './features/billing/BillingPage'
import { VoiceBillingPage } from './features/billing/VoiceBillingPage'
import { AccountsPage } from './features/accounts/AccountsPage'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { SettingsPage } from './features/settings/SettingsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<RequireAuth />}>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/billing" replace />} />
            <Route path="/billing" element={<BillingPage />} />
            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="/billing/customer" element={<VoiceBillingPage type="customer" />} />
          <Route path="/billing/supplier" element={<VoiceBillingPage type="supplier" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
