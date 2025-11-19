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

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Switch from "@mui/material/Switch";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import { useState, useEffect } from "react";

// @mui icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import RefreshIcon from "@mui/icons-material/Refresh";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonButton from "components/ArgonButton";

// Argon Dashboard 2 MUI examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Auth Context
import { useAuth } from "context/AuthContext";

function Tables() {
  const { getAuthHeaders } = useAuth();
  
  // Estados para la gestión de empleados
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const companyId = localStorage.getItem("companyId");

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    secondLastName: '',
    role: '',
    client: '',
    rut: '',
    email: '',
    mustChangePassword: false
  });


  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/Companies/${companyId}/users`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = "/authentication/sign-in";
          return;
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching employees:', err);
      
      // Datos de ejemplo para desarrollo (remover en producción)
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar empleados al montar el componente
  useEffect(() => {
    fetchEmployees();
  }, [companyId]);

  // Función para convertir base64 a imagen
  const getImageSrc = (base64String) => {
    if (!base64String) return null;
    return `data:image/jpeg;base64,${base64String}`;
  };

  // Manejar apertura del diálogo para agregar nuevo empleado
  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsEditing(false);
    setFormData({
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      secondLastName: '',
      role: '',
      client: '',
      rut: '',
      email: '',
      mustChangePassword: false
    });
    setOpenDialog(true);
  };

  // Manejar edición de empleado
  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsEditing(true);
    setFormData({
      username: employee.username,
      password: '', // No mostrar la contraseña actual
      firstName: employee.firstName,
      lastName: employee.lastName,
      secondLastName: employee.secondLastName,
      role: employee.role,
      client: employee.client,
      rut: employee.rut,
      email: employee.email,
      mustChangePassword: employee.mustChangePassword
    });
    setOpenDialog(true);
  };

  // Manejar eliminación de empleado
  const handleDeleteEmployee = (employeeId) => {
    setEmployeeToDelete(employeeId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteEmployee = async () => {
    if (!employeeToDelete) return;
    
    try {
      const response = await fetch(`/api/Companies/${companyId}/DeleteUsers/${employeeToDelete}`, { 
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = "/authentication/sign-in";
          return;
        }
        const errorText = await response.text();
        setError(errorText || `Error ${response.status}: ${response.statusText}`);
        setDeleteDialogOpen(false);
        setEmployeeToDelete(null);
        setErrorDialogOpen(true);
        return;
      }
      
      const successText = await response.text();
      setEmployees(employees.filter(emp => emp.id !== employeeToDelete));
      setSuccessMessage(successText || 'Empleado eliminado exitosamente');
      console.log(`Empleado ${employeeToDelete} eliminado`);
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
      setSuccessDialogOpen(true);
    } catch (err) {
      setError('Error al eliminar empleado: ' + err.message);
      console.error('Error deleting employee:', err);
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
      setErrorDialogOpen(true);
    }
  };

  // Manejar cambios en el formulario
  const handleFormChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Guardar cambios
  const handleSave = async () => {
    try {
      if (isEditing) {
        // Actualizar empleado existente
        const response = await fetch(`/api/Companies/${companyId}/UpdateUsers/${selectedEmployee.id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            username: formData.username,
            role: formData.role,
            client: formData.client,
            rut: formData.rut,
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            secondLastName: formData.secondLastName
          })
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = "/authentication/sign-in";
            return;
          }
          const errorText = await response.text();
          setError(errorText || `Error ${response.status}: Error al actualizar el empleado`);
          setOpenDialog(false);
          setErrorDialogOpen(true);
          return;
        }
        
        const updatedEmployee = await response.json();
        setEmployees(employees.map(emp => 
          emp.id === selectedEmployee.id ? updatedEmployee : emp
        ));
        setSuccessMessage('Empleado actualizado exitosamente');
        console.log('Empleado actualizado:', updatedEmployee);
        setSuccessDialogOpen(true);
      } else {
        // Agregar nuevo empleado
        // const response = await fetch('/api/users', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ ...formData, companyId })
        // });
        
        const newEmployee = {
          id: Date.now(),
          companyId,
          ...formData,
          imagen: ''
        };
        setEmployees([...employees, newEmployee]);
        setSuccessMessage('Nuevo empleado agregado exitosamente');
        console.log('Nuevo empleado agregado:', newEmployee);
        setSuccessDialogOpen(true);
      }
      setOpenDialog(false);
    } catch (err) {
      setError('Error al guardar empleado: ' + err.message);
      console.error('Error saving employee:', err);
      setOpenDialog(false);
      setErrorDialogOpen(true);
    }
  };

  // Manejar cambio de contraseña obligatorio
  const handlePasswordChangeToggle = async (employeeId, value) => {
    try {
      // Aquí debes implementar la llamada PATCH a tu API
      // const response = await fetch(`/api/users/${employeeId}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ mustChangePassword: value })
      // });
      
      setEmployees(employees.map(emp => 
        emp.id === employeeId ? { ...emp, mustChangePassword: value } : emp
      ));
      console.log(`Empleado ${employeeId} - Cambio de contraseña obligatorio: ${value}`);
    } catch (err) {
      setError('Error al actualizar configuración de contraseña');
      console.error('Error updating password setting:', err);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <ArgonBox py={3} display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
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

        {/* Header con botones de acción */}
        <ArgonBox mb={3} display="flex" justifyContent="space-between" alignItems="center">
          <ArgonTypography variant="h4" fontWeight="bold">
            Gestión de Empleados
          </ArgonTypography>
          <ArgonBox display="flex" gap={2}>
            <ArgonButton 
              variant="outlined" 
              color="info" 
              onClick={fetchEmployees}
              startIcon={<RefreshIcon />}
            >
              Actualizar
            </ArgonButton>
            {/* <ArgonButton 
              variant="gradient" 
              color="success" 
              onClick={handleAddEmployee}
              startIcon={<AddIcon />}
            >
              Agregar Empleado
            </ArgonButton> */}
          </ArgonBox>
        </ArgonBox>

        {/* Tarjetas de resumen */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={3}>
            <Card>
              <ArgonBox p={2} textAlign="center">
                <ArgonTypography variant="h3" color="primary">
                  {employees.length}
                </ArgonTypography>
                <ArgonTypography variant="button" color="text">
                  Total Empleados
                </ArgonTypography>
              </ArgonBox>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <ArgonBox p={2} textAlign="center">
                <ArgonTypography variant="h3" color="success">
                  {employees.filter(emp => !emp.mustChangePassword).length}
                </ArgonTypography>
                <ArgonTypography variant="button" color="text">
                  Cuentas Activas
                </ArgonTypography>
              </ArgonBox>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <ArgonBox p={2} textAlign="center">
                <ArgonTypography variant="h3" color="warning">
                  {employees.filter(emp => emp.mustChangePassword).length}
                </ArgonTypography>
                <ArgonTypography variant="button" color="text">
                  Cambio de Contraseña Pendiente
                </ArgonTypography>
              </ArgonBox>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <ArgonBox p={2} textAlign="center">
                <ArgonTypography variant="h3" color="info">
                  {new Set(employees.map(emp => emp.role)).size}
                </ArgonTypography>
                <ArgonTypography variant="button" color="text">
                  Roles Únicos
                </ArgonTypography>
              </ArgonBox>
            </Card>
          </Grid>
        </Grid>

        {/* Tabla de empleados */}
        <Card>
          <ArgonBox p={3}>
            <ArgonTypography variant="h6" fontWeight="medium" mb={3}>
              Lista de Empleados
            </ArgonTypography>
            
            <ArgonBox
              sx={{
                "& table": {
                  width: "100%",
                  borderCollapse: "collapse",
                },
                "& thead": {
                  background: "linear-gradient(195deg, #2f647d 0%, #3cbfb5 100%)",
                  borderRadius: "0.5rem",
                },
                "& th": {
                  textAlign: "left",
                  padding: "16px 20px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#fff",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  borderBottom: "none",
                },
                "& th:first-of-type": {
                  borderTopLeftRadius: "0.5rem",
                },
                "& th:last-of-type": {
                  borderTopRightRadius: "0.5rem",
                },
                "& td": {
                  padding: "14px 20px",
                  fontSize: "0.875rem",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  color: "text.primary",
                },
                "& tbody tr:last-child td": {
                  borderBottom: "none",
                },
                "& tbody tr:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.02)",
                  transition: "all 0.2s ease",
                },
              }}
            >
              <table>
                <thead>
                  <tr>
                    <th style={{ width: "8%" }}>Foto</th>
                    <th style={{ width: "18%" }}>Nombre Completo</th>
                    <th style={{ width: "10%" }}>RUT</th>
                    <th style={{ width: "16%" }}>Email</th>
                    <th style={{ width: "10%" }}>Usuario</th>
                    <th style={{ width: "10%" }}>Rol</th>
                    <th style={{ width: "10%" }}>Cliente</th>
                    <th style={{ width: "10%" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td>
                        <Avatar 
                          src={getImageSrc(employee.imagen)} 
                          sx={{ width: 40, height: 40 }}
                        >
                          {!employee.imagen && <PersonIcon />}
                        </Avatar>
                      </td>
                      <td>
                        <ArgonBox>
                          <ArgonTypography variant="button" fontWeight="medium" display="block">
                            {employee.firstName} {employee.lastName}
                          </ArgonTypography>
                          <ArgonTypography variant="caption" color="text">
                            {employee.secondLastName}
                          </ArgonTypography>
                        </ArgonBox>
                      </td>
                      <td>{employee.rut}</td>
                      <td>{employee.email}</td>
                      <td>{employee.username}</td>
                      <td>
                        <Chip 
                          label={employee.role} 
                          color={employee.role === 'Desarrolladora' ? 'primary' : 'default'}
                          size="small"
                        />
                      </td>
                      <td>
                        <Chip 
                          label={employee.client} 
                          color="info"
                          size="small"
                        />
                      </td>
                      <td>
                        <ArgonBox display="flex" gap={1}>
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleEditEmployee(employee)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteEmployee(employee.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </ArgonBox>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ArgonBox>

            {employees.length === 0 && !loading && (
              <ArgonBox textAlign="center" py={3}>
                <ArgonTypography variant="h6" color="text">
                  No se encontraron empleados
                </ArgonTypography>
                <ArgonTypography variant="body2" color="text">
                  Agrega empleados usando el botón &quot;Agregar Empleado&quot;
                </ArgonTypography>
              </ArgonBox>
            )}
          </ArgonBox>
        </Card>

        {/* Diálogo para agregar/editar empleado */}
        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)} 
          maxWidth="md" 
          fullWidth
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: '12px',
            },
          }}
        >
          <DialogTitle 
            sx={{
              background: 'linear-gradient(195deg, #2f647d 0%, #3cbfb5 100%)',
              color: '#fff',
              fontSize: '1.5rem',
              marginBottom: '1rem',
              fontWeight: 700,
              paddingBottom: '24px',
              borderRadius: '12px 12px 0 0'
            }}
          >
            {isEditing ? 'Editar Empleado' : 'Agregar Nuevo Empleado'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre de Usuario"
                  value={formData.username}
                  onChange={handleFormChange('username')}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange('email')}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Nombre"
                  value={formData.firstName}
                  onChange={handleFormChange('firstName')}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Apellido Paterno"
                  value={formData.lastName}
                  onChange={handleFormChange('lastName')}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Apellido Materno"
                  value={formData.secondLastName}
                  onChange={handleFormChange('secondLastName')}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="RUT"
                  value={formData.rut}
                  onChange={handleFormChange('rut')}
                  variant="outlined"
                  placeholder="12.345.678-9"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Rol</InputLabel>
                  <Select
                    value={formData.role}
                    onChange={handleFormChange('role')}
                    label="Rol"
                  >
                    <MenuItem value="Desarrolladora">Desarrolladora</MenuItem>
                    <MenuItem value="Analista">Analista</MenuItem>
                    <MenuItem value="Supervisor">Supervisor</MenuItem>
                    <MenuItem value="Gerente">Gerente</MenuItem>
                    <MenuItem value="Empleado">Empleado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Cliente"
                  value={formData.client}
                  onChange={handleFormChange('client')}
                  variant="outlined"
                />
              </Grid>
              {!isEditing && (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Contraseña"
                    type="password"
                    value={formData.password}
                    onChange={handleFormChange('password')}
                    variant="outlined"
                  />
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <ArgonButton onClick={() => setOpenDialog(false)} color="error">
              Cancelar
            </ArgonButton>
            <ArgonButton onClick={handleSave} variant="gradient" color="success">
              {isEditing ? 'Actualizar' : 'Agregar'}
            </ArgonButton>
          </DialogActions>
        </Dialog>

        {/* Dialog de confirmación de eliminación */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '12px',
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle
            sx={{
              background: 'linear-gradient(195deg, #EC407A 0%, #D81B60 100%)',
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
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem'
              }}
            >
              ⚠
            </Box>
            Confirmar Eliminación
          </DialogTitle>
          <DialogContent sx={{ mt: 3 }}>
            <ArgonTypography variant="h6" mb={2} color="text">
              ¿Estás seguro de que quieres eliminar este empleado?
            </ArgonTypography>
            <Alert severity="info" sx={{ mb: 2 }}>
              <ArgonTypography variant="body2" color="text">
                Esta acción no se puede deshacer. El empleado será eliminado permanentemente de la plataforma.
              </ArgonTypography>
            </Alert>
          </DialogContent>
          <DialogActions sx={{ padding: '16px 24px' }}>
            <ArgonButton 
              onClick={() => setDeleteDialogOpen(false)} 
              color="secondary"
              variant="outlined"
            >
              Cancelar
            </ArgonButton>
            <ArgonButton 
              onClick={confirmDeleteEmployee} 
              variant="gradient" 
              color="error"
            >
              Eliminar Empleado
            </ArgonButton>
          </DialogActions>
        </Dialog>

        {/* Dialog de éxito */}
        <Dialog
          open={successDialogOpen}
          onClose={() => setSuccessDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '12px',
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle
            sx={{
              background: 'linear-gradient(195deg, #66BB6A 0%, #43A047 100%)',
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
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem'
              }}
            >
              ✓
            </Box>
            Operación Exitosa
          </DialogTitle>
          <DialogContent sx={{ mt: 3 }}>
            <ArgonTypography variant="h6" mb={2} color="text">
              {successMessage}
            </ArgonTypography>
            <Alert severity="success" sx={{ mb: 2 }}>
              <ArgonTypography variant="body2" color="text">
                Los cambios se han guardado correctamente en la plataforma.
              </ArgonTypography>
            </Alert>
          </DialogContent>
          <DialogActions sx={{ padding: '16px 24px' }}>
            <ArgonButton 
              onClick={() => setSuccessDialogOpen(false)} 
              variant="gradient" 
              color="success"
            >
              Aceptar
            </ArgonButton>
          </DialogActions>
        </Dialog>

        {/* Dialog de error */}
        <Dialog
          open={errorDialogOpen}
          onClose={() => setErrorDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '12px',
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle
            sx={{
              background: 'linear-gradient(195deg, #EF5350 0%, #E53935 100%)',
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
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem'
              }}
            >
              ✕
            </Box>
            Error en la Operación
          </DialogTitle>
          <DialogContent sx={{ mt: 3 }}>
            <ArgonTypography variant="h6" mb={2} color="text">
              {error}
            </ArgonTypography>
            <Alert severity="error" sx={{ mb: 2 }}>
              <ArgonTypography variant="body2" color="text">
                Por favor, verifica los datos e intenta nuevamente.
              </ArgonTypography>
            </Alert>
          </DialogContent>
          <DialogActions sx={{ padding: '16px 24px' }}>
            <ArgonButton 
              onClick={() => setErrorDialogOpen(false)} 
              variant="gradient" 
              color="error"
            >
              Cerrar
            </ArgonButton>
          </DialogActions>
        </Dialog>
      </ArgonBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
