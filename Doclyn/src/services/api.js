import axios from 'axios'

export const ACCESS_TOKEN_KEY = 'doclyn_access_token'
export const REFRESH_TOKEN_KEY = 'doclyn_refresh_token'

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'

export const tokenStore = {
  getAccess: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  set: (accessToken, refreshToken) => {
    if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  },
  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { Accept: 'application/json' },
})

/* Request interceptor: attach the bearer token when we have one. */
api.interceptors.request.use((config) => {
  const token = tokenStore.getAccess()
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/*
  Response interceptor: on a 401, try POST /auth/refresh exactly once.
  If the refresh fails (or there is no refresh token), clear storage and go to /login.
*/
let refreshPromise = null

function hardLogout() {
  tokenStore.clear()
  if (window.location.pathname !== '/login') {
    window.location.assign('/login')
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status
    const original = error.config || {}
    const isRefreshCall = String(original.url || '').includes('/auth/refresh')

    if (status !== 401 || original._retried || isRefreshCall) {
      return Promise.reject(error)
    }

    const refreshToken = tokenStore.getRefresh()
    if (!refreshToken) {
      hardLogout()
      return Promise.reject(error)
    }

    original._retried = true

    try {
      if (!refreshPromise) {
        refreshPromise = axios
          .post(`${API_BASE_URL}/auth/refresh`, { refresh_token: refreshToken })
          .finally(() => {
            refreshPromise = null
          })
      }

      const { data } = await refreshPromise
      const payload = data?.data || data || {}
      const newAccess = payload.access_token || payload.accessToken
      const newRefresh = payload.refresh_token || payload.refreshToken || refreshToken

      if (!newAccess) throw new Error('No access token in refresh response')

      tokenStore.set(newAccess, newRefresh)
      original.headers = original.headers || {}
      original.headers.Authorization = `Bearer ${newAccess}`
      return api(original)
    } catch (refreshError) {
      hardLogout()
      return Promise.reject(refreshError)
    }
  },
)

/* Turns any axios/API failure into a single readable string for the UI. */
export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const data = error?.response?.data
  return (
    data?.message ||
    data?.error?.message ||
    (typeof data?.error === 'string' ? data.error : null) ||
    data?.detail ||
    error?.message ||
    fallback
  )
}

/* Uploads a single PDF and returns its file_id. */
export async function uploadFile(file) {
  const form = new FormData()
  form.append('file', file)

  const { data } = await api.post('/files/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  const payload = data?.data || data || {}
  const fileId = payload.file_id || payload.fileId || payload.id

  if (!fileId) throw new Error('Upload succeeded but no file_id was returned.')
  return fileId
}

/* Normalises a tool response into a download URL + display name. */
export function readToolResult(data) {
  const payload = data?.data || data || {}
  const rawUrl =
    payload.download_url ||
    payload.downloadUrl ||
    payload.url ||
    (payload.file_id ? `${API_BASE_URL}/files/${payload.file_id}/download` : null)

  const url = rawUrl && rawUrl.startsWith('http') ? rawUrl : rawUrl ? `${API_BASE_URL}${rawUrl}` : null

  return {
    url,
    filename: payload.filename || payload.file_name || payload.name || 'doclyn-output.pdf',
    size: payload.size ?? payload.bytes ?? null,
  }
}

export default api
