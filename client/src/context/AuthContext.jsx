import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api, { setAuthToken } from "../api/api";

const AuthContext = createContext(null);

function getStoredToken() {
  try {
    const token = localStorage.getItem("atm_token");
    if (!token || token === "undefined" || token === "null") {
      return "";
    }
    return token;
  } catch (error) {
    return "";
  }
}

function getStoredUser() {
  try {
    const saved = localStorage.getItem("atm_user");

    if (!saved || saved === "undefined" || saved === "null") {
      return null;
    }

    return JSON.parse(saved);
  } catch (error) {
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
    const response = await api.post("/auth/login", formData);
    const data = response.data;

    const safeToken = data?.token || "";
    const safeUser = data?.user || null;

    setToken(safeToken);
    setUser(safeUser);

    if (safeToken) {
      localStorage.setItem("atm_token", safeToken);
    } else {
      localStorage.removeItem("atm_token");
    }

    if (safeUser) {
      localStorage.setItem("atm_user", JSON.stringify(safeUser));
    } else {
      localStorage.removeItem("atm_user");
    }

    setAuthToken(safeToken);
  }

  async function register(formData) {
    const response = await api.post("/auth/register", formData);
    const data = response.data;

    const safeToken = data?.token || "";
    const safeUser = data?.user || null;

    setToken(safeToken);
    setUser(safeUser);

    if (safeToken) {
      localStorage.setItem("atm_token", safeToken);
    } else {
      localStorage.removeItem("atm_token");
    }

    if (safeUser) {
      localStorage.setItem("atm_user", JSON.stringify(safeUser));
    } else {
      localStorage.removeItem("atm_user");
    }

    setAuthToken(safeToken);
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
