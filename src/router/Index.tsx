import { createBrowserRouter } from "react-router-dom";
import Principal from "../Layout/Principal";
import Home from "../pages/Home";
import Tabla from "../components/Asociados/Tabla";
import Dashboard from "../components/Dashboard";
import { TablaInquilinos } from "../components/Inquilinos/TablaInquilinos";
import { TablaContratos } from "../components/Contratos/TablaContratos";
import { TablaServicios } from "../components/servicios/TablaServicios";
import { TablaAperturarDeuda } from "../components/aperturarDeuda/TablaAperturarDeuda";
import { TablaVerDeuda } from "../components/verDeuda/TablaVerDeuda";
import { TablaEmpleados } from "../components/Empleados/TablaEmpleados";

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
        path: "/inquilinos",
        element: <TablaInquilinos />,
      },
      {
        path: "/contratos",
        element: <TablaContratos />,
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
        path: "/ver-deuda",
        element: <TablaVerDeuda />,
      },
      {
        path: "/empleados",
        element: <TablaEmpleados />,
      },

    ],
  },
]);
