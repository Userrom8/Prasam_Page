/* eslint-disable react/prop-types */
import { createContext, useState, useContext } from "react";

// Use the environment variable for the password
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Check session storage to persist login state across refreshes
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem("isAuthenticated") === "true"
  );

  const login = (password) => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("isAuthenticated", "true");
      setIsAuthenticated(true);
      return true; // Indicate successful login
    }
    return false; // Indicate failed login
  };

  const logout = () => {
    sessionStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
  };

  const value = { isAuthenticated, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context easily
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};
