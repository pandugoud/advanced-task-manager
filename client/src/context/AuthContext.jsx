// src/context/AuthContext.js
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api, { setAuthToken } from "../api/api";

const AuthContext = createContext(null);

function getStoredToken() {
  try {
    const t = localStorage.getItem("atm_token");
    if (!t || t === "undefined" || t === "null") return "";
    return t;
  } catch {
    return "";
  }
}

function getStoredUser() {
  try {
    const saved = localStorage.getItem("atm_user");
    if (!saved || saved === "undefined" || saved === "null") return null;
    return JSON.parse(saved);
  } catch {
    localStorage.removeItem("atm_user");
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(() => getStoredUser());

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  async function login(formData) {
    try {
      const res = await api.post("/auth/login", formData);
      let data = res.data;
      if (typeof data === "string") {
        try { data = JSON.parse(data); } catch { data = {}; }
      }

      const safeToken = data?.token || "";
      const safeUser = data?.user || null;

      setToken(safeToken);
      setUser(safeUser);

      if (safeToken) localStorage.setItem("atm_token", safeToken);
      else localStorage.removeItem("atm_token");

      if (safeUser) localStorage.setItem("atm_user", JSON.stringify(safeUser));
      else localStorage.removeItem("atm_user");

      setAuthToken(safeToken);

    } catch (err) {
      throw new Error(err?.response?.data?.message || "Login failed");
    }
  }

  async function register(formData) {
    try {
      const res = await api.post("/auth/register", formData);
      let data = res.data;
      if (typeof data === "string") {
        try { data = JSON.parse(data); } catch { data = {}; }
      }

      const safeToken = data?.token || "";
      const safeUser = data?.user || null;

      setToken(safeToken);
      setUser(safeUser);

      if (safeToken) localStorage.setItem("atm_token", safeToken);
      else localStorage.removeItem("atm_token");

      if (safeUser) localStorage.setItem("atm_user", JSON.stringify(safeUser));
      else localStorage.removeItem("atm_user");

      setAuthToken(safeToken);

    } catch (err) {
      throw new Error(err?.response?.data?.message || "Registration failed");
    }
  }

  function logout() {
    setToken("");
    setUser(null);
    localStorage.removeItem("atm_token");
    localStorage.removeItem("atm_user");
    setAuthToken("");
  }

  const value = useMemo(() => ({ token, user, login, register, logout }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
