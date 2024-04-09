import { Navigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../database-config";
import { AuthContext } from "./AuthProvider";

function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (user) {
    // console.log('child',children)
    return children;
  }

  return <Navigate to="/login" />;
}

export default ProtectedRoute;
