import { create } from 'zustand'

const STORAGE_KEY = 'kirana-erp-phone'

type AuthState = {
  phone: string | null
  setPhone: (phone: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  phone: localStorage.getItem(STORAGE_KEY),
  setPhone: (phone) => {
    localStorage.setItem(STORAGE_KEY, phone)
    set({ phone })
  },
  logout: () => {
    localStorage.removeItem(STORAGE_KEY)
    set({ phone: null })
  },
}))
