/* eslint-disable react/prop-types */
import { useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

// This file now only exports the provider component.
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem("isAuthenticated") === "true"
  );

  const login = (password) => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("isAuthenticated", "true");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
  };

  const value = { isAuthenticated, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
