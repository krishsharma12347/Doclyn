import { createContext, useCallback, useContext, useMemo, useState } from "react";
import api, { tokenStore, unwrap } from "../services/api";

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem("doclyn_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() => tokenStore.getAccess());
  const [user, setUser] = useState(() => readStoredUser());

  const login = useCallback(async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const payload = unwrap(response);

    tokenStore.set(payload.access_token, payload.refresh_token);
    setAccessToken(payload.access_token);
    localStorage.setItem("doclyn_user", JSON.stringify(payload.user));
    setUser(payload.user);

    return payload.user;
  }, []);

  // Register does NOT log the user in — backend design intentionally
  // requires a separate login step after account creation.
  const register = useCallback(async ({ name, email, password }) => {
    const response = await api.post("/auth/register", { name, email, password });
    return unwrap(response);
  }, []);

  const logout = useCallback(() => {
    tokenStore.clear();
    localStorage.removeItem("doclyn_user");
    setAccessToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated: Boolean(accessToken),
      login,
      register,
      logout,
    }),
    [user, accessToken, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export default AuthContext;
