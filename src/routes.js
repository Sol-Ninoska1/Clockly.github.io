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

/** 
  All of the routes for the Soft UI Dashboard React are added here,
  You can add a new route, customize the routes and delete the routes here.
  Once you add a new route on this file it will be visible automatically on
  the Sidenav.
  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Clockly Dashboard layouts
import Dashboard from "layouts/inicio";
import Tables from "layouts/empleados";
import Billing from "layouts/configuracion";
import VirtualReality from "layouts/empresa";
import RTL from "layouts/rango-asistencia";
import Profile from "layouts/administrador";
import AttendanceHistory from "layouts/attendance-history";
import SignIn from "layouts/authentication/sign-in";

// Clockly Dashboard components
import ArgonBox from "components/ArgonBox";

const routes = [
  {
    type: "route",
    name: "Inicio",
    key: "inicio",
    route: "/inicio",
    icon: <ArgonBox component="i" color="primary" fontSize="14px" className="ni ni-tv-2" />,
    component: <Dashboard />,
  },
  {
    type: "route",
    name: "Empleados",
    key: "empleados",
    route: "/empleados",
    icon: (
      <ArgonBox component="i" color="warning" fontSize="14px" className="ni ni-circle-08" />
    ),
    component: <Tables />,
  },
  {
    type: "route",
    name: "Configuración",
    key: "configuracion",
    route: "/configuracion",
    icon: <ArgonBox component="i" color="success" fontSize="14px" className="ni ni-chart-bar-32" />,
    component: <Billing />,
  },
  {
    type: "route",
    name: "Empresa",
    key: "empresa",
    route: "/empresa",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-app" />,
    component: <VirtualReality />,
  },
  {
    type: "route",
    name: "Rango Asistencia",
    key: "rango-asistencia",
    route: "/rango-asistencia",
    icon: <ArgonBox component="i" color="error" fontSize="14px" className="ni ni-world-2" />,
    component: <RTL />,
  },
  {
    type: "route",
    name: "Historial Asistencia",
    key: "attendance-history",
    route: "/attendance-history",
    icon: <ArgonBox component="i" color="secondary" fontSize="14px" className="ni ni-time-alarm" />,
    component: <AttendanceHistory />,
  },
  { type: "title", title: "Cuenta", key: "account-pages" },
  {
    type: "route",
    name: "Administrador",
    key: "administrador",
    route: "/administrador",
    icon: <ArgonBox component="i" color="dark" fontSize="14px" className="ni ni-single-02" />,
    component: <Profile />,
  },
];

export default routes;
