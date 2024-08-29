import { createBrowserRouter } from "react-router-dom";
import Principal from "../Layout/Principal";
import Tabla from "../components/Asociados/Tabla";
import Dashboard from "../components/Dashboard";
import TablaServicios from "../components/servicios/TablaServicios";
import TablaPagos from "../components/Pagos/TablaPagos";
import TablaCuota from "../components/AperturarDeuda/TablaCuota";
import TablaPuestos from "../components/Puestos/TablaPuestos";
import TablaReportePagos from "../components/ReportePagos/TablaReportePagos";
import TablaReporteDeudas from "../components/ReporteDeudas/TablaReporteDeudas";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Principal />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "/socios",
        element: <Tabla />,
      },
      {
        path: "/puestos",
        element: <TablaPuestos />,
      },
      {
        path: "/servicios",
        element: <TablaServicios />,
      },
      {
        path: "/cuotas",
        element: <TablaCuota />,
      },
      {
        path: "/pagos",
        element: <TablaPagos />,
      },
      {
        path: "/reporte-pagos",
        element: <TablaReportePagos />,
      },
      {
        path: "/reporte-deudas",
        element: <TablaReporteDeudas />,
      },
    ],
  },
]);
