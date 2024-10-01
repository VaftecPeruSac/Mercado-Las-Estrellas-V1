import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Principal from "../Layout/Principal";
import Tabla from "../components/Asociados/Tabla";
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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
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
        element: <Dashboard />,
      },
      {
        path: "socios",
        element: <Tabla />,
      },
      {
        path: "puestos",
        element: <TablaPuestos />,
      },
      {
        path: "servicios",
        element: <TablaServicios />,
      },
      {
        path: "cuotas",
        element: <TablaCuota />,
      },
      {
        path: "pagos",
        element: <TablaPagos />,
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
        element: <TablaReporteCuotasMetrado />,
      },
      {
        path: "reporte-cuotas-puesto",
        element: <TablaCuotasPuesto />,
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