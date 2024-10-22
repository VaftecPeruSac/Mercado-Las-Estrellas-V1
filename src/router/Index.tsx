import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Principal from "../Layout/Principal";
import Tabla from "../components/Asociados/TablaSocios";
import Dashboard from "../components/Dashboard";
import TablaServicios from "../components/Servicios/TablaServicios";
import TablaPagos from "../components/Pagos/TablaPagos";
import TablaCuota from "../components/Cuotas/TablaCuota";
import TablaPuestos from "../components/Puestos/TablaPuestos";
import TablaReportePagos from "../components/ReportePagos/TablaReportePagos";
import TablaReporteDeudas from "../components/ReporteDeudas/TablaReporteDeudas";
import Login from "../components/Login/Login";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import TablaReporteCuotasMetrado from "../components/ReporteCuotasMetrado/TablaCuotasMetrado";
import TablaCuotasPuesto from "../components/ReporteCuotasPuesto/TablaCuotasPuesto";
import BusquedaRapida from "../components/BusquedaRapida";
import TablaReporteResumen from "../components/ReporteResumen/TablaReporteResumen";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/busqueda-rapida",
    element: <BusquedaRapida />
  },
  {
    path: "/home",
    element: (
      // Usamos el componente de ruta protegida
      <ProtectedRoute>
        <Principal />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute requiredRol="3">
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "socios",
        element: (
          <ProtectedRoute requiredRol="3">
            <Tabla />
          </ProtectedRoute>
        ),
      },
      {
        path: "puestos",
        element: (
          <ProtectedRoute requiredRol="3">
            <TablaPuestos />,
          </ProtectedRoute>
        ),
      },
      {
        path: "servicios",
        element: (
          <ProtectedRoute requiredRol="3">
            <TablaServicios />
          </ProtectedRoute>
        ),
      },
      {
        path: "cuotas",
        element: (
          <ProtectedRoute requiredRol="3">
            <TablaCuota />
          </ProtectedRoute>
        ),
      },
      {
        path: "pagos",
        element: (
          <ProtectedRoute requiredRol="3">
            <TablaPagos />
          </ProtectedRoute>  
        ),
      },
      {
        path: "reporte-pagos",
        element: <TablaReportePagos />,
      },
      {
        path: "reporte-deudas",
        element: <TablaReporteDeudas />,
      },
      {
        path: "reporte-cuotas-metrado",
        element: (
          <ProtectedRoute requiredRol="3">
            <TablaReporteCuotasMetrado />
          </ProtectedRoute>
        ),
      },
      {
        path: "reporte-cuotas-puesto",
        element: (
          <ProtectedRoute requiredRol="3">
            <TablaCuotasPuesto />
          </ProtectedRoute>
        ),
      },
      {
        path: "reporte-resumen",
        element: (
          <ProtectedRoute requiredRol="3">
            <TablaReporteResumen />
          </ProtectedRoute>
        ),
      }
    ],
  },
]);

const App = () => {
  // Envolver la aplicación con el proveedor de autenticación
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
}

export default App;