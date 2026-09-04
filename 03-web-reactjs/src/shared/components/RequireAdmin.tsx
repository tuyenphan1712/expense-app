import { Navigate, Outlet } from 'react-router'
import { useAuthStore } from '../stores/authStore'
import { ROUTES } from '../routes'

// Guards protected/admin routes — see WEB-ARCHITECTURE.md §6.
// The server re-checks the ADMIN role on every /admin/* call regardless
// (BE-PROJECT-RULES.md §Security) — this guard is UX only, not security.
export function RequireAdmin() {
  const user = useAuthStore((state) => state.user)

  if (!user) {
    return <Navigate to={ROUTES.login} replace />
  }

  if (user.role !== 'ADMIN') {
    return <p role="alert">403 — Admin access required.</p>
  }

  return <Outlet />
}
