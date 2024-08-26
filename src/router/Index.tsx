import { createBrowserRouter } from "react-router-dom";
import Principal from "../Layout/Principal";
import Home from "../pages/Home";
import Tabla from "../components/Asociados/Tabla";
import Dashboard from "../components/Dashboard";
import { TablaInquilinos } from "../components/Inquilinos/TablaInquilinos";
import { TablaContratos } from "../components/Contratos/TablaContratos";
import { TablaEmpleados } from "../components/Empleados/TablaEmpleados";
import TablaServicios from "../components/servicios/TablaServicios";
import TablaPagos from "../components/Pagos/TablaPagos";
import TablaAperturarDeuda from "../components/AperturarDeuda/TablaCuota";

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
        path: "/asociados",
        element: <Tabla />,
      },
      {
        path: "/servicios",
        element: <TablaServicios />,
      },
      {
        path: "/aperturar-deuda",
        element: <TablaAperturarDeuda />,
      },
      {
        path: "/pagos",
        element: <TablaPagos />,
      },

    ],
  },
]);
