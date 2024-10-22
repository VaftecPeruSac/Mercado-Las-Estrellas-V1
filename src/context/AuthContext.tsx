import axios from "axios";
import Cookies from "js-cookie";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { manejarError, mostrarAlerta } from "../components/Alerts/Registrar";
import { AuthContextType } from "../interface/AuthContext/AuthContext";

// Creamos el contexto de autenticación
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Creamos el proveedor de autenticación para envolver la aplicación
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [autenticado, setAutenticado] = useState<boolean>(() => JSON.parse(localStorage.getItem("autenticado") || "false"));
  const [usuario, setUsuario] = useState<string | null>(() => localStorage.getItem("usuario"));
  const [rol, setRol] = useState<string | null>(() => localStorage.getItem("rol"));

  const login = (nombreUsuario: string, rolUsuario: string) => {
    setAutenticado(true);
    setUsuario(nombreUsuario);
    setRol(rolUsuario);
    localStorage.setItem("autenticado", JSON.stringify(true));
    localStorage.setItem("usuario", nombreUsuario);
    localStorage.setItem("rol", rolUsuario);
  };

  const logout = async () => {
    try {
      const token = Cookies.get("token");
      if (token && usuario) {
        const response = await axios.post("https://mercadolasestrellas.online/intranet/public/v1/logout",{ usuario },
          {headers: {Authorization: `Bearer ${token}`,"Content-Type": "application/json",},}
        );
        if (response.status === 200) {
          const mensaje = response.data.message;
          limpiarSesion();
          mostrarAlerta("Cierre de sesión", mensaje, "info");
        }
      } else {
        mostrarAlerta("error");
      }
    } catch (error) {
      manejarError(error);
    }
  };

  const limpiarSesion = () => {
    Cookies.remove("token", { path: "/" });
    setAutenticado(false);
    setUsuario(null);
    setRol(null);
    localStorage.removeItem("autenticado");
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
  };

  useEffect(() => {
    const manejarAutenticacion = () => {
      const guardarAutenticado = JSON.parse(localStorage.getItem("autenticado") || "false");
      const guardarUsuario = localStorage.getItem("usuario");
      const guardarRol = localStorage.getItem("rol");

      if (guardarAutenticado === null) {
        setAutenticado(guardarAutenticado);
        setUsuario(guardarUsuario);
        setRol(guardarRol);
      }
    };

    window.addEventListener("storage", manejarAutenticacion);
    return () => {
      window.removeEventListener("storage", manejarAutenticacion);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ autenticado, usuario, rol, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para consumir el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "Error: Debe iniciar sesión para navegar en la aplicación."
    );
  }
  return context;
};
