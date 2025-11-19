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

import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

// @mui icons
import SaveIcon from "@mui/icons-material/Save";
import RefreshIcon from "@mui/icons-material/Refresh";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonButton from "components/ArgonButton";

// Billing page components
import BaseLayout from "layouts/configuracion/components/BaseLayout";

function Billing() {
  // Estados para manejo de datos y UI
  const [workdayConfig, setWorkdayConfig] = useState(null);
  const [formData, setFormData] = useState({
    workday: '',
    entryTime: '',
    exitTime: '',
    allowedLateMargin: '',
    breakStart: '',
    breakEnd: '',
    breakDuration: '',
    breakMarkingRequired: false,
    workDays: '',
    friday: '',
    saturday: '',
    sunday: '',
    worksOnHolidays: false,
    worksOnMandatoryHolidays: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

 const companyId = localStorage.getItem("companyId");

  const fetchWorkdayConfig = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/Companies/${companyId}/GetConfiguracion`);

      if (!response.ok) {
        if (response.status === 404) {
          // No existe configuración, mantener valores por defecto para crear nueva
          setWorkdayConfig(null);
          setLoading(false);
          return;
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setWorkdayConfig(data);
      
      // Actualizar formulario con datos de la API
      setFormData({
        workday: data.workday || '',
        entryTime: data.entryTime || '',
        exitTime: data.exitTime || '',
        allowedLateMargin: data.allowedLateMargin || '',
        breakStart: data.breakStart || '',
        breakEnd: data.breakEnd || '',
        breakDuration: data.breakDuration || '',
        breakMarkingRequired: data.breakMarkingRequired === 1,
        workDays: data.workDays || '',
        friday: data.friday || '',
        saturday: data.saturday || '',
        sunday: data.sunday || '',
        worksOnHolidays: data.worksOnHolidays === 1,
        worksOnMandatoryHolidays: data.worksOnMandatoryHolidays === 1
      });
    } catch (err) {
      setError(err.message);
      console.error('Error fetching workday config:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchWorkdayConfig();
  }, [companyId]);

  // Manejar cambios en el formulario
  const handleInputChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Guardar configuración (crear o actualizar)
  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      // Convertir booleans a 1/0 para la API
      // Convertir strings vacíos a null para campos opcionales de tiempo
      // Función helper para formatear tiempos
      const formatTime = (timeValue) => {
        if (!timeValue || timeValue.trim() === '') return null;
        // Si ya tiene formato HH:mm:ss, devolverlo tal cual
        if (timeValue.split(':').length === 3) return timeValue;
        // Si tiene formato HH:mm, añadir :00
        return timeValue + ':00';
      };

      const dataToSend = {
        ...formData,
        breakMarkingRequired: formData.breakMarkingRequired ? 1 : 0,
        worksOnHolidays: formData.worksOnHolidays ? 1 : 0,
        worksOnMandatoryHolidays: formData.worksOnMandatoryHolidays ? 1 : 0,
        friday: formatTime(formData.friday),
        saturday: formatTime(formData.saturday),
        sunday: formatTime(formData.sunday),
        entryTime: formatTime(formData.entryTime),
        exitTime: formatTime(formData.exitTime),
        breakStart: formatTime(formData.breakStart),
        breakEnd: formatTime(formData.breakEnd),
      };
      
      let response;
      
      if (workdayConfig) {
      
        response = await fetch(`/api/Companies/${companyId}/updateConfiguracion`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend)
        });
      } else {
     
        response = await fetch(`/api/Companies/${companyId}/InsertConfiguracion`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...dataToSend,
            companyId: parseInt(companyId)
          })
        });
      }

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const savedData = await response.json();
      setWorkdayConfig(savedData);
      setSuccess(`Configuración ${workdayConfig ? 'actualizada' : 'creada'} correctamente`);
      
      // Actualizar formData con la respuesta de la API
      setFormData({
        workday: savedData.workday || '',
        entryTime: savedData.entryTime || '',
        exitTime: savedData.exitTime || '',
        allowedLateMargin: savedData.allowedLateMargin || '',
        breakStart: savedData.breakStart || '',
        breakEnd: savedData.breakEnd || '',
        breakDuration: savedData.breakDuration || '',
        breakMarkingRequired: savedData.breakMarkingRequired === 1,
        workDays: savedData.workDays || '',
        friday: savedData.friday || '',
        saturday: savedData.saturday || '',
        sunday: savedData.sunday || '',
        worksOnHolidays: savedData.worksOnHolidays === 1,
        worksOnMandatoryHolidays: savedData.worksOnMandatoryHolidays === 1
      });
      
      console.log(`Configuración ${workdayConfig ? 'actualizada' : 'creada'} correctamente`);
    } catch (err) {
      setError(`Error al ${workdayConfig ? 'actualizar' : 'crear'} configuración: ${err.message}`);
      console.error('Error saving config:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <BaseLayout stickyNavbar>
        <ArgonBox mt={4} display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </ArgonBox>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout stickyNavbar>
      <ArgonBox mt={4}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <ArgonBox p={3}>
                <ArgonBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <ArgonTypography variant="h5" fontWeight="medium">
                    Configuración de Jornada Laboral
                  </ArgonTypography>
                  <ArgonButton
                    color="info"
                    size="small"
                    startIcon={<RefreshIcon />}
                    onClick={fetchWorkdayConfig}
                    disabled={loading}
                  >
                    Actualizar
                  </ArgonButton>
                </ArgonBox>

                {/* Messages */}
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
                    {success}
                  </Alert>
                )}
                
                <Grid container spacing={3} mt={2}>
                  {/* Jornada y Horarios Básicos */}
                  
                  <Grid item xs={12}>
                    <ArgonBox
                      sx={{
                        backgroundColor: '#7deed52d',
                        color: '#004085',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        border: '1px solid #e0e0e0'
                      }}
                    >
                      <ArgonTypography variant="caption" color="success" fontWeight="medium">
                        <strong>Abreviaturas de días laborales:</strong>
                      </ArgonTypography>
                      <ArgonTypography variant="caption" color="text" display="block" mt={0.5}>
                        • <strong>L-V:</strong> De Lunes a Viernes
                      </ArgonTypography>
                      <ArgonTypography variant="caption" color="text" display="block">
                        • <strong>L-S:</strong> De Lunes a Sábado
                      </ArgonTypography>
                      <ArgonTypography variant="caption" color="text" display="block">
                        • <strong>D-D:</strong> Domingo a Domingo
                      </ArgonTypography>
                    </ArgonBox>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Jornada Semanal (horas)"
                      type="number"
                      value={formData.workday}
                      onChange={handleInputChange('workday')}
                      variant="outlined"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      options={['L-V', 'L-S', 'D-D']}
                      value={formData.workDays || null}
                      onChange={(event, newValue) => {
                        setFormData(prev => ({
                          ...prev,
                          workDays: newValue || ''
                        }));
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Días de Trabajo"
                          variant="outlined"
                          fullWidth
                          placeholder="Selecciona días de trabajo"
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Hora de Entrada"
                      type="time"
                      value={formData.entryTime}
                      onChange={handleInputChange('entryTime')}
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Hora de Salida"
                      type="time"
                      value={formData.exitTime}
                      onChange={handleInputChange('exitTime')}
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Margen de Tolerancia (minutos)"
                      type="number"
                      value={formData.allowedLateMargin}
                      onChange={handleInputChange('allowedLateMargin')}
                      variant="outlined"
                    />
                  </Grid>

                  {/* Configuración de Descansos */}
                  <Grid item xs={12}>
                    <ArgonTypography variant="h6" mt={2} mb={1}>
                      Configuración horario de Colación
                    </ArgonTypography>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Inicio de Colación"
                      type="time"
                      value={formData.breakStart}
                      onChange={handleInputChange('breakStart')}
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Fin de Colación"
                      type="time"
                      value={formData.breakEnd}
                      onChange={handleInputChange('breakEnd')}
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Duración de Colación (minutos)"
                      type="number"
                      value={formData.breakDuration}
                      onChange={handleInputChange('breakDuration')}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.breakMarkingRequired}
                          onChange={handleInputChange('breakMarkingRequired')}
                          color="primary"
                        />
                      }
                      label="Requiere marcar entrada y salida de colación"
                    />
                  </Grid>

                  {/* Horarios Especiales */}
                  <Grid item xs={12}>
                    <ArgonTypography variant="h6" mt={2} mb={1}>
                      Horarios Especiales
                    </ArgonTypography>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Salida Viernes"
                      type="time"
                      value={formData.friday}
                      onChange={handleInputChange('friday')}
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Salida Sábado"
                      type="time"
                      value={formData.saturday}
                      onChange={handleInputChange('saturday')}
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      placeholder="Opcional"
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Salida Domingo"
                      type="time"
                      value={formData.sunday}
                      onChange={handleInputChange('sunday')}
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      placeholder="Opcional"
                    />
                  </Grid>

                  {/* Configuración de Feriados */}
                  <Grid item xs={12}>
                    <ArgonTypography variant="h6" mt={2} mb={1}>
                      Configuración de Feriados
                    </ArgonTypography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.worksOnHolidays}
                          onChange={handleInputChange('worksOnHolidays')}
                          color="primary"
                        />
                      }
                      label="Trabaja en feriados"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.worksOnMandatoryHolidays}
                          onChange={handleInputChange('worksOnMandatoryHolidays')}
                          color="primary"
                        />
                      }
                      label="Trabaja en feriados obligatorios"
                    />
                  </Grid>

                  {/* Botón de Guardar */}
                  <Grid item xs={12}>
                    <ArgonBox mt={3} display="flex" justifyContent="flex-end">
                      <ArgonButton 
                        variant="gradient" 
                        color="success" 
                        onClick={handleSave}
                        disabled={saving}
                        startIcon={<SaveIcon />}
                      >
                        {saving ? 'Guardando...' : 'Guardar Configuración'}
                      </ArgonButton>
                    </ArgonBox>
                  </Grid>
                </Grid>
              </ArgonBox>
            </Card>
          </Grid>
        </Grid>
      </ArgonBox>
    </BaseLayout>
  );
}

export default Billing;
