import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'
import type { ApiResponse } from '../types/api'
import { useAuthStore } from '../stores/authStore'

// Raw axios instance — injects the Bearer token; feature services should
// prefer `apiClient` below rather than calling this directly.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api/v1',
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // TODO(auth feature): retry once via POST /auth/refresh before giving up —
      // for now just drop the stale session so <RequireAdmin> redirects to /login.
      useAuthStore.getState().clearSession()
    }
    return Promise.reject(error)
  },
)

async function unwrap<T>(request: Promise<AxiosResponse<ApiResponse<T>>>): Promise<T> {
  const response = await request
  const body = response.data
  if (body.success) {
    return body.data
  }
  throw body.error
}

// Typed wrapper that unwraps the ApiResponse envelope (API_SPEC.md §4) so
// feature services work with the payload directly instead of the envelope.
export const apiClient = {
  get: <T>(url: string, config?: AxiosRequestConfig) => unwrap<T>(api.get(url, config)),
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    unwrap<T>(api.post(url, data, config)),
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    unwrap<T>(api.patch(url, data, config)),
  delete: <T>(url: string, config?: AxiosRequestConfig) => unwrap<T>(api.delete(url, config)),
}
