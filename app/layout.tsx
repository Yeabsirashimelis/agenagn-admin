"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Bounce, ToastContainer } from "react-toastify";
import QueryProvider from "./components/QueryProvider";
import { AuthProvider, useAuth } from "./adminsignin/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function AuthChecker({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (isSignedIn) {
        // Redirect to home if signed in
        router.push("/");
      } else {
        // Redirect to sign-in page if not signed in
        router.push("/adminsignin");
      }
      setCheckingAuth(false); // Set checkingAuth to false after navigation
    };

    checkAuth(); // Call the checkAuth function
  }, [isSignedIn, router]); // Dependencies only include isSignedIn and router

  if (checkingAuth) {
    return <div>Loading...</div>; // Show loading if checking auth
  }

  return <>{children}</>; // Render children if authenticated
}






export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Toast container */}
        <ToastContainer
          position="top-center"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
        />
        <AuthProvider>
          <QueryProvider>
            <AuthChecker>{children}</AuthChecker>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
