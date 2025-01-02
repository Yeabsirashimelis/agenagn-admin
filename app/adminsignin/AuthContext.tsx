"use client";

import supabase from "@/supabase";
import { createContext, useContext, useState, useEffect } from "react";

// Define the structure of the admin
export interface Admin {
  email: string;
  password: string;
  error?: string;
}

// Define the structure of the context
interface AuthContextType {
  authenticateAdmin: (user: Admin) => Promise<void>; // Updated to match the implementation
  signOutAdmin: () => void;
  isSignedIn: boolean;
  user: Admin | null;
}

// Create context with a default value of `undefined`
const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Admin | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  // Sync with localStorage on app initialization
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsSignedIn(true);
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err);
      }
    }
  }, []);

  // Update localStorage whenever the user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  async function authenticateAdmin(user: Admin) {
    console.log(user);

    // Simulated login check for local credentials
    if (user.email === "shimelisyeabsira123@gmail.com" && user.password === "12345678") {
      setUser(user);
      setIsSignedIn(true);
      console.log("Admin authenticated successfully:", user);
      return;
    }
  }

  function signOutAdmin() {
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
