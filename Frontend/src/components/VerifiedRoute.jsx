import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const VerifiedRoute = ({ children }) => {
  const { isLoggedIn, userData, logout, axios } = useAppContext();

  // Not logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // User data not loaded yet → wait
  if (!userData) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  // Not verified
  if (userData?.isAccountVerified === false) {
    return <Navigate to="/email-verify" replace />;
  }

  // Verified → allow access
  return children;
};

export default VerifiedRoute;
