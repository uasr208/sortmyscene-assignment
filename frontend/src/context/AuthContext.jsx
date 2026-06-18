import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // We automatically provision a logged-in user mock profile so our API operations function flawlessly
  const [user, setUser] = useState({
    id: "user_anurag_2026",
    name: "Anurag Singh",
    role: "VIP Applicant",
  });

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
