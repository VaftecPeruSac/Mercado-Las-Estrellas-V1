import { createBrowserRouter } from "react-router-dom";
import Principal from "../Layout/Principal";
import Home from "../pages/Home";
import Tabla from "../components/Asociados/Tabla";
import Dashboard from "../components/Dashboard";

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
    ],
  },
]);
