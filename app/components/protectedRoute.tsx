
import { useAuth } from "../adminsignin/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <div>Redirecting...</div>;
  }

  return children;
};

export default ProtectedRoute;