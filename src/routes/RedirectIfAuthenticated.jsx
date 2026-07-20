import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Protege rutas públicas (login, selección de tipo, formularios de registro)
 * para que alguien que ya tiene sesión iniciada no vuelva a verlas.
 */
const RedirectIfAuthenticated = ({ children }) => {
  const { isLoggedIn, loadingAuth } = useAuth();

  if (loadingAuth) {
    return null;
  }

  if (isLoggedIn) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default RedirectIfAuthenticated;