import type { ReactNode } from 'react'

type BigButtonProps = {
  icon: string
  label: string
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  children?: ReactNode
}

export function BigButton({ icon, label, onClick, variant = 'primary', children }: BigButtonProps) {
  const colors =
    variant === 'primary'
      ? 'bg-green-600 text-white active:bg-green-700'
      : 'bg-white text-gray-900 border-2 border-gray-200 active:bg-gray-100'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full min-h-20 items-center gap-4 rounded-2xl px-5 py-4 text-left shadow-sm transition-colors ${colors}`}
    >
      <span className="text-3xl leading-none" aria-hidden="true">
        {icon}
      </span>
      <span className="text-lg font-semibold">{label}</span>
      {children}
    </button>
  )
}
