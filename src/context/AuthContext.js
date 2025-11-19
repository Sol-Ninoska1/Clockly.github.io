/**
=========================================================
* Authentication Context for Clockly Dashboard
=========================================================
*/

import { createContext, useContext, useState, useEffect, useReducer } from "react";
import PropTypes from "prop-types";

// Crear el contexto de autenticación
const AuthContext = createContext();

// Estados iniciales
const initialState = {
  isAuthenticated: false,
  token: null,
  companyId: null,
  loading: true,
  user: null
};

// Reducer para manejar estados de autenticación
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        companyId: action.payload.companyId,
        user: action.payload.user,
        loading: false
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        companyId: null,
        user: null,
        loading: false
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload
      };
    case "RESTORE_SESSION":
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        companyId: action.payload.companyId,
        loading: false
      };
    default:
      return state;
  }
};


export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiration = payload.exp * 1000;
      return Date.now() >= expiration;
    } catch (error) {
      return true; 
    }
  };

  // Función para validar token con el backend
  const validateTokenWithBackend = async (token, companyId) => {
    try {
      // Hacer una petición simple al backend para verificar que el token es válido
      const response = await fetch(`/api/Companies/${companyId}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.ok; // Retorna true si el token es válido, false si no
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  };


  useEffect(() => {
    const checkAuthState = async () => {
      const token = localStorage.getItem("authToken");
      const companyId = localStorage.getItem("companyId");
      
      if (token && companyId) {
        // Verificar si el token ha expirado
        if (isTokenExpired(token)) {
          // Token expirado, hacer logout
          localStorage.removeItem("authToken");
          localStorage.removeItem("companyId");
          dispatch({ type: "LOGOUT" });
          return;
        }

        // Validar token con el backend
        const isValid = await validateTokenWithBackend(token, companyId);
        
        if (isValid) {
          dispatch({
            type: "RESTORE_SESSION",
            payload: {
              token,
              companyId: parseInt(companyId, 10)
            }
          });
        } else {
          // Token inválido o revocado, hacer logout
          localStorage.removeItem("authToken");
          localStorage.removeItem("companyId");
          dispatch({ type: "LOGOUT" });
        }
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    checkAuthState();

    // Verificar expiración del token cada minuto
    const intervalId = setInterval(() => {
      const token = localStorage.getItem("authToken");
      if (token && isTokenExpired(token)) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("companyId");
        dispatch({ type: "LOGOUT" });
        window.location.href = "/authentication/sign-in";
      }
    }, 60000); // Cada 60 segundos

    return () => clearInterval(intervalId);
  }, []);

  // Función para hacer login
  const login = async (username, password) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
       //http://localhost:5290/api/Companies
      const response = await fetch("http://apimovil.somee.com/api/Companies/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Username: username,
          Password: password
        })
      });

      if (!response.ok) {
        dispatch({ type: "SET_LOADING", payload: false });
        // Respuesta estándar para cualquier error de autenticación
        throw new Error("Invalid email or password. Please try again.");
      }

      const data = await response.json();

      // Guardar en localStorage
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("companyId", data.companyId.toString());

      // Actualizar estado
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          token: data.token,
          companyId: data.companyId,
          user: { email: username }
        }
      });

      return true;
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      console.error("Login error:", error);
      
      // Si es un error de red, mostrar mensaje de conexión
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error("No se puede conectar con el servidor. Verifica que la API esté corriendo en http://localhost:5290");
      }
      
      throw error;
    }
  };

  // Función para hacer logout
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("companyId");
    dispatch({ type: "LOGOUT" });
  };

  // Función para obtener headers de autenticación
  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Valor del contexto
  const contextValue = {
    ...state,
    login,
    logout,
    getAuthHeaders
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Validación de PropTypes
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// Hook para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider");
  }
  return context;
};

export { AuthContext };