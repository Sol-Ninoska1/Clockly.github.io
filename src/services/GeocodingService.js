/**
 * Servicio de Geocodificación para convertir direcciones en coordenadas
 * Usa Google Maps Geocoding API como servicio principal
 */

class GeocodingService {
  constructor() {
    // La API Key debe estar en el archivo .env como REACT_APP_GOOGLE_MAPS_API_KEY
    this.googleApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
    this.googleBaseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
    this.nominatimBaseUrl = 'https://nominatim.openstreetmap.org/search';
  }

  /**
   * Geocodifica una dirección usando Google Maps API
   * @param {Object} addressData - Objeto con region, comuna, direccion
   * @returns {Promise<Object>} - Objeto con latitude, longitude, formattedAddress
   */
  async geocodeAddress(addressData) {
    const { region, comuna, direccion } = addressData;
    
    if (!direccion || !comuna) {
      throw new Error('La dirección y comuna son requeridas');
    }

    // Construir la dirección completa
    const fullAddress = `${direccion}, ${comuna}${region ? ', ' + region : ''}, Chile`;

    try {
      // Intentar primero con Google Maps
      if (this.googleApiKey) {
        return await this.geocodeWithGoogle(fullAddress);
      } else {
        console.warn('Google Maps API Key no configurada, usando Nominatim');
        return await this.geocodeWithNominatim(fullAddress);
      }
    } catch (error) {
      console.error('Error en geocodificación primaria, intentando alternativa:', error);
      // Si falla Google, intentar con Nominatim
      return await this.geocodeWithNominatim(fullAddress);
    }
  }

  /**
   * Geocodifica usando Google Maps Geocoding API
   */
  async geocodeWithGoogle(address) {
    const url = `${this.googleBaseUrl}?address=${encodeURIComponent(address)}&key=${this.googleApiKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === 'OK' && data.results.length > 0) {
      const result = data.results[0];
      const location = result.geometry.location;
      
      return {
        latitude: location.lat,
        longitude: location.lng,
        formattedAddress: result.formatted_address,
        source: 'Google Maps'
      };
    } else if (data.status === 'ZERO_RESULTS') {
      throw new Error('No se encontraron resultados para esta dirección');
    } else if (data.status === 'REQUEST_DENIED') {
      throw new Error('API Key inválida o dominio no autorizado');
    } else {
      throw new Error(`Error de Google Maps: ${data.status}`);
    }
  }

  /**
   * Geocodifica usando OpenStreetMap Nominatim (servicio alternativo gratuito)
   */
  async geocodeWithNominatim(address) {
    const url = `${this.nominatimBaseUrl}?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=cl`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Clockly-Dashboard/1.0' // Nominatim requiere User-Agent
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.length > 0) {
      const result = data[0];
      
      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        formattedAddress: result.display_name,
        source: 'OpenStreetMap'
      };
    } else {
      throw new Error('No se encontraron resultados para esta dirección');
    }
  }

  /**
   * Calcula la distancia entre dos puntos geográficos usando la fórmula de Haversine
   * @param {number} lat1 - Latitud del punto 1
   * @param {number} lon1 - Longitud del punto 1
   * @param {number} lat2 - Latitud del punto 2
   * @param {number} lon2 - Longitud del punto 2
   * @returns {number} - Distancia en metros
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distancia en metros
  }

  /**
   * Verifica si un punto está dentro del rango permitido
   * @param {number} lat1 - Latitud del punto a verificar
   * @param {number} lon1 - Longitud del punto a verificar
   * @param {number} lat2 - Latitud del punto de referencia
   * @param {number} lon2 - Longitud del punto de referencia
   * @param {number} rangeMeters - Rango permitido en metros
   * @returns {boolean} - true si está dentro del rango
   */
  isWithinRange(lat1, lon1, lat2, lon2, rangeMeters) {
    const distance = this.calculateDistance(lat1, lon1, lat2, lon2);
    return distance <= rangeMeters;
  }
}

export default new GeocodingService();
