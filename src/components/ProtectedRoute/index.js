import { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "context/AuthContext";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import CircularProgress from "@mui/material/CircularProgress";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, logout, getAuthHeaders } = useAuth();
  const [validating, setValidating] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const validateAccess = async () => {
      // Si no está autenticado, no validar
      if (!isAuthenticated) {
        setValidating(false);
        return;
      }

      // Validar que el token en localStorage existe
      const token = localStorage.getItem("authToken");
      const companyId = localStorage.getItem("companyId");

      if (!token || !companyId) {
        logout();
        setValidating(false);
        return;
      }

      // Verificar que el token no ha sido manipulado
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiration = payload.exp * 1000;
        
        if (Date.now() >= expiration) {
          // Token expirado
          logout();
          setValidating(false);
          return;
        }
      } catch (error) {
        // Token malformado
        logout();
        setValidating(false);
        return;
      }

      setValidating(false);
    };

    validateAccess();
  }, [location.pathname, isAuthenticated, logout]);

  if (loading || validating) {
    return (
      <ArgonBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </ArgonBox>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/authentication/sign-in" replace />;
  }

  return children;
}

// Validación de PropTypes
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default ProtectedRoute;