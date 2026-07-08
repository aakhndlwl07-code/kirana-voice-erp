import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

export function RequireAuth() {
  const phone = useAuthStore((s) => s.phone)

  if (!phone) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
