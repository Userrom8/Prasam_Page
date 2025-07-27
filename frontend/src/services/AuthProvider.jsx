/* eslint-disable react/prop-types */
import { useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const AuthProvider = ({ children }) => {
  // Read the token from localStorage on initial load
  const [token, setToken] = useState(localStorage.getItem("authToken"));

  const saveToken = (userToken) => {
    localStorage.setItem("authToken", userToken);
    setToken(userToken);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setToken(null);
  };

  // The context value now provides the token and functions to manage it
  const value = {
    token,
    saveToken,
    logout,
    // isAuthenticated is now a derived value: true if a token exists, false otherwise
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
