// Mirrors the backend envelope — see 01-share-docs/API_SPEC.md §4.
// Money fields arrive as JSON strings (e.g. "35000.00"), never numbers.

export interface ApiError {
  code: string
  message: string
  details: string[]
}

export interface ApiSuccessResponse<T> {
  success: true
  data: T
  message: string
  timestamp: string
}

export interface ApiErrorResponse {
  success: false
  error: ApiError
  timestamp: string
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

export interface PageResult<T> {
  items: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}
