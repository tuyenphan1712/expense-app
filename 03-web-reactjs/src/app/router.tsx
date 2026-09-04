import { createBrowserRouter } from 'react-router'
import App from '../App'

// Minimal route tree — the demo `App` page is the only route until the
// auth/dashboard features land (see /web-crud). `RequireAdmin` (shared/
// components) is ready to wrap protected routes once those exist.
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
])
