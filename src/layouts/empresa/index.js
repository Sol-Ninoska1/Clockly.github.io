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
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

// @mui icons
import BusinessIcon from "@mui/icons-material/Business";
import DomainIcon from "@mui/icons-material/Domain";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import RefreshIcon from "@mui/icons-material/Refresh";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonButton from "components/ArgonButton";

// Argon Dashboard 2 MUI example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function VRInfo() {
  // Estados para manejo de datos y UI
  const [companyData, setCompanyData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const companyId = localStorage.getItem("companyId");

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/Companies/${companyId}/GetCompany`);

      if (!response.ok) {
        if (response.status === 404) {
          setCompanyData(null);
          setError("No se encontró información de la empresa. Contacta al administrador del sistema.");
          setLoading(false);
          return;
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setCompanyData(data);
      setEditData({
        name: data.name,
        dominio: data.dominio
      });
    } catch (err) {
      setError(err.message);
      console.error('Error fetching company data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchCompanyData();
    }
  }, [companyId]);

  const getCurrentPlan = () => {
    if (!companyData) return null;
    
    return {
      id: companyData.plan,
      label: companyData.planDescripcion || `Plan ${companyData.plan}`,
      description: `Hasta ${companyData.empleados || 'N/A'} empleados, ${companyData.administradores || 'N/A'} administradores`,
      color: getPlanColor(companyData.plan)
    };
  };

  const getPlanColor = (planId) => {
    switch(planId) {
      case 1: return "primary";
      case 2: return "success"; 
      case 3: return "warning";
      case 4: return "error";
      default: return "info";
    }
  };

  const handleInputChange = (field) => (event) => {
    setEditData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleEdit = () => {
    setEditData({
      name: companyData.name,
      dominio: companyData.dominio
    });
    setIsEditing(true);
  };

  // Cancelar edición
  const handleCancel = () => {
    setEditData({
      name: companyData.name,
      dominio: companyData.dominio
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const response = await fetch(`/api/Companies/${companyId}/UpdateCompany/${companyData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editData.name,
          dominio: editData.dominio
        })
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      await fetchCompanyData();
      setIsEditing(false);
      
      console.log('Empresa actualizada correctamente');
    } catch (err) {
      setError(`Error al actualizar empresa: ${err.message}`);
      console.error('Error saving company:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <ArgonBox py={3} display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </ArgonBox>
        <Footer />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ArgonBox py={3}>
        <Grid container spacing={3} justifyContent="center">
          {/* Header */}
          <Grid item xs={12}>
            <ArgonBox mb={3} textAlign="center">
              <ArgonTypography variant="h3" fontWeight="bold" gutterBottom>
                Información de la Empresa
              </ArgonTypography>
              <ArgonTypography variant="body1" color="text">
                Gestiona la información básica de tu empresa
              </ArgonTypography>
            </ArgonBox>
          </Grid>

          {/* Error Alert */}
          {error && (
            <Grid item xs={12}>
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            </Grid>
          )}

          {/* Tarjeta Principal de Información */}
          <Grid item xs={12} md={8} lg={6}>
            <Card>
              <ArgonBox p={4}>
                <ArgonBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <ArgonTypography variant="h5" fontWeight="medium">
                    Datos de la Empresa
                  </ArgonTypography>
                  <ArgonBox display="flex" gap={1}>
                    {companyData && !isEditing && (
                      <>
                        <ArgonButton
                          variant="outlined"
                          color="info"
                          size="small"
                          startIcon={<RefreshIcon />}
                          onClick={fetchCompanyData}
                        >
                          Actualizar
                        </ArgonButton>
                        <ArgonButton
                          variant="gradient"
                          color="info"
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={handleEdit}
                        >
                          Editar
                        </ArgonButton>
                      </>
                    )}
                    {isEditing && (
                      <>
                        <ArgonButton
                          variant="gradient"
                          color="success"
                          size="small"
                          startIcon={<SaveIcon />}
                          onClick={handleSave}
                          disabled={saving || !editData.name || !editData.dominio}
                        >
                          {saving ? 'Guardando...' : 'Guardar'}
                        </ArgonButton>
                        <ArgonButton
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<CancelIcon />}
                          onClick={handleCancel}
                          disabled={saving}
                        >
                          Cancelar
                        </ArgonButton>
                      </>
                    )}
                  </ArgonBox>
                </ArgonBox>

                <Grid container spacing={3}>
                  {/* Nombre de la Empresa */}
                  <Grid item xs={12}>
                    <ArgonBox display="flex" alignItems="center" mb={2}>
                      <BusinessIcon color="primary" sx={{ mr: 2, fontSize: "1.5rem" }} />
                      <ArgonTypography variant="h6" color="text">
                        Nombre de la Empresa
                      </ArgonTypography>
                    </ArgonBox>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        value={editData.name || ''}
                        onChange={handleInputChange('name')}
                        variant="outlined"
                        placeholder="Ingrese el nombre de la empresa"
                        required
                      />
                    ) : (
                      <ArgonBox
                        p={2}
                        bgcolor="grey.100"
                        borderRadius="lg"
                        border="1px solid"
                        borderColor="grey.300"
                      >
                        <ArgonTypography variant="h4" fontWeight="bold" color="dark">
                          {companyData?.name || 'No configurado'}
                        </ArgonTypography>
                      </ArgonBox>
                    )}
                  </Grid>

                  {/* Dominio */}
                  <Grid item xs={12}>
                    <ArgonBox display="flex" alignItems="center" mb={2}>
                      <DomainIcon color="success" sx={{ mr: 2, fontSize: "1.5rem" }} />
                      <ArgonTypography variant="h6" color="text">
                        Dominio de Email
                      </ArgonTypography>
                    </ArgonBox>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        value={editData.dominio || ''}
                        onChange={handleInputChange('dominio')}
                        variant="outlined"
                        placeholder="@empresa.com"
                        helperText="Formato: @empresa.com"
                        required
                      />
                    ) : (
                      <ArgonBox
                        p={2}
                        bgcolor="grey.100"
                        borderRadius="lg"
                        border="1px solid"
                        borderColor="grey.300"
                      >
                        <ArgonTypography variant="h5" fontWeight="medium" color="success">
                          {companyData?.dominio || 'No configurado'}
                        </ArgonTypography>
                      </ArgonBox>
                    )}
                  </Grid>

                  {/* Plan */}
                  <Grid item xs={12}>
                    <ArgonBox display="flex" alignItems="center" mb={2}>
                      <WorkspacePremiumIcon color="warning" sx={{ mr: 2, fontSize: "1.5rem" }} />
                      <ArgonTypography variant="h6" color="text">
                        Plan Actual
                      </ArgonTypography>
                    </ArgonBox>
                    {/* Solo lectura - no editable */}
                    <ArgonBox
                      p={2}
                      bgcolor="grey.100"
                      borderRadius="lg"
                      border="1px solid"
                      borderColor="grey.300"
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <ArgonBox>
                        <ArgonTypography variant="h5" fontWeight="bold" color="dark">
                          {getCurrentPlan()?.label || 'Plan no disponible'}
                        </ArgonTypography>
                        <ArgonTypography variant="body2" color="text">
                          {getCurrentPlan()?.description || 'Sin descripción'}
                        </ArgonTypography>
                      </ArgonBox>
                      <Chip
                        label={`Plan ${companyData?.plan || 'N/A'}`}
                        color={getCurrentPlan()?.color || 'default'}
                        variant="filled"
                        size="medium"
                      />
                    </ArgonBox>
                    <ArgonTypography variant="caption" color="text" mt={1} display="block">
                      * El plan solo puede ser modificado por el administrador del sistema
                    </ArgonTypography>
                  </Grid>
                </Grid>
              </ArgonBox>
            </Card>
          </Grid>

          {/* Tarjetas de Información Adicional */}
          {companyData && (
            <Grid item xs={12} md={8} lg={6}>
              <Grid container spacing={3}>
                {/* Información del Plan */}
                <Grid item xs={12}>
                  <Card>
                    <ArgonBox p={3}>
                      <ArgonTypography variant="h6" fontWeight="medium" mb={2}>
                        Detalles del Plan
                      </ArgonTypography>
                      <ArgonBox>
                      <ArgonTypography variant="body2" color="text" mb={1}>
                        <strong>Plan Actual:</strong> {getCurrentPlan()?.label || 'No disponible'}
                      </ArgonTypography>
                      <ArgonTypography variant="body2" color="text" mb={1}>
                        <strong>Límite:</strong> {getCurrentPlan()?.description || 'No disponible'}
                      </ArgonTypography>
                      <ArgonTypography variant="body2" color="text" mb={1}>
                        <strong>ID del Plan:</strong> {companyData.plan}
                      </ArgonTypography>
                      <ArgonTypography variant="body2" color="text" mb={1}>
                        <strong>Empleados permitidos:</strong> {companyData.empleados || 'N/A'}
                      </ArgonTypography>
                      <ArgonTypography variant="body2" color="text">
                        <strong>Administradores permitidos:</strong> {companyData.administradores || 'N/A'}
                      </ArgonTypography>
                      </ArgonBox>
                    </ArgonBox>
                  </Card>
                </Grid>

                {/* Estadísticas Rápidas */}
                <Grid item xs={12}>
                  <Card>
                    <ArgonBox p={3}>
                      <ArgonTypography variant="h6" fontWeight="medium" mb={2}>
                        Resumen
                      </ArgonTypography>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <ArgonBox textAlign="center">
                            <ArgonTypography variant="h4" color="primary">
                              {companyData.id}
                            </ArgonTypography>
                            <ArgonTypography variant="caption" color="text">
                              ID Empresa
                            </ArgonTypography>
                          </ArgonBox>
                        </Grid>
                        <Grid item xs={4}>
                          <ArgonBox textAlign="center">
                            <ArgonTypography variant="h4" color="success">
                              {getCurrentPlan()?.id || 'N/A'}
                            </ArgonTypography>
                            <ArgonTypography variant="caption" color="text">
                              Plan Activo
                            </ArgonTypography>
                          </ArgonBox>
                        </Grid>
                        <Grid item xs={4}>
                          <ArgonBox textAlign="center">
                            <ArgonTypography variant="h4" color="info">
                              {companyData.empleados || 'N/A'}
                            </ArgonTypography>
                            <ArgonTypography variant="caption" color="text">
                              Max Empleados
                            </ArgonTypography>
                          </ArgonBox>
                        </Grid>
                      </Grid>
                    </ArgonBox>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </ArgonBox>
      <Footer />
    </DashboardLayout>
  );
}

export default VRInfo;
