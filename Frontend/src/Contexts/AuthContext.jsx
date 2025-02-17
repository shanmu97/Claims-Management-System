import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState("");
  const isLoggedIn = !!token;
  const [id,setId] = useState("")
  const [phId,setPHID] = useState("")

  const login = (authToken, userRole) => {
    setToken(authToken);
    setRole(userRole);
  };
  console.log(id)
  console.log(phId)
  
  const logout = () => {
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, role, login, logout , setRole,id,setId,phId,setPHID}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
