import { useState, useEffect } from 'react';
import ApiService from '../services/ApiService';

// Hook para obtener estadísticas de asistencia desde home-data
export const useAsistenciaStats = () => {
  const [stats, setStats] = useState({
    empleadosPresentesHoy: 0,
    empleadosFaltantesHoy: 0,
    empleadosAtrasoHoy: 0,
    empleadosHrsExtraHoy: 0,
    porcentajePresentesAyer: 0,
    porcentajeFaltantesAyer: 0,
    porcentajeAtrasadosAyer: 0,
    porcentajeHrsExtraAyer: 0,
    asistenciaMensual: [],
    asistenciaPorCargo: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Obtener companyId del localStorage
        const companyId = localStorage.getItem("companyId");
        
        if (!companyId) {
          throw new Error("No se encontró el ID de la empresa");
        }

        const data = await ApiService.getHomeData(companyId);
        setStats({
          empleadosPresentesHoy: data.empleadosPresentesHoy,
          empleadosFaltantesHoy: data.empleadosFaltantesHoy,
          empleadosAtrasoHoy: data.empleadosAtrasoHoy,
          empleadosHrsExtraHoy: data.empleadosHrsExtraHoy,
          porcentajePresentesAyer: data.porcentajePresentesAyer,
          porcentajeFaltantesAyer: data.porcentajeFaltantesAyer,
          porcentajeAtrasadosAyer: data.porcentajeAtrasadosAyer,
          porcentajeHrsExtraAyer: data.porcentajeHrsExtraAyer,
          asistenciaMensual: data.asistenciaMensual,
          asistenciaPorCargo: data.asistenciaPorCargo,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error("Error fetching home data:", error);
        setStats(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }));
      }
    };

    fetchStats();
  }, []);

  return stats;
};

// Hook para obtener lista de empleados
export const useEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const data = await ApiService.getEmpleados();
        setEmpleados(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchEmpleados();
  }, []);

  return { empleados, loading, error };
};

// Hook para obtener asistencias
export const useAsistencias = () => {
  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAsistencias = async () => {
      try {
        const data = await ApiService.getAsistencias();
        setAsistencias(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchAsistencias();
  }, []);

  const refetch = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getAsistencias();
      setAsistencias(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return { asistencias, loading, error, refetch };
};

// Hook para obtener reportes de asistencia
export const useReporteAsistencia = (fechaInicio, fechaFin) => {
  const [reporte, setReporte] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (fechaInicio && fechaFin) {
      const fetchReporte = async () => {
        try {
          const data = await ApiService.getReporteAsistencia(fechaInicio, fechaFin);
          setReporte(data);
          setLoading(false);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      };

      fetchReporte();
    }
  }, [fechaInicio, fechaFin]);

  return { reporte, loading, error };
};