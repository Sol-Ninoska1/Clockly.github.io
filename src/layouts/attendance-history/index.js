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
import * as XLSX from "xlsx";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Autocomplete from "@mui/material/Autocomplete";

// @mui icons
import RefreshIcon from "@mui/icons-material/Refresh";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import WorkIcon from "@mui/icons-material/Work";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonButton from "components/ArgonButton";

// Argon Dashboard 2 MUI example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function AttendanceHistory() {
  // Estados para manejo de datos y UI
  const [attendanceMarks, setAttendanceMarks] = useState([]);
  const [filteredMarks, setFilteredMarks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para filtros
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const companyId = localStorage.getItem("companyId");

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`/api/Companies/${companyId}/users`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Empleados cargados:', data);
        const mappedEmployees = data.map(user => ({
          ...user,
          rut: user.rut,
          Descripcion: `${user.firstName || ''} ${user.lastName || ''} ${user.secondLastName || ''}`.trim()
        }));
        console.log('Empleados mapeados:', mappedEmployees);
        setEmployees(mappedEmployees);
      } else {
        console.error('Error fetching employees:', response.status);
        setEmployees([]);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
      setEmployees([]);
    }
  };

  // Función para obtener marcas de asistencia desde la API
  const fetchAttendanceMarks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/Companies/${companyId}/marks-attendance`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setAttendanceMarks([]);
          setFilteredMarks([]);
          setLoading(false);
          return;
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setAttendanceMarks(data);
      setFilteredMarks(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching attendance marks:', err);
      setAttendanceMarks([]);
      setFilteredMarks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchEmployees();
      fetchAttendanceMarks();
    }
  }, [companyId]);

  // Aplicar filtros
  useEffect(() => {
    let filtered = attendanceMarks;

    // Filtro por empleado (buscar por username o rut en los marks)
    if (selectedEmployee) {
      filtered = filtered.filter(mark => 
        mark.rut === selectedEmployee || mark.username === selectedEmployee
      );
    }

    // Filtro por fecha desde
    if (dateFrom) {
      filtered = filtered.filter(mark => new Date(mark.fecha) >= new Date(dateFrom));
    }

    // Filtro por fecha hasta
    if (dateTo) {
      filtered = filtered.filter(mark => new Date(mark.fecha) <= new Date(dateTo + "T23:59:59"));
    }

    setFilteredMarks(filtered);
  }, [selectedEmployee, dateFrom, dateTo, attendanceMarks]);

  const calculateDelay = (mark) => {
    if (!mark.entryTime || mark.tipomarca !== "entrada") return null;
    
    const markTime = new Date(`1970-01-01T${new Date(mark.fecha).toTimeString().split(' ')[0]}`);
    const entryTime = new Date(`1970-01-01T${mark.entryTime}`);
    const margin = mark.allowedLateMargin || 0;
    
    const diffMs = markTime - entryTime;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    return diffMinutes > margin ? diffMinutes - margin : 0;
  };

  // Función para calcular horas extra
  const calculateOvertime = (mark) => {
    if (!mark.exitTime || mark.tipomarca !== "salida") return null;
    
    const markTime = new Date(`1970-01-01T${new Date(mark.fecha).toTimeString().split(' ')[0]}`);
    const exitTime = new Date(`1970-01-01T${mark.exitTime}`);
    
    const diffMs = markTime - exitTime;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    return diffMinutes > 0 ? diffMinutes : 0;
  };

  // Función para calcular atraso/extra de colación
  const calculateBreakTime = (mark) => {
    if (!mark.breakMarkingRequired) return null;
    
    if (mark.tipomarca === "inicio_colacion" && mark.breakStart) {
      const markTime = new Date(`1970-01-01T${new Date(mark.fecha).toTimeString().split(' ')[0]}`);
      const breakStart = new Date(`1970-01-01T${mark.breakStart}`);
      const diffMs = markTime - breakStart;
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return { type: "inicio", minutes: Math.abs(diffMinutes), isLate: diffMinutes > 0 };
    }
    
    if (mark.tipomarca === "fin_colacion" && mark.breakEnd) {
      const markTime = new Date(`1970-01-01T${new Date(mark.fecha).toTimeString().split(' ')[0]}`);
      const breakEnd = new Date(`1970-01-01T${mark.breakEnd}`);
      const diffMs = markTime - breakEnd;
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return { type: "fin", minutes: Math.abs(diffMinutes), isLate: diffMinutes > 0 };
    }
    
    return null;
  };

  // Función para obtener icono del tipo de marca
  const getMarkIcon = (tipomarca) => {
    switch (tipomarca) {
      case "entrada": return <WorkIcon color="success" />;
      case "salida": return <HomeIcon color="error" />;
      case "inicio_colacion": return <RestaurantIcon color="warning" />;
      case "fin_colacion": return <RestaurantIcon color="info" />;
      default: return <AccessTimeIcon />;
    }
  };

  // Función para obtener color del chip según el tipo
  const getMarkChipProps = (tipomarca) => {
    switch (tipomarca) {
      case "entrada": return { color: "success", label: "Entrada" };
      case "salida": return { color: "error", label: "Salida" };
      case "inicio_colacion": return { color: "warning", label: "Inicio Colación" };
      case "fin_colacion": return { color: "info", label: "Fin Colación" };
      default: return { color: "default", label: tipomarca };
    }
  };

  // Función para exportar a Excel (simulada)
  const exportToExcel = () => {
    const data = [
      ["RUT", "Fecha", "Tipo Marca", "Descripción", "Atraso (min)", "Extra (min)", "Colación (min)"],
      ...filteredMarks.map(mark => [
        mark.rut || "",
        new Date(mark.fecha).toLocaleString() || "",
        mark.tipomarca || "",
        mark.Descripcion || "",
        calculateDelay(mark) || "",
        calculateOvertime(mark) || "",
        calculateBreakTime(mark)?.minutes || ""
      ])
    ];

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    worksheet['!cols'] = [
      { wch: 15 }, // RUT
      { wch: 20 }, // Fecha y hra
      { wch: 15 }, // Tipo Marca
      { wch: 25 }, // Descripción
      { wch: 12 }, // Atraso
      { wch: 12 }, // Extra
      { wch: 12 }  // Colación
    ];
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Asistencia');
    XLSX.writeFile(workbook, `historial_asistencia_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ArgonBox py={3}>
        <Grid container spacing={3}>
          {/* Header con botones de acción */}

          <Grid item xs={12}>
            <ArgonBox mb={3} display="flex" justifyContent="space-between" alignItems="center">
              <ArgonTypography variant="h4" fontWeight="bold">
                Historial de Asistencia
              </ArgonTypography>
              <ArgonBox display="flex" gap={1}>
                <ArgonButton
                  variant="outlined"
                  color="info"
                  onClick={() => { fetchAttendanceMarks(); }}
                  startIcon={<RefreshIcon />}
                >
                  Actualizar
                </ArgonButton>
                <ArgonButton
                  variant="gradient"
                  color="success"
                  onClick={exportToExcel}
                  startIcon={<FileDownloadIcon />}
                >
                  Descargar Excel
                </ArgonButton>
              </ArgonBox>
            </ArgonBox>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <ArgonBox p={3}>
                <ArgonTypography variant="h6" gutterBottom>
                  Filtros
                </ArgonTypography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}>
                    <Autocomplete
                      options={employees}
                      getOptionLabel={(option) => 
                        typeof option === 'string' 
                          ? '' 
                          : `${option.rut} - ${option.Descripcion || 'Sin nombre'}`
                      }
                      value={selectedEmployee ? employees.find(e => e.rut === selectedEmployee) || null : null}
                      onChange={(e, newValue) => setSelectedEmployee(newValue?.rut || "")}
                      renderInput={(params) => (
                        <TextField {...params} label="Empleado" placeholder="Buscar empleado..." />
                      )}
                      isOptionEqualToValue={(option, value) => option.rut === value.rut}
                      loading={employees.length === 0}
                      noOptionsText="No hay empleados disponibles"
                      clearText="Limpiar"
                      closeText="Cerrar"
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Fecha Desde"
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Fecha Hasta"
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <ArgonTypography variant="body2" color="text">
                      <strong>{filteredMarks.length}</strong> marcas encontradas
                    </ArgonTypography>
                  </Grid>
                </Grid>
              </ArgonBox>
            </Card>
          </Grid>

          {/* Error Alert */}
          {/* {error && (
            <Grid item xs={12}>
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            </Grid>
          )} */}

          {/* Tabla de Marcas de Asistencia */}
          <Grid item xs={12}>
            <Card>
              <ArgonBox p={3}>
                <ArgonTypography variant="h5" gutterBottom>
                  Registros de Asistencia
                </ArgonTypography>
                
                {loading ? (
                  <ArgonBox display="flex" justifyContent="center" py={3}>
                    <CircularProgress />
                  </ArgonBox>
                ) : filteredMarks.length === 0 ? (
                  <ArgonBox textAlign="center" py={3}>
                    <ArgonTypography variant="h6" color="text">
                      No se encontraron marcas de asistencia
                    </ArgonTypography>
                    <ArgonTypography variant="body2" color="text">
                      Ajusta los filtros o verifica que existan registros
                    </ArgonTypography>
                  </ArgonBox>
                ) : (
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
                          <th>Empleado</th>
                          <th>Fecha y Hora</th>
                          <th>Tipo de Marca</th>
                          <th>Descripción</th>
                          <th>Atraso</th>
                          <th>Horas Extra</th>
                          <th>Colación</th>
                          <th>Ubicación</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMarks.map((mark) => {
                          const delay = calculateDelay(mark);
                          const overtime = calculateOvertime(mark);
                          const breakTime = calculateBreakTime(mark);
                          const chipProps = getMarkChipProps(mark.tipomarca);
                          
                          return (
                            <tr key={mark.Id}>
                              <td>
                                <ArgonBox display="flex" alignItems="center">
                                  {mark.imagen && (
                                    <Avatar 
                                      src={`data:image/jpeg;base64,${mark.imagen}`} 
                                      sx={{ width: 32, height: 32, mr: 2 }}
                                    />
                                  )}
                                  <ArgonBox>
                                    <ArgonTypography variant="button" fontWeight="medium">
                                      {mark.rut}
                                    </ArgonTypography>
                                    <ArgonTypography variant="caption" color="text" display="block">
                                      {mark.Descripcion || 'Sin nombre'}
                                    </ArgonTypography>
                                  </ArgonBox>
                                </ArgonBox>
                              </td>
                              <td>
                                <ArgonBox display="flex" alignItems="center">
                                  {getMarkIcon(mark.tipomarca)}
                                  <ArgonBox ml={1}>
                                    <ArgonTypography variant="button">
                                      {new Date(mark.fecha).toLocaleDateString()}
                                    </ArgonTypography>
                                    <ArgonTypography variant="caption" color="text" display="block">
                                      {new Date(mark.fecha).toLocaleTimeString()}
                                    </ArgonTypography>
                                  </ArgonBox>
                                </ArgonBox>
                              </td>
                              <td>
                                <Chip 
                                  label={chipProps.label} 
                                  color={chipProps.color} 
                                  size="small"
                                  variant="filled"
                                  sx={{ fontWeight: 600 }}
                                />
                              </td>
                              <td>
                                <ArgonTypography variant="body2">
                                  {mark.Descripcion}
                                </ArgonTypography>
                              </td>
                              <td>
                                {delay > 0 ? (
                                  <Chip 
                                    label={`${delay} min`} 
                                    color="error" 
                                    size="small"
                                    variant="filled"
                                    sx={{ fontWeight: 600, minWidth: 60 }}
                                  />
                                ) : delay === 0 ? (
                                  <Chip 
                                    label="A tiempo" 
                                    color="success" 
                                    size="small"
                                    variant="filled"
                                    sx={{ fontWeight: 600, minWidth: 60 }}
                                  />
                                ) : (
                                  <ArgonTypography variant="caption" color="text">
                                    -
                                  </ArgonTypography>
                                )}
                              </td>
                              <td>
                                {overtime > 0 ? (
                                  <Chip 
                                    label={`+${overtime} min`} 
                                    color="info" 
                                    size="small"
                                    variant="filled"
                                    sx={{ fontWeight: 600, minWidth: 60 }}
                                  />
                                ) : overtime === 0 ? (
                                  <ArgonTypography variant="caption" color="text">
                                    Normal
                                  </ArgonTypography>
                                ) : (
                                  <ArgonTypography variant="caption" color="text">
                                    -
                                  </ArgonTypography>
                                )}
                              </td>
                              <td>
                                {breakTime ? (
                                  <Tooltip title={`${breakTime.type} de colación`}>
                                    <Chip 
                                      label={`${breakTime.isLate ? '+' : '-'}${breakTime.minutes} min`} 
                                      color={breakTime.isLate ? "warning" : "success"} 
                                      size="small"
                                      variant="filled"
                                      sx={{ fontWeight: 600, minWidth: 60 }}
                                    />
                                  </Tooltip>
                                ) : (
                                  <ArgonTypography variant="caption" color="text">
                                    -
                                  </ArgonTypography>
                                )}
                              </td>
                              <td>
                                {mark.GeoLat && mark.GeoLon ? (
                                  <ArgonTypography variant="caption" color="text">
                                    {mark.GeoLat.toFixed(4)}, {mark.GeoLon.toFixed(4)}
                                  </ArgonTypography>
                                ) : (
                                  <ArgonTypography variant="caption" color="text">
                                    Sin ubicación
                                  </ArgonTypography>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </ArgonBox>
                )}
              </ArgonBox>
            </Card>
          </Grid>
        </Grid>
      </ArgonBox>
      <Footer />
    </DashboardLayout>
  );
}

export default AttendanceHistory;