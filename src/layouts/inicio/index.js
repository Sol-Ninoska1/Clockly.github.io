/* eslint-disable no-unused-vars */
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
import Icon from "@mui/material/Icon";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";

// Argon Dashboard 2 MUI example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DetailedStatisticsCard from "examples/Cards/StatisticsCards/DetailedStatisticsCard";
import CategoriesList from "examples/Lists/CategoriesList";
import GradientLineChart from "examples/Charts/LineCharts/GradientLineChart";

// Argon Dashboard 2 MUI base styles
import typography from "assets/theme/base/typography";

// Dashboard layout components
import Slider from "layouts/inicio/components/Slider";

// Data
import gradientLineChartData from "layouts/inicio/data/gradientLineChartData";
import categoriesListData from "layouts/inicio/data/categoriesListData";

// API Hooks
import { useAsistenciaStats } from "hooks/useApiData";

function Default() {
  const { size } = typography;
  const stats = useAsistenciaStats();

  // Generar datos del gráfico basado en asistenciaMensual
  const generateChartData = () => {
    if (stats.loading) {
      return {
        labels: ["Cargando..."],
        datasets: [
          {
            label: "Asistencias",
            color: "info", 
            data: [0],
          },
        ],
      };
    }

    if (!stats.asistenciaMensual || stats.asistenciaMensual.length === 0) {
      return {
        labels: ["Sin datos"],
        datasets: [
          {
            label: "Asistencias",
            color: "info", 
            data: [0],
          },
        ],
      };
    }

    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    
    return {
      labels: stats.asistenciaMensual.map(item => monthNames[item.month - 1]),
      datasets: [
        {
          label: "Asistencias",
          color: "info", 
          data: stats.asistenciaMensual.map(item => item.total),
        },
      ],
    };
  };

  // Generar datos de la tabla basado en asistenciaPorCargo
  const generateTableData = () => {
    if (stats.loading) {
      return [
        {
          Cargo:"Cargando...",
          Empleados: "...",
          "Presentes Hoy": "...",
          "% Asistencia": "..."
        }
      ];
    }

    if (!stats.asistenciaPorCargo || stats.asistenciaPorCargo.length === 0) {
      return [
        {
          Cargo: "Sin datos",
          Empleados: 0,
          "Presentes Hoy": 0,
          "% Asistencia": "0%"
        }
      ];
    }

    return stats.asistenciaPorCargo.map(item => ({
      Cargo: item.cargo,
      Empleados: item.totalEmpleados,
      "Presentes Hoy": item.totalMarcas,
      "% Asistencia": item.totalEmpleados > 0 ? `${((item.totalMarcas / item.totalEmpleados) * 100).toFixed(1)}%` : "0%"
    }));
  };
  
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ArgonBox py={3}>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={6} lg={3}>
            <DetailedStatisticsCard
              title="Empleados Presentes Hoy"
              count={stats.loading ? "..." : stats.empleadosPresentesHoy.toString()}
              icon={{ color: "success", component: <i className="ni ni-check-bold" /> }}
              percentage={{ 
                color: stats.loading ? "secondary" : (stats.porcentajePresentesAyer >= 0 ? "success" : "error"), 
                count: stats.loading ? "..." : `${stats.porcentajePresentesAyer.toFixed(1)}%`, 
                text: "ayer" 
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DetailedStatisticsCard
              title="Empleados Faltantes Hoy"
              count={stats.loading ? "..." : stats.empleadosFaltantesHoy.toString()}
              icon={{ color: "error", component: <i className="ni ni-fat-remove" /> }}
              percentage={{ 
                color: stats.loading ? "secondary" : (stats.porcentajeFaltantesAyer <= 50 ? "success" : "error"), 
                count: stats.loading ? "..." : `${stats.porcentajeFaltantesAyer.toFixed(1)}%`, 
                text: "ayer" 
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DetailedStatisticsCard
              title="Empleados con Atraso Hoy"
              count={stats.loading ? "..." : stats.empleadosAtrasoHoy.toString()}
              icon={{ color: "warning", component: <i className="ni ni-watch-time" /> }}
              percentage={{ 
                color: stats.loading ? "secondary" : (stats.porcentajeAtrasadosAyer <= 10 ? "success" : "warning"), 
                count: stats.loading ? "..." : `${stats.porcentajeAtrasadosAyer.toFixed(1)}%`, 
                text: "ayer" 
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DetailedStatisticsCard
              title="Empleados Hrs Extra Hoy"
              count={stats.loading ? "..." : stats.empleadosHrsExtraHoy.toString()}
              icon={{ color: "primary", component: <i className="ni ni-satisfied" /> }}
              percentage={{ 
                color: stats.loading ? "secondary" : (stats.porcentajeHrsExtraAyer >= 0 ? "primary" : "secondary"), 
                count: stats.loading ? "..." : `${stats.porcentajeHrsExtraAyer.toFixed(1)}%`, 
                text: "ayer" 
              }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} lg={7}>
            <GradientLineChart
              title="Asistencia Mensual"
              description={
                <ArgonBox display="flex" alignItems="center">
                  <ArgonBox fontSize={size.lg} color="success" mb={0.3} mr={0.5} lineHeight={0}>
                    <Icon sx={{ fontWeight: "bold" }}>arrow_upward</Icon>
                  </ArgonBox>
                  <ArgonTypography variant="button" color="text" fontWeight="medium">
                    Marcas registradas{" "}
                    <ArgonTypography variant="button" color="text" fontWeight="regular">
                      por mes
                    </ArgonTypography>
                  </ArgonTypography>
                </ArgonBox>
              }
              chart={generateChartData()}
            />
          </Grid>
          <Grid item xs={12} lg={5}>
            <Slider />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card>
              <ArgonBox p={3}>
                <ArgonTypography variant="h6" fontWeight="medium" mb={3}>
                  Asistencia por Cargos
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
                        <th style={{ width: "40%" }}>Cargo</th>
                        <th style={{ width: "20%" }}>Empleados</th>
                        <th style={{ width: "20%" }}>Presentes Hoy</th>
                        <th style={{ width: "20%" }}>% Asistencia</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generateTableData().map((row, index) => {
                        const raw = row["% Asistencia"] || "0%";
                        const parsed = parseFloat(String(raw).replace('%', '')) || 0;
                        return (
                          <tr key={index}>
                            <td style={{ fontWeight: 500 }}>{row.Cargo}</td>
                            <td>{row.Empleados}</td>
                            <td>{row["Presentes Hoy"]}</td>
                            <td>
                              <Chip
                                label={raw}
                                size="small"
                                color={parsed > 0 ? 'success' : 'default'}
                                variant={parsed > 0 ? 'filled' : 'outlined'}
                                sx={{ fontWeight: 600, minWidth: 60 }}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </ArgonBox>
              </ArgonBox>
            </Card>
          </Grid>
        </Grid>
      </ArgonBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Default;
