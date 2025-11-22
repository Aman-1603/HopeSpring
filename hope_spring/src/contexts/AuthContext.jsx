import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // { id, fullName, email, role }
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, read from localStorage
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("hsToken") || localStorage.getItem("token");
      const storedUser = localStorage.getItem("hsUser");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Error reading auth from localStorage:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Optional: helper to update on login (if you want to call this from Login later)
  const login = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("hsToken", newToken);
    localStorage.setItem("hsUser", JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("hsToken");
    localStorage.removeItem("hsUser");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
