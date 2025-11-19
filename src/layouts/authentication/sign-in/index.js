/**
=========================================================
* Argon Dashboard 2 MUI - v3.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-material-ui
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState } from "react";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Switch from "@mui/material/Switch";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Icon from "@mui/material/Icon";
import InputAdornment from "@mui/material/InputAdornment";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonInput from "components/ArgonInput";
import ArgonButton from "components/ArgonButton";

// Authentication layout components
import IllustrationLayout from "layouts/authentication/components/IllustrationLayout";

// Context
import { useAuth } from "context/AuthContext";

// Image
import bgImage from "assets/images/login.png";

function Illustration() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/inicio");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <IllustrationLayout
      title="Bienvenido a Clockly"
      description="Ingresa tus credenciales para acceder al panel de administración"
      illustration={{
        image: bgImage,
        title: '"Gestión Inteligente de Asistencia"',
        description:
          "Controla y monitorea la asistencia de tu equipo con tecnología moderna y confiable.",
      }}
    >
      <ArgonBox component="form" role="form" onSubmit={handleSubmit}>
        {error && (
          <ArgonBox mb={3}>
            <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
          </ArgonBox>
        )}
        
        <ArgonBox mb={3}>
          <ArgonTypography variant="body2" color="text" mb={1} fontWeight="medium">
            Correo Electrónico
          </ArgonTypography>
          <ArgonInput 
            type="text" 
            placeholder="admin@ejemplo.com" 
            size="large" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <Icon sx={{ color: "#344767", fontSize: "1.2rem" }}>email</Icon>
              </InputAdornment>
            }
            sx={{
              "& .MuiInputBase-root": {
                borderRadius: 2,
                padding: "12px 16px",
              }
            }}
          />
        </ArgonBox>
        
        <ArgonBox mb={3}>
          <ArgonTypography variant="body2" color="text" mb={1} fontWeight="medium">
            Contraseña
          </ArgonTypography>
          <ArgonInput 
            type="password" 
            placeholder="••••••••" 
            size="large" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <Icon sx={{ color: "#344767", fontSize: "1.2rem" }}>lock</Icon>
              </InputAdornment>
            }
            sx={{
              "& .MuiInputBase-root": {
                borderRadius: 2,
                padding: "12px 16px",
              }
            }}
          />
        </ArgonBox>
        
        <ArgonBox display="flex" alignItems="center" mb={3}>
          <Switch 
            checked={rememberMe} 
            onChange={handleSetRememberMe}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: "#17c1e8",
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#17c1e8",
              },
            }}
          />
          <ArgonTypography
            variant="button"
            fontWeight="regular"
            onClick={handleSetRememberMe}
            sx={{ cursor: "pointer", userSelect: "none", ml: 1 }}
          >
            Recordarme
          </ArgonTypography>
        </ArgonBox>
        
        <ArgonBox mt={4} mb={2}>
          <ArgonButton 
            type="submit"
            color="info" 
            size="large" 
            fullWidth
            disabled={loading}
            sx={{
              height: "48px",
              borderRadius: 2,
              fontSize: "1rem",
              fontWeight: "bold",
              textTransform: "none",
              boxShadow: "0 4px 20px 0 rgba(23, 193, 232, 0.4)",
              "&:hover": {
                boxShadow: "0 6px 25px 0 rgba(23, 193, 232, 0.6)",
                transform: "translateY(-1px)",
              },
              "&:disabled": {
                opacity: 0.6,
              },
            }}
          >
            {loading ? (
              <ArgonBox display="flex" alignItems="center" gap={1}>
                <CircularProgress size={20} color="inherit" />
                <span>Iniciando...</span>
              </ArgonBox>
            ) : (
              <ArgonBox display="flex" alignItems="center" gap={1}>
                <Icon>login</Icon>
                <span>Iniciar Sesión</span>
              </ArgonBox>
            )}
          </ArgonButton>
        </ArgonBox>
      </ArgonBox>
    </IllustrationLayout>
  );
}

export default Illustration;
