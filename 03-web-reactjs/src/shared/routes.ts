// Route path constants — feature skills should import these rather than
// hardcoding path strings. See WEB-ARCHITECTURE.md §6 Routing Structure.
export const ROUTES = {
  login: '/login',
  dashboard: '/dashboard',
  users: '/users',
  categories: '/categories',
  reports: '/reports',
  settings: '/settings',
  audit: '/audit',
} as const
