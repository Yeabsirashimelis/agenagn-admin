"use client"

import { createContext, useContext, useState, useEffect } from "react";

// Define the structure of the admin
export interface Admin {
  email: string;
  password: string;
  error:string;
}

// Define the structure of the context
interface AuthContextType {
  authenticateAdmin: (personToSignIn: Admin) => Promise<void>;
  signOutAdmin: () => void;
  isSignedIn: boolean;
  user: Admin | null;
}

// Create context with a default value of `undefined`
const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Admin | null>(() =>
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [isSignedIn, setIsSignedIn] = useState(!!user);

  // Sync with localStorage on app initialization
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (storedUser) {
      setUser(storedUser);
      setIsSignedIn(true);
    }
  }, []);

  // Authenticate an admin and update the context
  async function authenticateAdmin(personToSignIn: Admin) {
    try {
      const res = await fetch(`https://localhost:8080/admin/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(personToSignIn),
      });

      const data: Admin = await res.json();

      if (!res.ok) throw new Error(data.error);

      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      setIsSignedIn(true);
    } catch (error) {
      console.error("Failed to authenticate admin:", error);
    }
  }

  // Sign out the admin
  function signOutAdmin() {
    localStorage.removeItem("user");
    setUser(null);
    setIsSignedIn(false);
  }

  return (
    <AuthContext.Provider
      value={{
        authenticateAdmin,
        signOutAdmin,
        isSignedIn,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for consuming the context
function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
