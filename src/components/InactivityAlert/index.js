/**
=========================================================
* Inactivity Alert Component
* Detecta inactividad y cierra sesión automáticamente
=========================================================
*/

import { useState, useEffect, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import ArgonTypography from "components/ArgonTypography";
import ArgonButton from "components/ArgonButton";
import { useAuth } from "context/AuthContext";

const INACTIVITY_TIME = 5 * 60 * 1000; // 5 minutos para producción
const COUNTDOWN_TIME = 20; // 20 segundos de countdown

function InactivityAlert() {
  const { logout, isAuthenticated } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN_TIME);
  
  const inactivityTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  // Función para hacer logout
  const handleLogout = () => {
    // Limpiar todos los timers
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    
    logout();
    window.location.href = "/authentication/sign-in";
  };

  // Función para iniciar el timer de inactividad
  const startInactivityTimer = () => {
    // Limpiar timer existente
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    // Crear nuevo timer
    inactivityTimerRef.current = setTimeout(() => {
      setShowWarning(true);
    }, INACTIVITY_TIME);
  };

  // Función para resetear el timer (solo si el warning NO está visible)
  const resetInactivityTimer = () => {
    if (!showWarning) {
      startInactivityTimer();
    }
  };

  // Función para manejar "Sigo Aquí"
  const handleStayActive = () => {
    // Limpiar countdown
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    // Ocultar warning
    setShowWarning(false);
    setCountdown(COUNTDOWN_TIME);

    // Reiniciar timer de inactividad
    startInactivityTimer();
  };

  // Effect para manejar el countdown cuando se muestra el warning
  useEffect(() => {
    if (showWarning) {
      // Resetear countdown
      setCountdown(COUNTDOWN_TIME);
      
      let secondsLeft = COUNTDOWN_TIME;

      countdownIntervalRef.current = setInterval(() => {
        secondsLeft--;
        setCountdown(secondsLeft);

        if (secondsLeft <= 0) {
          clearInterval(countdownIntervalRef.current);
          handleLogout();
        }
      }, 1000);
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [showWarning]);

  // Effect principal para detectar actividad
  useEffect(() => {
    if (!isAuthenticated) {
      // Limpiar todo si no está autenticado
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      return;
    }

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    // Agregar event listeners
    events.forEach(event => {
      document.addEventListener(event, resetInactivityTimer);
    });

    // Iniciar timer al montar
    startInactivityTimer();

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetInactivityTimer);
      });
      
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [isAuthenticated, showWarning]);

  if (!isAuthenticated) return null;

  return (
    <Dialog
      open={showWarning}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
      disableScrollLock
      PaperProps={{
        sx: {
          borderRadius: '12px',
          overflow: 'hidden',
          border: '3px solid #FF9800',
          backgroundColor: '#FFFFFF',
          pointerEvents: 'auto'
        }
      }}
      sx={{
        pointerEvents: 'auto',
        '& .MuiBackdrop-root': {
          pointerEvents: 'none'
        }
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(195deg, #FB8C00 0%, #F57C00 100%)',
          color: '#fff',
          fontSize: '1.25rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          padding: '20px 24px'
        }}
      >
        <Box
          component="span"
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            animation: 'iconPulse 1.5s ease-in-out infinite',
            '@keyframes iconPulse': {
              '0%, 100%': {
                opacity: 1
              },
              '50%': {
                opacity: 0.5
              }
            }
          }}
        >
          ⏰
        </Box>
        Inactividad Detectada
      </DialogTitle>

      <DialogContent sx={{ mt: 3, pb: 2, backgroundColor: '#FFFFFF' }}>
        <ArgonTypography variant="h5" mb={2} textAlign="center" sx={{ color: '#344767' }}>
          Tu sesión está por expirar por inactividad
        </ArgonTypography>

        <Box 
          sx={{ 
            my: 3, 
            textAlign: 'center',
            backgroundColor: '#FFF3E0',
            borderRadius: '12px',
            padding: '20px'
          }}
        >
          <ArgonTypography variant="h2" fontWeight="bold" sx={{ color: '#FF9800' }}>
            {countdown}
          </ArgonTypography>
          <ArgonTypography variant="body2" sx={{ color: '#7B809A' }}>
            segundos restantes
          </ArgonTypography>
        </Box>

        <LinearProgress 
          variant="determinate" 
          value={(countdown / 20) * 100}
          sx={{ 
            height: 8, 
            borderRadius: 4,
            mb: 2,
            backgroundColor: '#FFE0B2',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#FF9800'
            }
          }}
        />

        <Alert severity="warning" sx={{ mt: 2, backgroundColor: '#FFF4E5', color: '#663C00' }}>
          <ArgonTypography variant="body2" sx={{ color: '#663C00' }}>
            <strong>Por seguridad,</strong> cerramos tu sesión después de 5 minutos de inactividad. 
            Si deseas continuar, presiona el botón &quot;Sigo Aquí&quot;.
          </ArgonTypography>
        </Alert>
      </DialogContent>

      <DialogActions sx={{ padding: '16px 24px', justifyContent: 'center', gap: 2, backgroundColor: '#FFFFFF' }}>
        <ArgonButton 
          onClick={handleLogout} 
          color="secondary"
          variant="outlined"
          size="large"
        >
          Cerrar Sesión
        </ArgonButton>
        <ArgonButton 
          onClick={handleStayActive} 
          variant="gradient" 
          color="warning"
          size="large"
          disableRipple={false}
          sx={{
            animation: 'buttonPulse 1s ease-in-out infinite',
            cursor: 'pointer',
            pointerEvents: 'auto',
            zIndex: 9999,
            '@keyframes buttonPulse': {
              '0%': {
                transform: 'scale(1)',
                boxShadow: '0 0 0 0 rgba(255, 152, 0, 0.7)'
              },
              '50%': {
                transform: 'scale(1.05)',
                boxShadow: '0 0 0 10px rgba(255, 152, 0, 0)'
              },
              '100%': {
                transform: 'scale(1)',
                boxShadow: '0 0 0 0 rgba(255, 152, 0, 0)'
              }
            }
          }}
        >
          🔥 Sigo Aquí
        </ArgonButton>
      </DialogActions>
    </Dialog>
  );
}

export default InactivityAlert;
