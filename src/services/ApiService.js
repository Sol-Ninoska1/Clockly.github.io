// Servicio para conectar con la API .NET
class ApiService {
  constructor() {
    // this.baseURL = 'http://localhost:5290/api/Companies'; // URL correcta con Companies
    this.baseURL = 'https://apimovil.somee.com/api/Companies';
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  // Método genérico para hacer peticiones
  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: this.headers,
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Métodos específicos para asistencia
  async getAsistencias() {
    return this.request('/asistencia');
  }

  async getAsistenciaById(id) {
    return this.request(`/asistencia/${id}`);
  }

  async createAsistencia(data) {
    return this.request('/asistencia', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAsistencia(id, data) {
    return this.request(`/asistencia/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAsistencia(id) {
    return this.request(`/asistencia/${id}`, {
      method: 'DELETE',
    });
  }

  // Métodos para empleados
  async getEmpleados() {
    return this.request('/empleados');
  }

  async getEmpleadoById(id) {
    return this.request(`/empleados/${id}`);
  }

  // Métodos para reportes
  async getReporteAsistencia(fechaInicio, fechaFin) {
    return this.request(`/reportes/asistencia?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }

  async getEstadisticasAsistencia() {
    return this.request('/reportes/estadisticas');
  }

  // Método para obtener datos del dashboard de inicio
  async getHomeData(companyId) {
    return this.request(`/${companyId}/home-data`);
  }

  // Métodos para departamentos
  async getDepartamentos() {
    return this.request('/departamentos');
  }
}

export default new ApiService();