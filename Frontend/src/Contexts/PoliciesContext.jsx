import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../Contexts/AuthContext";

const PolicyContext = createContext();

export const PolicyProvider = ({ children }) => {
  const [policies, setPolicies] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchPolicies = async () => {
      if (!token) return;
      try {
        const response = await fetch(
          "https://claims-management-system-kkd6.onrender.com/policyholder/policies",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          console.log("Failed to fetch policies");
          return;
        }

        const data = await response.json();
        setPolicies(data);
      } catch (error) {
        console.log("Error fetching policies:", error);
      }
    };

    if (token) {
      fetchPolicies();
    }
  }, [token]); // Only depends on token


  return (
    <PolicyContext.Provider value={{ policies }}>
      {children}
    </PolicyContext.Provider>
  );
};

export const usePolicy = () => useContext(PolicyContext);
