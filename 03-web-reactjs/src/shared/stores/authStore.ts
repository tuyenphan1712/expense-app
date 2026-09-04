import { create } from 'zustand'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'USER' | 'ADMIN'
}

interface AuthState {
  accessToken: string | null
  user: AuthUser | null
  setSession: (accessToken: string, user: AuthUser) => void
  clearSession: () => void
}

// In-memory only — the admin console has no offline requirement (WEB-ARCHITECTURE.md §1),
// so a page reload re-authenticating via the auth feature's login flow is acceptable.
export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  setSession: (accessToken, user) => set({ accessToken, user }),
  clearSession: () => set({ accessToken: null, user: null }),
}))
