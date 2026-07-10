import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../Contexts/AuthContext";

const PolicyContext = createContext();

export const PolicyProvider = ({ children }) => {
  const [policies, setPolicies] = useState([]);
  const { token } = useAuth();

  const fetchPolicies = async () => {
    if (!token) return;
    try {
      const response = await fetch(
        "http://localhost:9797/policyholder/policies",
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
      // Ensure we only set policies if it is a valid array
      if (Array.isArray(data)) {
        setPolicies(data);
      } else {
        setPolicies([]);
      }
    } catch (error) {
      console.log("Error fetching policies:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPolicies();
    } else {
      setPolicies([]);
    }
  }, [token]);

  return (
    <PolicyContext.Provider value={{ policies, fetchPolicies }}>
      {children}
    </PolicyContext.Provider>
  );
};

export const usePolicy = () => useContext(PolicyContext);
