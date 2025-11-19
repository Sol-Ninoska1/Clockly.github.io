# Clockly Dashboard - Sistema de Gestión de Asistencia

![version](https://img.shields.io/badge/version-1.0.0-blue.svg) ![status](https://img.shields.io/badge/status-active-green.svg)

## Descripción

Clockly Dashboard es un sistema moderno de gestión de asistencia para empresas. Desarrollado con React y Material-UI, ofrece una interfaz intuitiva para el control y monitoreo de la asistencia de empleados con tecnología moderna y confiable.

## Características Principales

- ✅ **Gestión de Empleados** - CRUD completo para administrar empleados
- ✅ **Control de Asistencia** - Monitoreo en tiempo real de la asistencia
- ✅ **Configuración de Rangos** - Definir zonas geográficas permitidas
- ✅ **Historial Detallado** - Reportes y análisis de asistencia
- ✅ **Información Empresarial** - Gestión de datos de la empresa
- ✅ **Panel de Administración** - Control total del sistema
- ✅ **Autenticación Segura** - Sistema de login protegido
- ✅ **Geocodificación** - Integración con Google Maps para ubicaciones
- ✅ **Responsive Design** - Funciona en todos los dispositivos

## Módulos del Sistema

### 🏠 **Inicio**
Dashboard principal con estadísticas y métricas clave de asistencia.

### 👥 **Empleados**
Gestión completa de empleados con funciones de crear, editar, eliminar y buscar.

### ⚙️ **Configuración**
Configuración del sistema, horarios de trabajo y parámetros generales.

### 🏢 **Empresa**
Información de la empresa y configuración de planes de servicio.

### 📍 **Rango Asistencia**
Configuración de zonas geográficas permitidas para el registro de asistencia.

### 📊 **Historial Asistencia**
Reportes detallados, exportación de datos y análisis de asistencia.

### 👤 **Administrador**
Gestión del perfil del administrador y configuración de cuenta.

## Tecnologías Utilizadas

- **Frontend:** React 18, Material-UI, JavaScript ES6+
- **Backend API:** C# .NET, Entity Framework
- **Base de Datos:** SQL Server
- **Mapas:** Google Maps API, OpenStreetMap Nominatim
- **Autenticación:** JWT Tokens, Local Storage
- **Exportación:** CSV
- **Geocodificación:** Google Geocoding API

## Instalación

1. Clonar el repositorio:
```bash
git clone [repository-url]
cd clockly-dashboard
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
# Crear archivo .env con:
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
```

4. Iniciar el proyecto:
```bash
npm start
```

## Configuración de APIs

### Google Maps API
- Obtener API key de Google Cloud Console
- Habilitar Geocoding API y Maps JavaScript API
- Configurar en el archivo de servicios

### Backend API
- Configurar endpoints en `src/services/ApiService.js`
- Verificar conexión con la base de datos
- Configurar CORS para permitir peticiones desde React

## Estructura del Proyecto

```
src/
├── layouts/
│   ├── inicio/                 # Dashboard principal
│   ├── empleados/             # Gestión de empleados
│   ├── configuracion/         # Configuración del sistema
│   ├── empresa/               # Información empresarial
│   ├── rango-asistencia/      # Configuración de rangos
│   ├── attendance-history/    # Historial de asistencia
│   ├── administrador/         # Perfil del admin
│   └── authentication/        # Login/autenticación
├── components/                # Componentes reutilizables
├── context/                   # Context API (Auth)
├── services/                  # Servicios API
├── assets/                    # Recursos estáticos
└── examples/                  # Componentes de UI
```

## Scripts Disponibles

- `npm start` - Ejecutar en modo desarrollo
- `npm test` - Ejecutar tests
- `npm run build` - Crear build de producción
- `npm run eject` - Eyectar configuración (no recomendado)

## Funcionalidades Avanzadas

### Geocodificación
- Conversión automática de direcciones a coordenadas
- Validación de ubicaciones para asistencia
- Cálculo de distancias con fórmula Haversine

### Sistema de Autenticación
- Login seguro con validación
- Protección de rutas privadas
- Gestión de sesiones con localStorage
- Logout automático por seguridad

### Exportación de Datos
- Generación de reportes CSV
- Filtrado avanzado por fechas y empleados
- Cálculos automáticos de horas trabajadas

## Contribución

1. Fork del proyecto
2. Crear rama para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## Licencia

Este proyecto es propietario de Clockly - Todos los derechos reservados.

## Soporte

Para soporte técnico o consultas, contactar al equipo de desarrollo de Clockly.

---

**Clockly Dashboard v1.0.0** - Sistema de Gestión de Asistencia Empresarial

![version](https://img.shields.io/badge/version-3.0.1-blue.svg) [![GitHub issues open](https://img.shields.io/github/issues/creativetimofficial/argon-dashboard-material-ui.svg)](https://github.com/creativetimofficial/argon-dashboard-material-ui/issues?q=is%3Aopen+is%3Aissue) [![GitHub issues closed](https://img.shields.io/github/issues-closed-raw/creativetimofficial/argon-dashboard-material-ui.svg)](https://github.com/creativetimofficial/argon-dashboard-material-ui/issues?q=is%3Aissue+is%3Aclosed)

![Image](https://s3.amazonaws.com/creativetim_bucket/products/447/original/argon-dashboard-material-ui.jpg)

Start your Development with an Innovative Admin Template for MUI and React. If you like the look & feel of the hottest design trend right now, Argon, you will fall in love with this dashboard! It features a huge number of components built to fit together and look amazing.

**Fully Coded Elements**

Argon Dashboard 2 MUI is built with over 70 frontend individual elements, like buttons, inputs, navbars, nav tabs, cards, or alerts, giving you the freedom of choosing and combining. All components can take variations in color, which you can easily modify using MUI styled api and sx prop. You will save a lot of time going from prototyping to full-functional code because all elements are implemented. This Free MUI Dashboard is coming with prebuilt design blocks, so the development process is seamless, switching from our pages to the real website is very easy to be done.

View [all components here](https://www.creative-tim.com/learning-lab/material-ui/alerts/argon-dashboard/).

**Documentation built by Developers**

Each element is well presented in very complex documentation.

You can read more about the [documentation here](https://www.creative-tim.com/learning-lab/material-ui/overview/argon-dashboard/).

**Example Pages**

If you want to get inspiration or just show something directly to your clients, you can jump-start your development with our pre-built example pages. Every page is spaced well, with attractive layouts and pleasing shapes. Argon Dashboard 2 MUI has everything you need to quickly set up an amazing project.

View [example pages here](https://demos.creative-tim.com/argon-dashboard-material-ui/).

**HELPFUL LINKS**

- View [Github Repository](https://github.com/creativetimofficial/argon-dashboard-material-ui)
- Check [FAQ Page](https://www.creative-tim.com/faq)

#### Special thanks

During the development of this dashboard, we have used many existing resources from awesome developers. We want to thank them for providing their tools open source:

- [MUI](https://mui.com/) - The React UI library for faster and easier web development.
- [React Countup](https://github.com/glennreyes/react-countup) - A lightweight React component that can be used to quickly create animations that display numerical data in a more interesting way.
- [React ChartJS 2](http://reactchartjs.github.io/react-chartjs-2/#/) - Simple yet flexible React charting for designers & developers.
- [ChromaJS](https://gka.github.io/chroma.js/) - A small-ish zero-dependency JavaScript library for all kinds of color conversions and color scales.
- [UUID](https://github.com/uuidjs/uuid) - JavaScript library for generating random id numbers.

Let us know your thoughts below. And good luck with development!

## Table of Contents

- [Versions](#versions)
- [Demo](#demo)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [File Structure](#file-structure)
- [Browser Support](#browser-support)
- [Resources](#resources)
- [Reporting Issues](#reporting-issues)
- [Technical Support or Questions](#technical-support-or-questions)
- [Licensing](#licensing)
- [Useful Links](#useful-links)

## Versions

[<img src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/logos/react-logo.jpg?raw=true" width="60" height="60" />](https://www.creative-tim.com/product/argon-dashboard-material-ui?ref=readme-admui)

| React |
| ----- |

| [![Argon Dashboard 2 MUI](https://s3.amazonaws.com/creativetim_bucket/products/447/thumb/argon-dashboard-material-ui.jpg)](http://demos.creative-tim.com/argon-dashboard-material-ui/?ref=readme-admui)

## Demo

- [Dashboard](http://demos.creative-tim.com/argon-dashboard-material-ui/#/dashboard?ref=readme-admui)
- [Profile](https://demos.creative-tim.com/argon-dashboard-material-ui/#/profile?ref=readme-admui)
- [RTL](https://demos.creative-tim.com/argon-dashboard-material-ui/#/rtl?ref=readme-admui)
- [Sign In](https://demos.creative-tim.com/argon-dashboard-material-ui/#/authentication/sign-in?ref=readme-admui)
- [Sign Up](https://demos.creative-tim.com/argon-dashboard-material-ui/#/authentication/sign-up?ref=readme-admui)

[View More](https://demos.creative-tim.com/argon-dashboard-material-ui/#/dashboard?ref=readme-admui).

## Quick start

Quick start options:

- Buy from [Creative Tim](https://www.creative-tim.com/product/argon-dashboard-material-ui?ref=readme-admui).

## Terminal Commands

1. Download and Install NodeJs LTS version from [NodeJs Official Page](https://nodejs.org/en/download/).
2. Navigate to the root ./ directory of the product and run `yarn install` or `npm install` to install our local dependencies.

## Documentation

The documentation for the Argon Dashboard 2 MUI is hosted at our [website](https://www.creative-tim.com/learning-lab/material-ui/overview/argon-dashboard/?ref=readme-admui).

### What's included

Within the download you'll find the following directories and files:

```
argon-dashboard-material-ui
    ├── public
    │   ├── apple-icon.png
    │   ├── favicon.png
    │   ├── index.html
    │   ├── manifest.json
    │   └── robots.txt
    ├── src
    │   ├── assets
    │   │   ├── css
    │   │   ├── fonts
    │   │   ├── images
    │   │   ├── theme
    │   │   │   ├── base
    │   │   │   ├── components
    │   │   │   ├── functions
    │   │   │   ├── index.js
    │   │   │   └── theme-rtl.js
    │   │   └── theme-dark
    │   │       ├── base
    │   │       ├── components
    │   │       ├── functions
    │   │       ├── index.js
    │   │       └── theme-rtl.js
    │   ├── components
    │   │   ├── ArgonAlert
    │   │   ├── ArgonAvatar
    │   │   ├── ArgonBadge
    │   │   ├── ArgonBox
    │   │   ├── ArgonButton
    │   │   ├── ArgonInput
    │   │   ├── ArgonPagination
    │   │   ├── ArgonProgress
    │   │   └── ArgonTypography
    │   ├── context
    │   ├── examples
    │   │   ├── Breadcrumbs
    │   │   ├── Calendar
    │   │   ├── Cards
    │   │   ├── Charts
    │   │   ├── Configurator
    │   │   ├── Footer
    │   │   ├── Items
    │   │   ├── LayoutContainers
    │   │   ├── Lists
    │   │   ├── Navbars
    │   │   ├── Sidenav
    │   │   ├── Tables
    │   │   └── Timeline
    │   ├── layouts
    │   │   ├── authentication
    │   │   ├── billing
    │   │   ├── dashboard
    │   │   ├── profile
    │   │   ├── rtl
    │   │   ├── tables
    │   │   └── virtual-reality
    │   ├── App.js
    │   ├── index.js
    │   └── routes.js
    ├── .evn
    ├── .eslintrc.json
    ├── .gitignore
    ├── .prettierrc.json
    ├── CHANGELOG.md
    ├── ISSUE_TEMPLATE.md
    ├── jsconfig.json
    ├── package.json
    └── README.md
```

## Browser Support

At present, we officially aim to support the last two versions of the following browsers:

<img src="https://s3.amazonaws.com/creativetim_bucket/github/browser/chrome.png" width="64" height="64"> <img src="https://s3.amazonaws.com/creativetim_bucket/github/browser/firefox.png" width="64" height="64"> <img src="https://s3.amazonaws.com/creativetim_bucket/github/browser/edge.png" width="64" height="64"> <img src="https://s3.amazonaws.com/creativetim_bucket/github/browser/safari.png" width="64" height="64"> <img src="https://s3.amazonaws.com/creativetim_bucket/github/browser/opera.png" width="64" height="64">

## Resources

- [Live Preview](https://demos.creative-tim.com/argon-dashboard-material-ui/#/dashboard?ref=readme-admui)
- [Download Page](https://www.creative-tim.com/product/argon-dashboard-material-ui?ref=readme-admui)
- Documentation is [here](https://www.creative-tim.com/learning-lab/material-ui/overview/argon-dashboard/?ref=readme-admui)
- [License Agreement](https://www.creative-tim.com/license?ref=readme-admui)
- [Support](https://www.creative-tim.com/contact-us?ref=readme-admui)
- Issues: [Github Issues Page](https://github.com/creativetimofficial/argon-dashboard-material-ui/issues)

## Reporting Issues

We use GitHub Issues as the official bug tracker for the Argon Dashboard 2 MUI. Here are some advices for our users that want to report an issue:

1. Make sure that you are using the latest version of the Argon Dashboard 2 MUI. Check the CHANGELOG from your dashboard on our [website](https://www.creative-tim.com/product/argon-dashboard-material-ui?ref=readme-admui).
2. Providing us reproducible steps for the issue will shorten the time it takes for it to be fixed.
3. Some issues may be browser specific, so specifying in what browser you encountered the issue might help.

## Technical Support or Questions

If you have questions or need help integrating the product please [contact us](https://www.creative-tim.com/contact-us?ref=readme-admui) instead of opening an issue.

## Licensing

- Copyright 2023 [Creative Tim](https://www.creative-tim.com?ref=readme-admui)
- Creative Tim [license](https://www.creative-tim.com/license?ref=readme-admui)

## Configuración de Geocodificación

El dashboard incluye funcionalidad de geocodificación automática para convertir direcciones en coordenadas geográficas:

### Configuración Rápida (OpenStreetMap - Gratis)
Por defecto, el sistema usa OpenStreetMap Nominatim que es gratuito y no requiere API key.

### Configuración Avanzada (Google Maps)
Para mayor precisión, puedes usar Google Maps:

#### Paso 1: Obtener API Key
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto o selecciona uno existente
3. Habilita estas APIs:
   - **Maps JavaScript API**
   - **Geocoding API** ← Esta es la importante para direcciones
4. Ve a **APIs y servicios** > **Credenciales**
5. Haz clic en **+ CREAR CREDENCIALES** > **Clave de API**

#### Paso 2: Configurar restricciones (Seguridad)
1. Edita tu API key recién creada
2. **Restricciones de aplicación**: Referentes HTTP
   - Agrega: `localhost:3000/*` (desarrollo)
   - Agrega tu dominio de producción
3. **Restricciones de API**: Marca solo
   - Geocoding API
   - Maps JavaScript API

#### Paso 3: Configurar en el proyecto
1. Copia `.env.example` a `.env`
2. Agrega tu API key:
```bash
REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyBDoQqKlfUB0IntET0jIEhIJvW1UQ7JbI0
```

### Uso
1. Ve a la sección "Rango Asistencia"
2. Ingresa la dirección completa (ej: "Los Robles 356, Las Condes, Santiago")
3. Haz clic en "Buscar" para calcular automáticamente las coordenadas
4. Define el rango permitido en metros

### Facturación Google Maps
- Las primeras 40,000 solicitudes/mes son **GRATIS**
- Después: $0.005 USD por solicitud
- Para uso empresarial típico, rara vez excedes el límite gratuito

## Useful Links

- [More products](https://www.creative-tim.com/templates?ref=readme-admui) from Creative Tim

- [Tutorials](https://www.youtube.com/channel/UCVyTG4sCw-rOvB9oHkzZD1w)

- [Freebies](https://www.creative-tim.com/bootstrap-themes/free?ref=readme-admui) from Creative Tim

- [Affiliate Program](https://www.creative-tim.com/affiliates/new?ref=readme-admui) (earn money)

##### Social Media

Twitter: <https://twitter.com/CreativeTim>

Facebook: <https://www.facebook.com/CreativeTim>

Dribbble: <https://dribbble.com/creativetim>

Google+: <https://plus.google.com/+CreativetimPage>

Instagram: <https://instagram.com/creativetimofficial>
