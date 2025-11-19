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
import { useState, useEffect, useRef } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import Slider from "@mui/material/Slider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import InputAdornment from "@mui/material/InputAdornment";
import Chip from "@mui/material/Chip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";

// @mui icons
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonButton from "components/ArgonButton";

// Argon Dashboard 2 MUI examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Servicios
import GeocodingService from "services/GeocodingService";

function RTL() {
  const [attendanceRanges, setAttendanceRanges] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRange, setSelectedRange] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const companyId = localStorage.getItem("companyId");

  const [formData, setFormData] = useState({
    selectedEmployees: [],
    latitude: '',
    longitude: '',
    region: '',
    comuna: '',
    direccion: '',
    activated: false
  });

  const [allowedRange, setAllowedRange] = useState(500); 
  const [locationValidation, setLocationValidation] = useState(false);
  const [workplaceLocation, setWorkplaceLocation] = useState({
    latitude: '',
    longitude: '',
    address: "",
    region: "",
    comuna: ""
  });
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState(null);
  const hasEditedMain = useRef(false);
  const hasEditedDialog = useRef(false);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [dialogAddressSuggestions, setDialogAddressSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [loadingDialogSuggestions, setLoadingDialogSuggestions] = useState(false);
  const placesTokenMain = useRef("");
  const placesTokenDialog = useRef("");
  const suggestTimerMain = useRef(null);
  const suggestTimerDialog = useRef(null);
  const mainAddressInputRef = useRef(null);
  const dialogAddressInputRef = useRef(null);
  const [isMainInputFocused, setIsMainInputFocused] = useState(false);
  const [isDialogInputFocused, setIsDialogInputFocused] = useState(false);

  const genSessionToken = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

  const handleMainAddressChange = (event) => {
    const value = event.target.value;
    setWorkplaceLocation(prev => ({ ...prev, address: value }));
    hasEditedMain.current = true;
    
    if (value && value.length >= 2 && workplaceLocation.region && workplaceLocation.comuna) {
      if (suggestTimerMain.current) clearTimeout(suggestTimerMain.current);
      suggestTimerMain.current = setTimeout(() => {
        fetchAddressSuggestions(value, workplaceLocation.region, workplaceLocation.comuna, false);
      }, 300);
    } else {
      setAddressSuggestions([]);
    }
  };

  const handleMainAddressSelect = (suggestion) => {
    setWorkplaceLocation(prev => ({ ...prev, address: suggestion }));
    setAddressSuggestions([]);
    const addr = `${suggestion}, ${workplaceLocation.comuna}, ${workplaceLocation.region}`;
    geocodeAddress(addr);
  };

  const handleDialogAddressChange = (event) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, direccion: value }));
    hasEditedDialog.current = true;
    
    if (value && value.length >= 2 && formData.region && formData.comuna) {
      if (suggestTimerDialog.current) clearTimeout(suggestTimerDialog.current);
      suggestTimerDialog.current = setTimeout(() => {
        fetchAddressSuggestions(value, formData.region, formData.comuna, true);
      }, 300);
    } else {
      setDialogAddressSuggestions([]);
    }
  };

  const handleDialogAddressSelect = (suggestion) => {
    setFormData(prev => ({ ...prev, direccion: suggestion }));
    setDialogAddressSuggestions([]);
    const addr = `${suggestion}, ${formData.comuna}, ${formData.region}`;
    geocodeAddressForForm(addr);
  };

  const fetchAddressSuggestions = async (query, region, comuna, forDialog = false) => {
    if (!query || query.trim().length < 2) {
      forDialog ? setDialogAddressSuggestions([]) : setAddressSuggestions([]);
      forDialog ? setLoadingDialogSuggestions(false) : setLoadingSuggestions(false);
      return;
    }
    if (!region || !comuna) {
      forDialog ? setDialogAddressSuggestions([]) : setAddressSuggestions([]);
      forDialog ? setLoadingDialogSuggestions(false) : setLoadingSuggestions(false);
      return;
    }
    
    const extractStreetAddress = (fullAddress) => {
      const parts = fullAddress.split(',').map(p => p.trim());
      return parts[0] || fullAddress;
    };
    
    const hasStreetNumber = (address) => {
      return /\d/.test(address);
    };
    
    const isSpecificPlace = (address) => {
      const placeKeywords = ['universidad', 'biblioteca', 'instituto', 'hospital', 'estadio', 
                             'museo', 'parque', 'centro', 'mall', 'clinica', 'colegio', 
                             'escuela', 'iglesia', 'catedral', 'palacio', 'ministerio'];
      const lowerAddr = address.toLowerCase();
      return placeKeywords.some(keyword => lowerAddr.includes(keyword));
    };
    
    try {
      forDialog ? setLoadingDialogSuggestions(true) : setLoadingSuggestions(true);
      
      const nominatimQuery = `${query}, ${comuna}, Chile`;
      const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=20&countrycodes=cl&q=${encodeURIComponent(nominatimQuery)}`;
      
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'ClocklyDashboard/1.0'
        }
      });
      
      if (!res.ok) throw new Error('Nominatim error');
      
      const data = await res.json();
      
      if (data && data.length > 0) {
        const opts = data
          .filter(r => {
            const address = r.address || {};
            const resultComuna = address.city || address.town || address.municipality || address.county || '';
            const belongsToComuna = resultComuna.toLowerCase().includes(comuna.toLowerCase()) || 
                                   r.display_name.toLowerCase().includes(comuna.toLowerCase());
            
            if (!belongsToComuna) return false;
            
            const hasHouseNumber = address.house_number || /\d+/.test(address.road || '');
            const streetAddress = extractStreetAddress(r.display_name || '');
            const hasNumber = hasStreetNumber(streetAddress);
            const isPlace = isSpecificPlace(streetAddress);
            
           
            return (hasNumber && !isPlace) || hasHouseNumber;
          })
          .map(r => {
            const address = r.address || {};
            if (address.road && address.house_number) {
              return `${address.road} ${address.house_number}`;
            }
            return extractStreetAddress(r.display_name || '');
          })
          .filter((addr, index, self) => addr && addr.length > 0 && self.indexOf(addr) === index) 
          .slice(0, 10); 
        
        forDialog ? setDialogAddressSuggestions(opts) : setAddressSuggestions(opts);
        forDialog ? setLoadingDialogSuggestions(false) : setLoadingSuggestions(false);
      } else {
        // Si no hay resultados, limpiar sugerencias
        forDialog ? setDialogAddressSuggestions([]) : setAddressSuggestions([]);
        forDialog ? setLoadingDialogSuggestions(false) : setLoadingSuggestions(false);
      }
    } catch (err) {
      forDialog ? setDialogAddressSuggestions([]) : setAddressSuggestions([]);
      forDialog ? setLoadingDialogSuggestions(false) : setLoadingSuggestions(false);
      console.error('Error obteniendo sugerencias:', err);
    }
  };

  const fetchAttendanceRanges = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/Companies/${companyId}/GetAttendance-range`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setAttendanceRanges(data);
      
      if (data && data.length > 0 && data[0].region) {
        setWorkplaceLocation(prev => ({
          ...prev,
          region: data[0].region || prev.region,
          comuna: data[0].comuna || prev.comuna,
          address: data[0].direccion || prev.address,
          latitude: data[0].latitude || prev.latitude,
          longitude: data[0].longitude || prev.longitude
        }));
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching attendance ranges:', err);
      setAttendanceRanges([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`/api/Companies/${companyId}/users`);
      
      if (response.ok) {
        const data = await response.json();
        const mappedEmployees = data.map(emp => ({
          ...emp,
          rut: emp.rut || '',
          name: `${emp.firstName || ''} ${emp.lastName || ''} ${emp.secondLastName || ''}`.trim()
        }));
        setEmployees(mappedEmployees);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const fetchRegiones = async () => {
    try {
      const response = await fetch('/api/Companies/regiones');
      if (response.ok) {
        const data = await response.json();
        console.log('Regiones recibidas:', data);
        setRegiones(data || []);
      } else {
        console.error('Error al cargar regiones:', response.status);
      }
    } catch (err) {
      console.error('Error fetching regiones:', err);
    }
  };

  const fetchComunas = async () => {
    try {
      const response = await fetch('/api/Companies/comunas');
      if (response.ok) {
        const data = await response.json();
        console.log('Comunas recibidas:', data);
        setComunas(data || []);
      } else {
        console.error('Error al cargar comunas:', response.status);
      }
    } catch (err) {
      console.error('Error fetching comunas:', err);
    }
  };

  useEffect(() => {
    fetchAttendanceRanges();
    fetchEmployees();
    fetchRegiones();
    fetchComunas();
  }, [companyId]);

  const handleAddRange = () => {
    if (!workplaceLocation.latitude || !workplaceLocation.longitude) {
      setGeocodingError("Por favor, primero configura la ubicación del lugar de trabajo y calcula las coordenadas.");
      return;
    }

    setSelectedRange(null);
    setIsEditing(false);
    setFormData({
      selectedEmployees: [],
      latitude: workplaceLocation.latitude,
      longitude: workplaceLocation.longitude,
      region: workplaceLocation.region || '',
      comuna: workplaceLocation.comuna || '',
      direccion: '', 
      activated: locationValidation
    });
    hasEditedDialog.current = false; 
    setDialogAddressSuggestions([]);
    setOpenDialog(true);
  };

  const handleEditRange = (range) => {
    setSelectedRange(range);
    setIsEditing(true);
    setFormData({
      selectedEmployees: [range.rut], 
      latitude: range.latitude,
      longitude: range.longitude,
      region: range.region || '',
      comuna: range.comuna || '',
      direccion: range.direccion || '',
      activated: range.activated
    });
    hasEditedDialog.current = false; 
    setOpenDialog(true);
  };

  const handleFormChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (field === 'direccion') {
      hasEditedDialog.current = true;
    }
  };

  const handleSaveRange = async () => {
    try {
      // Validar que se tengan las coordenadas
      if (!formData.latitude || !formData.longitude) {
        setError("Las coordenadas son requeridas. Por favor calcula la ubicación primero.");
        return;
      }

      if (isEditing) {
        const dataToSend = {
          rut: formData.selectedEmployees[0],
          latitude: formData.latitude ? String(formData.latitude) : '',
          longitude: formData.longitude ? String(formData.longitude) : '',
          region: formData.region,
          comuna: formData.comuna,
          direccion: formData.direccion,
          rangeAllowed: allowedRange,
          activated: formData.activated ? 1 : 0
        };
        
        const response = await fetch(`/api/Companies/${companyId}/UpdateAttendance-range/${selectedRange.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend)
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      } else {
        // Insertar múltiples empleados
        const promises = formData.selectedEmployees.map(rut => {
          const dataToSend = {
            rut: rut,
            latitude: formData.latitude ? String(formData.latitude) : '',
            longitude: formData.longitude ? String(formData.longitude) : '',
            region: formData.region,
            comuna: formData.comuna,
            direccion: formData.direccion,
            rangeAllowed: allowedRange,
            activated: formData.activated ? 1 : 0
          };
          
          return fetch(`/api/Companies/${companyId}/InsertAttendance-range`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend)
          });
        });

        const responses = await Promise.all(promises);
        
        const failedResponses = responses.filter(r => !r.ok);
        if (failedResponses.length > 0) {
          throw new Error(`Error al crear ${failedResponses.length} empleado(s)`);
        }
      }

      await fetchAttendanceRanges();
      setOpenDialog(false);
      setError(null);
      setGeocodingError(null);
      
      console.log(`✅ Rango de asistencia ${isEditing ? 'actualizado' : 'creado'} correctamente`);
    } catch (err) {
      setError(`Error al ${isEditing ? 'actualizar' : 'crear'} rango: ${err.message}`);
      console.error('Error saving range:', err);
    }
  };

  const handleActivationToggle = async (rangeId, activated) => {
    try {
      const range = attendanceRanges.find(r => r.id === rangeId);
      if (!range) return;

      const response = await fetch(`/api/Companies/${companyId}/UpdateAttendance-range/${rangeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rut: range.rut,
          latitude: range.latitude ? String(range.latitude) : '',
          longitude: range.longitude ? String(range.longitude) : '',
          region: range.region || '',
          comuna: range.comuna || '',
          direccion: range.direccion || '',
          activated: activated ? 1 : 0
        })
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      setAttendanceRanges(prev => prev.map(r => 
        r.id === rangeId ? { ...r, activated: activated ? 1 : 0 } : r
      ));

      console.log(`Rango ${rangeId} ${activated ? 'activado' : 'desactivado'}`);
    } catch (err) {
      setError(`Error al actualizar activación: ${err.message}`);
      console.error('Error updating activation:', err);
    }
  };

  const geocodeAddress = async (address) => {
    if (!address.trim()) {
      setGeocodingError("Por favor ingresa una dirección válida");
      return;
    }

    setIsGeocoding(true);
    setGeocodingError(null);

    try {
      const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'AIzaSyBDoQqKlfUB0IntET0jIEhIJvW1UQ7JbI0';
      
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address + ', Chile')}&key=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        const result0 = data.results[0];
        const location = result0.geometry.location;
        const comps = result0.address_components || [];
        const route = comps.find(c => c.types?.includes('route'))?.long_name || '';
        const number = comps.find(c => c.types?.includes('street_number'))?.long_name || '';
        const shortAddr = [route, number].filter(Boolean).join(' ').trim() || result0.formatted_address;

        setWorkplaceLocation(prev => ({
          ...prev,
          latitude: location.lat,
          longitude: location.lng,
          address: shortAddr
        }));
        
        console.log(`✅ Dirección encontrada: ${formattedAddress}`);
        console.log(`📍 Coordenadas: ${location.lat}, ${location.lng}`);
        
      } else if (data.status === 'ZERO_RESULTS') {
        console.log('Google Maps no encontró resultados, intentando con OpenStreetMap...');
        await geocodeWithNominatim(address);
      } else if (data.status === 'REQUEST_DENIED') {
        setGeocodingError("API Key inválida o dominio no autorizado. Usando servicio alternativo...");
        await geocodeWithNominatim(address);
      } else {
        setGeocodingError(`Error de Google Maps: ${data.status}. Usando servicio alternativo...`);
        await geocodeWithNominatim(address);
      }
    } catch (error) {
      console.error('Error con Google Maps, usando OpenStreetMap:', error);
      await geocodeWithNominatim(address);
    } finally {
      setIsGeocoding(false);
    }
  };

  // Geocoding for dialog form (updates formData lat/lon)
  const geocodeAddressForForm = async (address) => {
    if (!address.trim()) {
      setGeocodingError("Por favor ingresa una dirección válida");
      return;
    }

    setIsGeocoding(true);
    setGeocodingError(null);

    try {
      const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'AIzaSyBDoQqKlfUB0IntET0jIEhIJvW1UQ7JbI0';
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address + ', Chile')}&key=${API_KEY}`
      );
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
      const data = await response.json();
      if (data.status === 'OK' && data.results.length > 0) {
        const result0 = data.results[0];
        const location = result0.geometry.location;
        const comps = result0.address_components || [];
        const route = comps.find(c => c.types?.includes('route'))?.long_name || '';
        const number = comps.find(c => c.types?.includes('street_number'))?.long_name || '';
        const shortAddr = [route, number].filter(Boolean).join(' ').trim() || result0.formatted_address;
        setFormData(prev => ({
          ...prev,
          latitude: String(location.lat),
          longitude: String(location.lng),
          direccion: shortAddr
        }));
      } else {
        await geocodeFormWithNominatim(address);
      }
    } catch (error) {
      await geocodeFormWithNominatim(address);
    } finally {
      setIsGeocoding(false);
    }
  };

  const geocodeFormWithNominatim = async (address) => {
    if (!address.trim()) {
      setGeocodingError("Por favor ingresa una dirección válida");
      return;
    }

    setIsGeocoding(true);
    setGeocodingError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=cl`
      );
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
      const data = await response.json();
      if (data.length > 0) {
        const result = data[0];
        const shortAddr = (result.display_name || '').split(',')[0]?.trim() || result.display_name;
        setFormData(prev => ({
          ...prev,
          latitude: String(parseFloat(result.lat)),
          longitude: String(parseFloat(result.lon)),
          direccion: shortAddr
        }));
      } else {
        setGeocodingError("No se encontraron resultados para esta dirección en Chile. Verifica que esté correcta.");
      }
    } catch (error) {
      console.error('Error geocoding with Nominatim (form):', error);
      setGeocodingError("Error al buscar la dirección. Verifica tu conexión a internet.");
    } finally {
      setIsGeocoding(false);
    }
  };

  const geocodeWithNominatim = async (address) => {
    if (!address.trim()) {
      setGeocodingError("Por favor ingresa una dirección válida");
      return;
    }

    setIsGeocoding(true);
    setGeocodingError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=cl`
      );
      
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
      
      const data = await response.json();
      
      if (data.length > 0) {
        const result = data[0];
        
        const shortAddr = (result.display_name || '').split(',')[0]?.trim() || result.display_name;
        setWorkplaceLocation(prev => ({
          ...prev,
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          address: shortAddr
        }));
        
        console.log(`Dirección encontrada: ${result.display_name}`);
        console.log(`Coordenadas: ${result.lat}, ${result.lon}`);
        
      } else {
        setGeocodingError("No se encontraron resultados para esta dirección en Chile. Verifica que esté correcta.");
      }
    } catch (error) {
      console.error('Error geocoding with Nominatim:', error);
      setGeocodingError("Error al buscar la dirección. Verifica tu conexión a internet.");
    } finally {
      setIsGeocoding(false);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; 
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ArgonBox py={3}>
         <Grid container spacing={3} justifyContent="center">
          {/* Resumen de Empleados */}
          <Grid item xs={12} lg={4}>
            <Card>
              <ArgonBox p={3}>
                <ArgonTypography variant="h5" gutterBottom>
                   Total de empleados configurados
                </ArgonTypography>
                <ArgonBox mt={4}>
                  <ArgonTypography variant="h3" color="primary">
                    {attendanceRanges.length}
                  </ArgonTypography>              
                </ArgonBox>
              </ArgonBox>
            </Card>
          </Grid>

          {/* Configuración de Ubicación de Trabajo */}

          <Grid item xs={12} lg={4} justifyContent="center">
            <Card>
              <ArgonBox p={3}>
                <ArgonTypography variant="h5" gutterBottom>
                  Empleados con validación activada
                </ArgonTypography>
                <ArgonBox mt={4}>
                  <ArgonTypography variant="h3" color="success">
                    {attendanceRanges.filter(range => range.activated === 1).length}
                  </ArgonTypography>              
                </ArgonBox>
              </ArgonBox>
            </Card>
          </Grid>

          {/* Configuración de Ubicación de Trabajo */}
          
          <Grid item xs={12} lg={12}>
            <Card>
              <ArgonBox p={3}>
                <ArgonTypography variant="h5" gutterBottom>
                  Configuración de Jornada Laboral
                </ArgonTypography>
                <ArgonTypography variant="caption" color="text.secondary" display="block" mb={2}>
                  • Paso 1: Configura la ubicación del lugar de trabajo 
                  • Paso 2: Ajusta el rango permitido 
                  • Paso 3: Agrega empleados
                </ArgonTypography>
                
                <Grid container spacing={2} mt={2}>
              
                  <Grid item xs={12} md={4}>
                    <Autocomplete
                      options={regiones}
                      getOptionLabel={(option) => {
                        if (typeof option === 'string') return option;
                        return option?.descripcion || '';
                      }}
                      value={regiones.find(r => (typeof r === 'string' ? r : r?.descripcion) === workplaceLocation.region) || workplaceLocation.region || null}
                      onChange={(event, newValue) => {
                        const regionValue = typeof newValue === 'string' ? newValue : (newValue?.descripcion || '');
                        setWorkplaceLocation(prev => ({
                          ...prev,
                          region: regionValue
                        }));
                      }}
                      isOptionEqualToValue={(option, value) => {
                        const optionValue = typeof option === 'string' ? option : option?.descripcion;
                        const compareValue = typeof value === 'string' ? value : value?.descripcion;
                        return optionValue === compareValue;
                      }}
                      freeSolo
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Región"
                          variant="outlined"
                          fullWidth
                          placeholder="Selecciona o escribe una región"
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Autocomplete
                      options={comunas}
                      getOptionLabel={(option) => {
                        if (typeof option === 'string') return option;
                        return option?.descripcion || '';
                      }}
                      value={comunas.find(c => (typeof c === 'string' ? c : c?.descripcion) === workplaceLocation.comuna) || workplaceLocation.comuna || null}
                      onChange={(event, newValue) => {
                        const comunaValue = typeof newValue === 'string' ? newValue : (newValue?.descripcion || '');
                        setWorkplaceLocation(prev => ({
                          ...prev,
                          comuna: comunaValue
                        }));
                      }}
                      isOptionEqualToValue={(option, value) => {
                        const optionValue = typeof option === 'string' ? option : option?.descripcion;
                        const compareValue = typeof value === 'string' ? value : value?.descripcion;
                        return optionValue === compareValue;
                      }}
                      freeSolo
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Comuna"
                          variant="outlined"
                          fullWidth
                          placeholder="Selecciona o escribe una comuna"
                        />
                      )}
                    />
                  </Grid>
                  
                  {/* Dirección con sugerencias tipo Google */}
                  <Grid item xs={12} md={11}>
                    <Box sx={{ position: 'relative' }}>
                      <TextField
                        fullWidth
                        label="Dirección del Lugar de Trabajo"
                        variant="outlined"
                        placeholder="Ej: Los Robles 356"
                        value={workplaceLocation.address || ''}
                        onChange={handleMainAddressChange}
                        sx={{
                          '& .MuiInputBase-input': {
                            width: '100% !important',
                          }
                        }}
                        onBlur={() => {
                          setIsMainInputFocused(false);
                          setTimeout(() => setAddressSuggestions([]), 200);
                        }}
                        onFocus={(e) => {
                          setIsMainInputFocused(true);
                          if (e.target.value && e.target.value.length >= 2 && workplaceLocation.region && workplaceLocation.comuna) {
                            fetchAddressSuggestions(e.target.value, workplaceLocation.region, workplaceLocation.comuna, false);
                          }
                        }}
                        inputRef={mainAddressInputRef}
                        autoComplete="off"
                        helperText={!workplaceLocation.region || !workplaceLocation.comuna ? "Selecciona región y comuna primero" : "Escribe y verás sugerencias automáticamente"}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOnIcon color="action" />
                            </InputAdornment>
                          ),
                          endAdornment: loadingSuggestions ? (
                            <InputAdornment position="end">
                              <CircularProgress size={20} />
                            </InputAdornment>
                          ) : null,
                        }}
                      />
                    {isMainInputFocused && addressSuggestions.length > 0 && (
                      <Box
                        sx={{
                          position: 'absolute',
                          zIndex: 1300,
                          width: mainAddressInputRef.current?.parentElement?.offsetWidth || '100%',
                          maxHeight: 300,
                          overflowY: 'auto',
                          bgcolor: '#ffffff',
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                          borderRadius: '12px',
                          mt: 0.25,
                          border: '2px solid',
                          borderColor: '#e3f2fd',
                          '&::-webkit-scrollbar': {
                            width: '8px',
                          },
                          '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#bdbdbd',
                            borderRadius: '4px',
                          },
                        }}
                      >
                        {addressSuggestions.map((suggestion, index) => (
                          <Box
                            key={index}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleMainAddressSelect(suggestion);
                            }}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              p: 1.75,
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              borderRadius: index === 0 ? '10px 10px 0 0' : index === addressSuggestions.length - 1 ? '0 0 10px 10px' : '0',
                              '&:hover': {
                                bgcolor: '#e3f2fd',
                                transform: 'translateX(4px)',
                                boxShadow: 'inset 4px 0 0 #2196f3',
                              },
                              borderBottom: index < addressSuggestions.length - 1 ? '1px solid #f5f5f5' : 'none',
                            }}
                          >
                            <LocationOnIcon 
                              fontSize="small" 
                              sx={{ 
                                mr: 1.5, 
                                flexShrink: 0,
                                color: '#2196f3',
                              }} 
                            />
                            <ArgonTypography 
                              variant="body2" 
                              sx={{ 
                                whiteSpace: 'normal',
                                color: '#424242',
                                fontWeight: 500,
                              }}
                            >
                              {suggestion}
                            </ArgonTypography>
                          </Box>
                        ))}
                      </Box>
                    )}
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={1} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
                      <ArgonButton
                        size="small"
                        variant="gradient"
                        color="info"
                        onClick={() => geocodeAddress(`${workplaceLocation.address}, ${workplaceLocation.comuna}, ${workplaceLocation.region}`)}
                        disabled={isGeocoding || !workplaceLocation.address.trim() || !workplaceLocation.comuna}
                        sx={{ height: 40, minWidth: 92, borderRadius: '8px', textTransform: 'none', px: 2 }}
                      >
                        {isGeocoding ? 'Buscando...' : 'Buscar'}
                      </ArgonButton>
                    </Box>
                  </Grid>

                  {/* Mostrar coordenadas calculadas */}
                  {workplaceLocation.latitude && workplaceLocation.longitude && (
                    <Grid item xs={12}>
                      <Alert severity="success" icon={<CheckCircleIcon />}>
                        <ArgonTypography variant="body2" fontWeight="bold" gutterBottom>
                          ✓ Ubicación configurada correctamente
                        </ArgonTypography>
                        <ArgonTypography variant="caption" display="block">
                          📍 Coordenadas: {workplaceLocation.latitude}, {workplaceLocation.longitude}
                        </ArgonTypography>
                        {workplaceLocation.address && (
                          <ArgonTypography variant="caption" display="block" mt={0.5}>
                            🏢 {workplaceLocation.address}
                          </ArgonTypography>
                        )}
                        <ArgonTypography variant="caption" display="block" mt={0.5} fontWeight="bold">
                          Ya puedes agregar empleados con esta configuración
                        </ArgonTypography>
                      </Alert>
                    </Grid>
                  )}

                  {/* Error de geocodificación */}
                  {geocodingError && (
                    <Grid item xs={12}>
                      <Alert severity="warning" sx={{ mb: 1 }}>
                        {geocodingError}
                      </Alert>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <ArgonTypography variant="body2" mb={1}>
                      Rango Permitido: {allowedRange} metros
                    </ArgonTypography>
                    <ArgonTypography variant="caption" color="text.secondary" mb={2} display="block">
                      Define el área alrededor del lugar de trabajo donde los empleados pueden registrar asistencia.
                      Por ejemplo: si trabajas en Avenida 3, el rango puede cubrir desde Avenida 1 hasta Avenida 6.
                    </ArgonTypography>
                    <Slider
                      value={allowedRange}
                      onChange={(e, newValue) => setAllowedRange(newValue)}
                      min={50}
                      max={2000}
                      valueLabelDisplay="auto"
                      marks={[
                        { value: 50, label: '50m' },
                        { value: 200, label: '200m' },
                        { value: 500, label: '500m' },
                        { value: 1000, label: '1km' },
                        { value: 2000, label: '2km' }
                      ]}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={locationValidation}
                          onChange={(e) => setLocationValidation(e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Activar Validación de Ubicación"
                    />
                  </Grid>
                </Grid>
              </ArgonBox>
            </Card>
          </Grid>

          {/* Header con botones de acción */}
          <Grid item xs={12}>
            <ArgonBox mb={3} display="flex" justifyContent="space-between" alignItems="center">
              <ArgonTypography variant="h4" fontWeight="bold">
                Gestión de Rango de Asistencia
              </ArgonTypography>
              <ArgonBox display="flex" gap={2}>
                <ArgonButton 
                  variant="outlined" 
                  color="info" 
                  onClick={fetchAttendanceRanges}
                  startIcon={<RefreshIcon />}
                >
                  Actualizar
                </ArgonButton>
                <ArgonButton 
                  variant="gradient" 
                  color="success" 
                  onClick={handleAddRange}
                  startIcon={<AddIcon />}
                >
                  Agregar Empleado
                </ArgonButton>
              </ArgonBox>
            </ArgonBox>
          </Grid>

          {/* Error Alert */}
          {/* {error && (
            <Grid item xs={12}>
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            </Grid>
          )} */}

          {/* Tabla de Empleados con Rango de Asistencia */}
          <Grid item xs={12} md={12}>
            <Card>
              <ArgonBox p={3}>
                <ArgonTypography variant="h6" fontWeight="medium" mb={3}>
                  Lista de Empleados y Configuración de Ubicación
                </ArgonTypography>
                
                {loading ? (
                  <ArgonBox display="flex" justifyContent="center" py={3}>
                    <CircularProgress />
                  </ArgonBox>
                ) : attendanceRanges.length === 0 ? (
                  <ArgonBox textAlign="center" py={3}>
                    <ArgonTypography variant="h6" color="text">
                      No se encontraron empleados configurados
                    </ArgonTypography>
                    <ArgonTypography variant="body2" color="text">
                      Agrega empleados usando el botón &quot;Agregar Empleado&quot;
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
                          <th>RUT</th>
                          <th>Nombre</th>
                          <th>Región</th>
                          <th>Comuna</th>
                          <th>Dirección</th>
                          <th>Latitud</th>
                          <th>Longitud</th>
                          <th>Rango Permitido</th>
                          <th>Distancia</th>
                          <th>Validación</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceRanges.map((range) => {
                          const lat = parseFloat(range.latitude);
                          const lng = parseFloat(range.longitude);
                          const employeeRange = range.rangeAllowed || allowedRange;
                          const distance = calculateDistance(
                            lat,
                            lng,
                            workplaceLocation.latitude,
                            workplaceLocation.longitude
                          );
                          const isWithinRange = distance <= employeeRange;
                          
                          return (
                            <tr key={range.id}>
                              <td style={{ fontWeight: 500 }}>{range.rut}</td>
                              <td>{range.nombre || 'N/A'}</td>
                              <td>{range.region || 'N/A'}</td>
                              <td>{range.comuna || 'N/A'}</td>
                              <td>{range.direccion || 'N/A'}</td>
                              <td>{lat ? lat.toFixed(6) : 'N/A'}</td>
                              <td>{lng ? lng.toFixed(6) : 'N/A'}</td>
                              <td>
                                <Chip
                                  label={`${employeeRange}m`}
                                  size="small"
                                  color="info"
                                  variant="outlined"
                                  sx={{ fontWeight: 600, minWidth: 60 }}
                                />
                              </td>
                              <td>
                                <Chip
                                  label={`${distance.toFixed(0)}m`}
                                  size="small"
                                  color={isWithinRange ? 'success' : 'error'}
                                  variant={isWithinRange ? 'filled' : 'outlined'}
                                  sx={{ fontWeight: 600, minWidth: 60 }}
                                />
                              </td>
                              <td>
                                <Switch
                                  checked={range.activated === 1}
                                  onChange={(e) => handleActivationToggle(range.id, e.target.checked)}
                                  color="primary"
                                  size="small"
                                />
                              </td>
                              <td>
                                <IconButton 
                                  size="small" 
                                  color="primary"
                                  onClick={() => handleEditRange(range)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
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

        {/* Dialog para agregar/editar empleado */}
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
          <DialogContent sx={{ paddingTop: '54px' }}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {/* Información de configuración */}
              {!isEditing && (
                <Grid item xs={12}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <ArgonTypography variant="caption" fontWeight="bold" display="block" mb={0.5}>
                      Configuración aplicada:
                    </ArgonTypography>
                    <ArgonTypography variant="caption" display="block">
                      📍 {formData.direccion}, {formData.comuna}, {formData.region}
                    </ArgonTypography>
                    <ArgonTypography variant="caption" display="block">
                      🗺️ Coordenadas: {formData.latitude}, {formData.longitude}
                    </ArgonTypography>
                    <ArgonTypography variant="caption" display="block">
                      📏 Rango permitido: {allowedRange} metros
                    </ArgonTypography>
                    <ArgonTypography variant="caption" display="block">
                      {formData.activated ? '✅ Validación activada' : '⚠️ Validación desactivada'}
                    </ArgonTypography>
                  </Alert>
                </Grid>
              )}

              <Grid item xs={12}>
                <Autocomplete
                  multiple={!isEditing}
                  options={employees.filter(emp => 
                    !attendanceRanges.some(range => range.rut === emp.rut) || 
                    (isEditing && emp.rut === selectedRange?.rut)
                  )}
                  getOptionLabel={(option) => `${option.rut} - ${option.name || 'Sin nombre'}`}
                  value={isEditing 
                    ? employees.find(emp => emp.rut === formData.selectedEmployees[0]) || null
                    : employees.filter(emp => formData.selectedEmployees.includes(emp.rut))
                  }
                  onChange={(event, newValue) => {
                    if (isEditing) {
                      setFormData(prev => ({
                        ...prev,
                        selectedEmployees: newValue ? [newValue.rut] : []
                      }));
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        selectedEmployees: newValue.map(emp => emp.rut)
                      }));
                    }
                  }}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      {!isEditing && <Checkbox style={{ marginRight: 8 }} checked={selected} />}
                      {option.rut} - {option.name || 'Sin nombre'}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={isEditing ? "Empleado" : "Seleccionar Empleados"}
                      variant="outlined"
                      fullWidth
                      disabled={isEditing}
                      placeholder={!isEditing ? "Selecciona uno o más empleados" : ""}
                      sx={{
                        '& .MuiInputBase-root': {
                          minHeight: '44px',
                        },
                        '& .MuiAutocomplete-tag': {
                          backgroundColor: '#e3f2fd',
                          color: '#1976d2',
                          fontWeight: 500,
                        }
                      }}
                    />
                  )}
                  disableCloseOnSelect={!isEditing}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={regiones}
                  getOptionLabel={(option) => {
                    if (typeof option === 'string') return option;
                    return option?.descripcion || '';
                  }}
                  value={regiones.find(r => (typeof r === 'string' ? r : r?.descripcion) === formData.region) || formData.region || null}
                  onChange={(event, newValue) => {
                    const regionValue = typeof newValue === 'string' ? newValue : (newValue?.descripcion || '');
                    hasEditedDialog.current = true;
                    setFormData(prev => ({
                      ...prev,
                      region: regionValue
                    }));
                  }}
                  isOptionEqualToValue={(option, value) => {
                    const optionValue = typeof option === 'string' ? option : option?.descripcion;
                    const compareValue = typeof value === 'string' ? value : value?.descripcion;
                    return optionValue === compareValue;
                  }}
                  freeSolo
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Región"
                      variant="outlined"
                      fullWidth
                      placeholder="Selecciona o escribe una región"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={comunas}
                  getOptionLabel={(option) => {
                    if (typeof option === 'string') return option;
                    return option?.descripcion || '';
                  }}
                  value={comunas.find(c => (typeof c === 'string' ? c : c?.descripcion) === formData.comuna) || formData.comuna || null}
                  onChange={(event, newValue) => {
                    const comunaValue = typeof newValue === 'string' ? newValue : (newValue?.descripcion || '');
                    hasEditedDialog.current = true;
                    setFormData(prev => ({
                      ...prev,
                      comuna: comunaValue
                    }));
                  }}
                  isOptionEqualToValue={(option, value) => {
                    const optionValue = typeof option === 'string' ? option : option?.descripcion;
                    const compareValue = typeof value === 'string' ? value : value?.descripcion;
                    return optionValue === compareValue;
                  }}
                  freeSolo
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Comuna"
                      variant="outlined"
                      fullWidth
                      placeholder="Selecciona o escribe una comuna"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ position: 'relative'}} >
                  <TextField
                    fullWidth
                    label="Dirección"
                    variant="outlined"
                    placeholder="Ej: Los Robles 35"
                    value={formData.direccion || ''}
                    onChange={handleDialogAddressChange}
                    sx={{
                      '& .MuiInputBase-input': {
                        width: '100% !important',
                        paddingRight: '50px',
                        overflow: 'auto',
                        textOverflow: 'clip',
                      }
                    }}
                    onBlur={() => {
                      setIsDialogInputFocused(false);
                      setTimeout(() => setDialogAddressSuggestions([]), 200);
                    }}
                    onFocus={(e) => {
                      setIsDialogInputFocused(true);
                      if (e.target.value && e.target.value.length >= 2 && formData.region && formData.comuna) {
                        fetchAddressSuggestions(e.target.value, formData.region, formData.comuna, true);
                      }
                    }}
                    inputRef={dialogAddressInputRef}
                    autoComplete="off"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" >
                          <LocationOnIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: loadingDialogSuggestions ? (
                        <InputAdornment position="end">
                          <CircularProgress size={20} />
                        </InputAdornment>
                      ) : null,
                    }}
                    helperText={
                      !formData.region || !formData.comuna
                        ? "Selecciona región y comuna primero"
                        : "Escribe y verás sugerencias automáticamente"
                    }
                  />
                {isDialogInputFocused && dialogAddressSuggestions.length > 0 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      zIndex: 1300,
                      width: dialogAddressInputRef.current?.parentElement?.offsetWidth || '100%',
                      maxHeight: 300,
                      overflowY: 'auto',
                      bgcolor: '#ffffff',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                      borderRadius: '12px',
                      mt: -2,
                      border: '2px solid',
                      borderColor: '#e3f2fd',
                      '&::-webkit-scrollbar': {
                        width: '0px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#bdbdbd',
                        borderRadius: '4px',
                      },
                    }}
                  >
                    {dialogAddressSuggestions.map((suggestion, index) => (
                      <Box
                        key={index}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleDialogAddressSelect(suggestion);
                        }}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          p: 1.75,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          borderRadius: index === 0 ? '10px 10px 0 0' : index === dialogAddressSuggestions.length - 1 ? '0 0 10px 10px' : '0',
                          '&:hover': {
                            bgcolor: '#e3f2fd',
                            transform: 'translateX(4px)',
                            boxShadow: 'inset 4px 0 0 #2196f3',
                          },
                          borderBottom: index < dialogAddressSuggestions.length - 1 ? '1px solid #f5f5f5' : 'none',
                        }}
                      >
                        <LocationOnIcon 
                          fontSize="small" 
                          sx={{ 
                            mr: 1.5, 
                            flexShrink: 0,
                            color: '#2196f3',
                          }} 
                        />
                        <ArgonTypography 
                          variant="body2" 
                          sx={{ 
                            whiteSpace: 'normal',
                            color: '#424242',
                            fontWeight: 500,
                          }}
                        >
                          {suggestion}
                        </ArgonTypography>
                      </Box>
                    ))}
                  </Box>
                )}
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Latitud"
                  type="text"
                  inputProps={{ readOnly: true }}
                  disabled
                  value={formData.latitude}
                  variant="outlined"
                  helperText="Se calcula automáticamente según Dirección / Comuna / Región"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Longitud"
                  type="text"
                  inputProps={{ readOnly: true }}
                  disabled
                  value={formData.longitude}
                  variant="outlined"
                />
              </Grid>

              {/* Mostrar rango de lat/lon permitido (bounding box) según allowedRange */}
              <Grid item xs={12}>
                {workplaceLocation.latitude && workplaceLocation.longitude && (
                  (() => {
                    const R = 6378137; // radio de la tierra en metros (WGS84)
                    const lat = parseFloat(workplaceLocation.latitude);
                    const lon = parseFloat(workplaceLocation.longitude);
                    const d = allowedRange; // metros
                    const deltaLat = (d / R) * (180 / Math.PI);
                    const deltaLon = (d / (R * Math.cos(lat * Math.PI / 180))) * (180 / Math.PI);
                    const minLat = (lat - deltaLat).toFixed(6);
                    const maxLat = (lat + deltaLat).toFixed(6);
                    const minLon = (lon - deltaLon).toFixed(6);
                    const maxLon = (lon + deltaLon).toFixed(6);

                    return (
                      <ArgonBox p={2} bgcolor="grey.100" borderRadius={1}>
                        <ArgonTypography variant="caption" display="block" gutterBottom>
                          Lat/Lon permitido según rango ({allowedRange}m):
                        </ArgonTypography>
                        <ArgonTypography variant="caption" color="text.secondary">
                          Desde Lat: {minLat} — Hasta Lat: {maxLat}
                        </ArgonTypography>
                        <ArgonTypography variant="caption" color="text.secondary" display="block">
                          Desde Lon: {minLon} — Hasta Lon: {maxLon}
                        </ArgonTypography>
                      </ArgonBox>
                    );
                  })()
                )}
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.activated}
                      onChange={handleFormChange('activated')}
                      color="primary"
                    />
                  }
                  label="Activar validación de ubicación para este empleado"
                />
              </Grid>

              {formData.latitude && formData.longitude && (
                <Grid item xs={12}>
                  <ArgonBox p={2} bgcolor="grey.100" borderRadius={1}>
                    <ArgonTypography variant="body2" gutterBottom>
                      Distancia al lugar de trabajo: {
                        calculateDistance(
                          formData.latitude,
                          formData.longitude,
                          workplaceLocation.latitude,
                          workplaceLocation.longitude
                        ).toFixed(0)
                      } metros
                    </ArgonTypography>
                    <ArgonTypography variant="caption" color="text.secondary">
                      Rango permitido actual: {allowedRange} metros
                    </ArgonTypography>
                  </ArgonBox>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <ArgonButton onClick={() => setOpenDialog(false)} color="secondary">
              Cancelar
            </ArgonButton>
            <ArgonButton 
              onClick={handleSaveRange} 
              variant="gradient" 
              color="success"
              disabled={formData.selectedEmployees.length === 0}
            >
              {isEditing ? 'Actualizar' : `Agregar ${formData.selectedEmployees.length > 0 ? `(${formData.selectedEmployees.length})` : ''}`}
            </ArgonButton>
          </DialogActions>
        </Dialog>
      </ArgonBox>
      <Footer />
    </DashboardLayout>
  );
}

export default RTL;
 