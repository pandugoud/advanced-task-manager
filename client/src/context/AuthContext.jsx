import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api, { setAuthToken } from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("atm_token") || "");
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("atm_user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  async function login(formData) {
    const response = await api.post("/auth/login", formData);
    const data = response.data;

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("atm_token", data.token);
    localStorage.setItem("atm_user", JSON.stringify(data.user));
    setAuthToken(data.token);
  }

  async function register(formData) {
    const response = await api.post("/auth/register", formData);
    const data = response.data;

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("atm_token", data.token);
    localStorage.setItem("atm_user", JSON.stringify(data.user));
    setAuthToken(data.token);
  }

  function logout() {
    setToken("");
    setUser(null);
    localStorage.removeItem("atm_token");
    localStorage.removeItem("atm_user");
    setAuthToken("");
  }

  const value = useMemo(
    () => ({
      token,
      user,
      login,
      register,
      logout,
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}