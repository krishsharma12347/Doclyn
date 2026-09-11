import axios from "axios";

// FIX: this was defaulting to port 5000. The Node backend runs on port
// 3000 (see backend-node/.env → PORT=3000). Every request was failing
// with a connection error because nothing was listening on 5000.
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

const ACCESS_KEY = "doclyn_access_token";
const REFRESH_KEY = "doclyn_refresh_token";

export const tokenStore = {
  getAccess: () => localStorage.getItem(ACCESS_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  set: (access, refresh) => {
    if (access) localStorage.setItem(ACCESS_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // merge/compress can take a little while server-side
});

api.interceptors.request.use((config) => {
  const token = tokenStore.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On a 401, try refreshing the access token exactly once. If that also
// fails, the session is dead — clear it and send the user to /login.
let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retried) {
      original._retried = true;
      try {
        if (!refreshPromise) {
          refreshPromise = axios
            .post(`${BASE_URL}/auth/refresh`, { refresh_token: tokenStore.getRefresh() })
            .finally(() => {
              refreshPromise = null;
            });
        }
        const { data } = await refreshPromise;
        const newAccess = data?.data?.access_token;
        if (!newAccess) throw new Error("No access token in refresh response");
        tokenStore.set(newAccess, null);
        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);
      } catch {
        tokenStore.clear();
        localStorage.removeItem("doclyn_user");
        if (window.location.pathname !== "/login") {
          window.location.assign("/login");
        }
      }
    }
    return Promise.reject(error);
  }
);

/** Pulls a readable message out of any axios/network error. */
export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  return error?.response?.data?.message || error?.message || fallback;
}

/** Backend wraps everything as { success, data, message } — unwrap consistently. */
export function unwrap(response) {
  return response?.data?.data ?? response?.data;
}

/** Uploads a single file, returns its file_id. */
export async function uploadFile(file) {
  const form = new FormData();
  form.append("file", file);
  const response = await api.post("/files/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return unwrap(response).file_id;
}

export default api;
