import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("authToken") || null);
  const [role, setRole] = useState(() => localStorage.getItem("userRole") || "");
  const [id, setId] = useState(() => localStorage.getItem("userId") || "");
  const [phId, setPHID] = useState(() => localStorage.getItem("policyholderId") || "");
  const isLoggedIn = !!token;

  const login = (authToken, userRole) => {
    setToken(authToken);
    setRole(userRole);
    localStorage.setItem("authToken", authToken);
    localStorage.setItem("userRole", userRole);
  };

  const logout = () => {
    setToken(null);
    setRole("");
    setId("");
    setPHID("");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("policyholderId");
  };

  // Sync state changes with localStorage
  useEffect(() => {
    if (id) {
      localStorage.setItem("userId", id);
    } else {
      localStorage.removeItem("userId");
    }
  }, [id]);

  useEffect(() => {
    if (phId) {
      localStorage.setItem("policyholderId", phId);
    } else {
      localStorage.removeItem("policyholderId");
    }
  }, [phId]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, role, login, logout, setRole, id, setId, phId, setPHID }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
