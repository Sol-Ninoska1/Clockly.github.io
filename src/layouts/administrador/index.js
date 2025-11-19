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
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
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
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Autocomplete from "@mui/material/Autocomplete";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
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

// Argon Dashboard 2 MUI example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function Overview() {
  // Estados para la gestión de administradores
  const [administrators, setAdministrators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [adminToChangePassword, setAdminToChangePassword] = useState(null);
  const [passwordChangeData, setPasswordChangeData] = useState({
    password: '',
    passwordConfirm: ''
  });
  const [passwordChangeErrors, setPasswordChangeErrors] = useState({
    password: '',
    passwordConfirm: ''
  });
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(null);

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
    imagen: '',
    mustChangePassword: false
  });
  // Errores del formulario
  const [formErrors, setFormErrors] = useState({
    rut: '',
    password: ''
  });

  const fetchAdministrators = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/Companies/${companyId}/admins`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Administradores recibidos:', data);
      const mapped = data.map(u => ({
        ...u,
        rut: u.rut || u.username || '',
        Descripcion: `${u.firstName || ''} ${u.lastName || ''} ${u.secondLastName || ''}`.trim()
      }));
      setAdministrators(mapped);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching administrators:', err);
      
      setAdministrators([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchAdministrators();
  }, [companyId]);

  const getImageSrc = (base64String) => {
    if (!base64String) return null;
    return `data:image/jpeg;base64,${base64String}`;
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Remover el prefijo "data:image/...;base64," si existe
        const base64String = reader.result.split(',')[1] || reader.result;
        setFormData(prev => ({
          ...prev,
          imagen: base64String
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAdmin = () => {
    setError(null);
    setFormErrors({ rut: '' });
    setSelectedAdmin(null);
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
      imagen: '',
      mustChangePassword: false
    });
    setOpenDialog(true);
  };




  const handleEditAdmin = (admin) => {
    setError(null);
    setFormErrors({ rut: '' });
    setSelectedAdmin(admin);
    setIsEditing(true);
    setFormData({
      username: admin.username,
      password: '', 
      firstName: admin.firstName,
      lastName: admin.lastName,
      secondLastName: admin.secondLastName,
      role: admin.role,
      client: admin.client,
      rut: admin.rut,
      email: admin.email,
      imagen: admin.imagen || '',
      mustChangePassword: admin.mustChangePassword
    });
    setOpenDialog(true);
  };

  const handleDeleteAdmin = (adminId) => {
    setAdminToDelete(adminId);
    setOpenDeleteDialog(true);
  };

  const confirmDeleteAdmin = async () => {
    if (!adminToDelete) return;
    try {
      const response = await fetch(`/api/Companies/${companyId}/DeleteAdmins/${adminToDelete}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(errorMsg || `Error ${response.status}`);
      }
      
      setAdministrators(administrators.filter(admin => admin.id !== adminToDelete));
      console.log(`Administrador ${adminToDelete} eliminado exitosamente`);
      setOpenDeleteDialog(false);
      setAdminToDelete(null);
    } catch (err) {
      setError(`Error al eliminar administrador: ${err.message}`);
      console.error('Error deleting administrator:', err);
      setOpenDeleteDialog(false);
      setAdminToDelete(null);
    }
  };

  const cancelDeleteAdmin = () => {
    setOpenDeleteDialog(false);
    setAdminToDelete(null);
  };

  const handleOpenPasswordDialog = (admin) => {
    setAdminToChangePassword(admin);
    setPasswordChangeData({ password: '', passwordConfirm: '' });
    setPasswordChangeErrors({ password: '', passwordConfirm: '' });
    setOpenPasswordDialog(true);
  };

  const handlePasswordChangeInputChange = (field) => (event) => {
    const value = event.target.value;
    setPasswordChangeData(prev => ({
      ...prev,
      [field]: value
    }));

    // Validar mientras el usuario escribe
    if (field === 'password') {
      if (value && !isValidPassword(value)) {
        setPasswordChangeErrors(prev => ({
          ...prev,
          password: 'Mínimo 6 caracteres, 1 mayúscula, 1 número y 1 carácter especial'
        }));
      } else {
        setPasswordChangeErrors(prev => ({ ...prev, password: '' }));
      }
      // Validar coincidencia si el confirm ya tiene valor
      if (passwordChangeData.passwordConfirm && value !== passwordChangeData.passwordConfirm) {
        setPasswordChangeErrors(prev => ({
          ...prev,
          passwordConfirm: 'Las contraseñas no coinciden'
        }));
      } else if (passwordChangeData.passwordConfirm) {
        setPasswordChangeErrors(prev => ({ ...prev, passwordConfirm: '' }));
      }
    } else if (field === 'passwordConfirm') {
      if (value !== passwordChangeData.password) {
        setPasswordChangeErrors(prev => ({
          ...prev,
          passwordConfirm: 'Las contraseñas no coinciden'
        }));
      } else {
        setPasswordChangeErrors(prev => ({ ...prev, passwordConfirm: '' }));
      }
    }
  };

  const confirmPasswordChange = async () => {
    if (!adminToChangePassword) return;

    if (!passwordChangeData.password || !isValidPassword(passwordChangeData.password)) {
      setPasswordChangeErrors(prev => ({
        ...prev,
        password: 'Mínimo 6 caracteres, 1 mayúscula, 1 número y 1 carácter especial'
      }));
      setError('Contraseña inválida. Corrige la contraseña antes de continuar.');
      return;
    }

    if (!passwordChangeData.passwordConfirm || passwordChangeData.password !== passwordChangeData.passwordConfirm) {
      setPasswordChangeErrors(prev => ({
        ...prev,
        passwordConfirm: 'Las contraseñas no coinciden'
      }));
      setError('Las contraseñas no coinciden. Intenta de nuevo.');
      return;
    }

    try {
      const dataToSend = {
        Password: passwordChangeData.password,
        Username: adminToChangePassword.username,
        FirstName: adminToChangePassword.firstName,
        LastName: adminToChangePassword.lastName,
        SecondLastName: adminToChangePassword.secondLastName,
        Role: adminToChangePassword.role,
        Client: adminToChangePassword.client,
        Rut: adminToChangePassword.rut,
        Email: adminToChangePassword.email,
        imagen: adminToChangePassword.imagen || '',
        MustChangePassword: adminToChangePassword.mustChangePassword
      };

      console.log('Password change payload:', dataToSend);

      const response = await fetch(
        `/api/Companies/${companyId}/admins/${adminToChangePassword.id}/password`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend)
        }
      );

      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(errorMsg || `Error ${response.status}`);
      }

      const responseData = await response.json();
      const successMsg = responseData.message || 'Contraseña actualizada correctamente.';
      
      setPasswordChangeSuccess(successMsg);
      setAdministrators(administrators.map(admin =>
        admin.id === adminToChangePassword.id ? { ...admin, ...responseData } : admin
      ));

      console.log(`Contraseña del administrador ${adminToChangePassword.id} actualizada exitosamente`);
      
      // Cerrar el diálogo después de 2 segundos para que el usuario vea el mensaje de éxito
      setTimeout(() => {
        setOpenPasswordDialog(false);
        setAdminToChangePassword(null);
        setPasswordChangeData({ password: '', passwordConfirm: '' });
        setPasswordChangeErrors({ password: '', passwordConfirm: '' });
        setPasswordChangeSuccess(null);
        setError(null);
      }, 2000);
    } catch (err) {
      setError(`Error al cambiar contraseña: ${err.message}`);
      console.error('Error changing password:', err);
    }
  };

  const cancelPasswordChange = () => {
    setOpenPasswordDialog(false);
    setAdminToChangePassword(null);
    setPasswordChangeData({ password: '', passwordConfirm: '' });
    setPasswordChangeErrors({ password: '', passwordConfirm: '' });
    setPasswordChangeSuccess(null);
  };

  const handleFormChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'rut') {
      const rutVal = String(value || '').trim();
      if (rutVal === '') {
        setFormErrors(prev => ({ ...prev, rut: '' }));
      } else if (!isValidRut(rutVal)) {
        setFormErrors(prev => ({ ...prev, rut: 'RUT inválido' }));
      } else {
        setFormErrors(prev => ({ ...prev, rut: '' }));
      }
    } else if (field === 'password') {
      const passVal = String(value || '');
      // If creating a new admin, password is required
      if (!isEditing && passVal.trim() === '') {
        setFormErrors(prev => ({ ...prev, password: 'La contraseña es obligatoria' }));
      } else if (passVal && !isValidPassword(passVal)) {
        setFormErrors(prev => ({ ...prev, password: 'Mínimo 6 caracteres, 1 mayúscula, 1 número y 1 carácter especial' }));
      } else {
        setFormErrors(prev => ({ ...prev, password: '' }));
      }
    }
  };

  const isValidRut = (rut) => {
    if (!rut) return false;
    const clean = String(rut).replace(/\./g, '').replace(/-/g, '').replace(/\s+/g, '').toUpperCase();
    if (clean.length < 2) return false;
    const body = clean.slice(0, -1);
    let dv = clean.slice(-1);
    let sum = 0;
    let multiplier = 2;
    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body.charAt(i), 10) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    const remainder = sum % 11;
    const computed = 11 - remainder;
    let dvExpected = '';
    if (computed === 11) dvExpected = '0';
    else if (computed === 10) dvExpected = 'K';
    else dvExpected = String(computed);
    return dv === dvExpected;
  };

  const formatRut = (rut) => {
    if (!rut) return '';
    const clean = String(rut).replace(/\./g, '').replace(/-/g, '').replace(/\s+/g, '').toUpperCase();
    if (clean.length < 2) return rut;
    const body = clean.slice(0, -1);
    const dv = clean.slice(-1);
    let reversed = body.split('').reverse();
    let parts = [];
    for (let i = 0; i < reversed.length; i += 3) {
      parts.push(reversed.slice(i, i + 3).reverse().join(''));
    }
    const formattedBody = parts.reverse().join('.');
    return `${formattedBody}-${dv}`;
  };

  const isValidPassword = (pwd) => {
    if (!pwd) return false;
    const trimmed = String(pwd).trim();
    if (trimmed.length < 6) return false;
    const hasUpper = /[A-Z]/.test(trimmed);
    const hasNumber = /\d/.test(trimmed);
    const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(trimmed);
    return hasUpper && hasNumber && hasSpecial;
  };

  const handleSave = async () => {
    console.log('handleSave called - isEditing:', isEditing, 'formData.password:', formData.password);
    if (formData.rut && !isValidRut(formData.rut)) {
      setFormErrors(prev => ({ ...prev, rut: 'RUT inválido' }));
      setError('RUT inválido. Corrige el RUT antes de continuar.');
      return;
    }
    if (!isEditing) {
      if (!formData.password || !isValidPassword(formData.password)) {
        console.log('Password validation failed - password:', formData.password);
        setFormErrors(prev => ({ ...prev, password: 'Mínimo 6 caracteres, 1 mayúscula, 1 número y 1 carácter especial' }));
        setError('Contraseña inválida. Corrige la contraseña antes de continuar.');
        return;
      }
    } else {
      if (formData.password && !isValidPassword(formData.password)) {
        setFormErrors(prev => ({ ...prev, password: 'Mínimo 6 caracteres, 1 mayúscula, 1 número y 1 carácter especial' }));
        setError('Contraseña inválida. Corrige la contraseña antes de continuar.');
        return;
      }
    }
    try {
      const dataToSend = {
        Username: formData.username,
        FirstName: formData.firstName,
        LastName: formData.lastName,
        SecondLastName: formData.secondLastName,
        Role: formData.role,
        Client: formData.client,
        Rut: formData.rut,
        Email: formData.email,
        imagen: formData.imagen,
        MustChangePassword: formData.mustChangePassword
      };
      
      if (!isEditing) {
        dataToSend.Password = formData.password;
      } else if (formData.password) {
        dataToSend.Password = formData.password;
      }
      
      console.log('Datos a enviar:', dataToSend);

      if (isEditing) {
        const response = await fetch(`/api/Companies/${companyId}/UpdateAdmins/${selectedAdmin.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend)
        });
        
        if (!response.ok) {
          const errorMsg = await response.text();
          throw new Error(errorMsg || `Error ${response.status}`);
        }
        
        const updatedAdmin = await response.json();
        setAdministrators(administrators.map(admin => 
          admin.id === selectedAdmin.id ? { ...admin, ...updatedAdmin } : admin
        ));
        console.log('Administrador actualizado:', updatedAdmin);
        setError(null);
      } else {
        const response = await fetch(`/api/Companies/${companyId}/InsertAdmins`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend)
        });
        
        if (!response.ok) {
          const errorMsg = await response.text();
          throw new Error(errorMsg || `Error ${response.status}`);
        }
        
        const newAdmin = await response.json();
        setAdministrators([...administrators, newAdmin]);
        console.log('Nuevo administrador agregado:', newAdmin);
        setError(null);
      }
      setOpenDialog(false);
    } catch (err) {
      setError(`Error al guardar administrador: ${err.message}`);
      console.error('Error saving administrator:', err);
    }
  };

  const handlePasswordChangeToggle = async (adminId, value) => {
    try {
      const admin = administrators.find(a => a.id === adminId);
      const dataToSend = {
        Username: admin.username,
        Password: admin.password,
        FirstName: admin.firstName,
        LastName: admin.lastName,
        SecondLastName: admin.secondLastName,
        Role: admin.role,
        Client: admin.client,
        Rut: admin.rut,
        Email: admin.email,
        imagen: admin.imagen || '',
        MustChangePassword: value
      };
      
      const response = await fetch(`/api/Companies/${companyId}/UpdateAdmins/${adminId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      
      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(errorMsg || `Error ${response.status}`);
      }
      
      setAdministrators(administrators.map(admin => 
        admin.id === adminId ? { ...admin, mustChangePassword: value } : admin
      ));
      console.log(`Admin ${adminId} - Cambio de contraseña obligatorio: ${value}`);
    } catch (err) {
      setError(`Error al actualizar configuración de contraseña: ${err.message}`);
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
            Administradores de la Plataforma
          </ArgonTypography>
          <ArgonBox display="flex" gap={2}>
            <ArgonButton 
              variant="outlined" 
              color="info" 
              onClick={fetchAdministrators}
              startIcon={<RefreshIcon />}
            >
              Actualizar
            </ArgonButton>
            <ArgonButton 
              variant="gradient" 
              color="success" 
              onClick={handleAddAdmin}
              startIcon={<AddIcon />}
            >
              Agregar Administrador
            </ArgonButton>
          </ArgonBox>
        </ArgonBox>

        {/* Tarjetas de resumen */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <ArgonBox p={2} textAlign="center">
                <ArgonTypography variant="h3" color="primary">
                  {administrators.length}
                </ArgonTypography>
                <ArgonTypography variant="button" color="text">
                  Total Administradores
                </ArgonTypography>
              </ArgonBox>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <ArgonBox p={2} textAlign="center">
                <ArgonTypography variant="h3" color="success">
                  {administrators.filter(admin => !admin.mustChangePassword).length}
                </ArgonTypography>
                <ArgonTypography variant="button" color="text">
                  Cuentas Activas
                </ArgonTypography>
              </ArgonBox>
            </Card>
          </Grid>
         
        </Grid>

        {/* Tabla de administradores */}
        <Card>
          <ArgonBox p={3}>
            <ArgonTypography variant="h5" gutterBottom>
              Lista de Administradores
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
                    <th style={{ width: "20%" }}>Nombre</th>
                    <th style={{ width: "12%" }}>RUT</th>
                    <th style={{ width: "15%" }}>Email</th>
                    <th style={{ width: "12%" }}>Usuario</th>
                    <th style={{ width: "12%" }}>Rol</th>
                    <th style={{ width: "12%" }}>Cliente</th>
                    <th style={{ width: "5%" }}>Cambiar Clave</th>
                    <th style={{ width: "4%" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {administrators.map((admin) => (
                    <tr key={admin.id}>
                      <td>
                        <Avatar 
                          src={getImageSrc(admin.imagen)} 
                          sx={{ width: 40, height: 40 }}
                        >
                          {!admin.imagen && <PersonIcon />}
                        </Avatar>
                      </td>
                      <td style={{ fontWeight: 500 }}>
                        <ArgonTypography variant="button" fontWeight="medium" display="block">
                          {admin.firstName} {admin.lastName}
                        </ArgonTypography>
                        <ArgonTypography variant="caption" color="text" display="block">
                          {admin.secondLastName}
                        </ArgonTypography>
                      </td>
                      <td>{admin.rut}</td>
                      <td>{admin.email}</td>
                      <td>{admin.username}</td>
                      <td>
                        <Chip 
                          label={admin.role} 
                          color={admin.role === 'Desarrolladora' ? 'primary' : 'default'}
                          size="small"
                        />
                      </td>
                      <td>
                        <Chip 
                          label={admin.client} 
                          color="info"
                          size="small"
                        />
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <ArgonButton
                          size="small"
                          variant="gradient"
                          color="warning"
                          sx={{
                            padding: '6px 12px',
                            fontSize: '0.75rem',
                            textTransform: 'none',
                            borderRadius: '6px'
                          }}
                          onClick={() => handleOpenPasswordDialog(admin)}
                        >
                          Cambiar Clave
                        </ArgonButton>
                      </td>
                      <td>
                        <ArgonBox display="flex" gap={0.5}>
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleEditAdmin(admin)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteAdmin(admin.id)}
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

            {administrators.length === 0 && !loading && (
              <ArgonBox textAlign="center" py={3}>
                <ArgonTypography variant="h6" color="text">
                  No se encontraron administradores
                </ArgonTypography>
                <ArgonTypography variant="body2" color="text">
                  Agrega administradores usando el botón &quot;Agregar Administrador&quot;
                </ArgonTypography>
              </ArgonBox>
            )}
          </ArgonBox>
        </Card>

        {/* Diálogo para agregar/editar administrador */}
        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)} 
          maxWidth="md" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '12px',
              boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
            }
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
            {isEditing ? 'Editar Administrador' : 'Agregar Nuevo Administrador'}
          </DialogTitle>
          <DialogContent sx={{ paddingTop: '54px' }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            )}
            <Grid container spacing={2.5}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label=" Email Corporativo *"
                  value={formData.username}
                  onChange={handleFormChange('username')}
                  variant="outlined"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      '&:hover fieldset': {
                        borderColor: '#3cbfb5',
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email Personal *"
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange('email')}
                  variant="outlined"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      '&:hover fieldset': {
                        borderColor: '#3cbfb5',
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Nombre"
                  value={formData.firstName}
                  onChange={handleFormChange('firstName')}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      '&:hover fieldset': {
                        borderColor: '#3cbfb5',
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Apellido Paterno"
                  value={formData.lastName}
                  onChange={handleFormChange('lastName')}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      '&:hover fieldset': {
                        borderColor: '#3cbfb5',
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Apellido Materno"
                  value={formData.secondLastName}
                  onChange={handleFormChange('secondLastName')}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      '&:hover fieldset': {
                        borderColor: '#3cbfb5',
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="RUT"
                  value={formData.rut}
                  onChange={handleFormChange('rut')}
                  onBlur={() => {
                    const formatted = formatRut(formData.rut);
                    setFormData(prev => ({ ...prev, rut: formatted }));
                    if (formatted && !isValidRut(formatted)) {
                      setFormErrors(prev => ({ ...prev, rut: 'RUT inválido' }));
                    } else {
                      setFormErrors(prev => ({ ...prev, rut: '' }));
                    }
                  }}
                  variant="outlined"
                  placeholder="12.345.678-9"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      '&:hover fieldset': {
                        borderColor: '#3cbfb5',
                      }
                    }
                  }}
                  error={Boolean(formErrors.rut)}
                  helperText={formErrors.rut || ''}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  freeSolo
                  options={["Desarrolladora", "Jefe", "Administrador", "Supervisor"]}
                  value={formData.role || null}
                  onChange={(e, newValue) => setFormData(prev => ({ ...prev, role: newValue || '' }))}
                  onInputChange={(e, newInput) => setFormData(prev => ({ ...prev, role: newInput }))}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Rol"
                      variant="outlined"
                      placeholder="Escribe o selecciona un rol"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          '&:hover fieldset': { borderColor: '#3cbfb5' }
                        }
                      }}
                    />
                  )}
                  sx={{ width: '100%' }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Cliente"
                  value={formData.client}
                  onChange={handleFormChange('client')}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      '&:hover fieldset': {
                        borderColor: '#3cbfb5',
                      }
                    }
                  }}
                />
              </Grid>
              {!isEditing && (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Contraseña *"
                    type="password"
                    value={formData.password}
                    onChange={handleFormChange('password')}
                    error={Boolean(formErrors.password)}
                    helperText={formErrors.password || 'Mínimo 6 caracteres, 1 mayúscula, 1 número y 1 carácter especial'}
                    variant="outlined"
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '&:hover fieldset': {
                          borderColor: '#3cbfb5',
                        }
                      }
                    }}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <ArgonBox
                  sx={{
                    padding: '16px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef'
                  }}
                >
                  <ArgonTypography variant="subtitle2" fontWeight="600" mb={1.5} color="#2f647d">
                    📷 Foto de Perfil **
                  </ArgonTypography>
                  <ArgonBox
                    component="label"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '25px',
                      border: '2px dashed #3cbfb5',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      backgroundColor: '#fff',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#2f647d',
                        backgroundColor: '#f0fffe',
                        required: 'true'
                      }
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                    <ArgonTypography variant="body2" sx={{ color: '#666', textAlign: 'center' }}>
                      {formData.imagen ? '✓ Imagen cargada' : 'Haz clic para seleccionar una imagen'}
                    </ArgonTypography>
                  </ArgonBox>
                  {formData.imagen && (
                    <ArgonBox mt={2} textAlign="center">
                      <img 
                        src={getImageSrc(formData.imagen)} 
                        alt="Preview" 
                        style={{ 
                          maxHeight: '150px', 
                          maxWidth: '100%', 
                          borderRadius: '8px',
                          border: '2px solid #3cbfb5',
                          boxShadow: '0 4px 12px rgba(60, 191, 181, 0.15)'
                        }}
                      />
                    </ArgonBox>
                  )}
                </ArgonBox>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions 
            sx={{
              padding: '16px 24px',
              borderTop: '1px solid #e9ecef',
              gap: 1
            }}
          >
            <ArgonButton 
              onClick={() => setOpenDialog(false)} 
              color="secondary"
              variant="outlined"
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                padding: '10px 24px'
              }}
            >
              Cancelar
            </ArgonButton>
            <ArgonButton 
              onClick={handleSave} 
              variant="gradient" 
              color="success"
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                padding: '10px 32px',
                background: 'linear-gradient(195deg, #3cbfb5 0%, #2f647d 100%)'
              }}
            >
              {isEditing ? 'Actualizar' : 'Agregar'}
            </ArgonButton>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog 
          open={openDeleteDialog} 
          onClose={cancelDeleteAdmin}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
            }
          }}
        >
          <DialogTitle 
            sx={{
              background: 'linear-gradient(195deg, #f04c3c 0%, #d63031 100%)',
              color: '#fff',
              fontSize: '1.3rem',
              fontWeight: 700,
              paddingBottom: '24px',
              borderRadius: '12px 12px 0 0',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            ⚠️ Confirmar Eliminación
          </DialogTitle>
          <DialogContent sx={{ paddingTop: '24px', paddingBottom: '24px' }}>
            <ArgonTypography variant="body1" color="text" sx={{ mb: 2, lineHeight: 1.6 }}>
              ¿Estás seguro de que quieres eliminar este administrador?
            </ArgonTypography>
            <ArgonBox
              sx={{
                padding: '12px 16px',
                backgroundColor: '#fff3cd',
                border: '1px solid #ffc107',
                borderRadius: '8px',
                display: 'flex',
                gap: 1.5,
                alignItems: 'flex-start'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>ℹ️</span>
              <ArgonTypography variant="caption" color="text" sx={{ lineHeight: 1.5 }}>
                Esta acción no se puede deshacer. El administrador será eliminado permanentemente de la plataforma.
              </ArgonTypography>
            </ArgonBox>
          </DialogContent>
          <DialogActions 
            sx={{
              padding: '16px 24px',
              borderTop: '1px solid #e9ecef',
              gap: 1
            }}
          >
            <ArgonButton 
              onClick={cancelDeleteAdmin} 
              color="secondary"
              variant="outlined"
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                padding: '10px 24px'
              }}
            >
              Cancelar
            </ArgonButton>
            <ArgonButton 
              onClick={confirmDeleteAdmin}
              variant="gradient" 
              color="error"
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                padding: '10px 32px',
                background: 'linear-gradient(195deg, #f04c3c 0%, #d63031 100%)'
              }}
            >
              Eliminar Administrador
            </ArgonButton>
          </DialogActions>
        </Dialog>

        {/* Password Change Dialog */}
        <Dialog 
          open={openPasswordDialog} 
          onClose={cancelPasswordChange}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
            }
          }}
        >
          <DialogTitle 
            sx={{
              background: 'linear-gradient(195deg, #2f647d 0%, #3cbfb5 100%)',
              color: '#fff',
              fontSize: '1.3rem',
              fontWeight: 700,
              paddingBottom: '24px',
              borderRadius: '12px 12px 0 0',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            🔐 Cambiar Contraseña
          </DialogTitle>
          <DialogContent sx={{ paddingTop: '24px', paddingBottom: '24px' }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            )}
            {passwordChangeSuccess && (
              <Alert severity="success" sx={{ mb: 2 }} onClose={() => setPasswordChangeSuccess(null)}>
                ✓ {passwordChangeSuccess}
              </Alert>
            )}
            <ArgonTypography variant="body2" color="text" sx={{ mb: 3 }}>
              Ingresa una nueva contraseña para {adminToChangePassword?.firstName} {adminToChangePassword?.lastName}
            </ArgonTypography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nueva Contraseña *"
                  type="password"
                  value={passwordChangeData.password}
                  onChange={handlePasswordChangeInputChange('password')}
                  error={Boolean(passwordChangeErrors.password)}
                  helperText={passwordChangeErrors.password || 'Mínimo 6 caracteres, 1 mayúscula, 1 número y 1 carácter especial'}
                  variant="outlined"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      '&:hover fieldset': {
                        borderColor: '#3cbfb5',
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirmar Contraseña *"
                  type="password"
                  value={passwordChangeData.passwordConfirm}
                  onChange={handlePasswordChangeInputChange('passwordConfirm')}
                  error={Boolean(passwordChangeErrors.passwordConfirm)}
                  helperText={passwordChangeErrors.passwordConfirm || 'Las contraseñas deben coincidir'}
                  variant="outlined"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      '&:hover fieldset': {
                        borderColor: '#3cbfb5',
                      }
                    }
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions 
            sx={{
              padding: '16px 24px',
              borderTop: '1px solid #e9ecef',
              gap: 1
            }}
          >
            <ArgonButton 
              onClick={cancelPasswordChange} 
              color="secondary"
              variant="outlined"
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                padding: '10px 24px'
              }}
            >
              Cancelar
            </ArgonButton>
            <ArgonButton 
              onClick={confirmPasswordChange}
              variant="gradient" 
              color="success"
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                padding: '10px 32px',
                background: 'linear-gradient(195deg, #3cbfb5 0%, #2f647d 100%)'
              }}
            >
              Cambiar Contraseña
            </ArgonButton>
          </DialogActions>
        </Dialog>
      </ArgonBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
