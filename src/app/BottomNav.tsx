import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const TABS = [
  { to: '/billing', icon: '🧾', key: 'billing' },
  { to: '/accounts', icon: '📒', key: 'accounts' },
  { to: '/dashboard', icon: '📊', key: 'dashboard' },
  { to: '/settings', icon: '⚙️', key: 'settings' },
] as const

export function BottomNav() {
  const { t } = useTranslation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 border-t border-gray-200 bg-white shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
      <ul className="mx-auto flex max-w-md">
        {TABS.map((tab) => (
          <li key={tab.to} className="flex-1">
            <NavLink
              to={tab.to}
              className={({ isActive }) =>
                `flex min-h-16 flex-col items-center justify-center gap-0.5 py-2 text-xs font-medium transition-colors ${
                  isActive ? 'text-green-700' : 'text-gray-500'
                }`
              }
            >
              <span className="text-2xl leading-none" aria-hidden="true">
                {tab.icon}
              </span>
              <span>{t(`nav.${tab.key}`)}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
