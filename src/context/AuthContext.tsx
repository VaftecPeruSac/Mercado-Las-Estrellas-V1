import axios from "axios";
import Cookies from "js-cookie";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { manejarError, mostrarAlerta } from "../components/Alerts/Registrar";
import { AuthContextType } from "../interface/AuthContext/AuthContext";
import { Usuario } from "../interface/AuthContext/Usuario";

// Creamos el contexto de autenticación
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Creamos el proveedor de autenticación para envolver la aplicación
export const AuthProvider = ({ children }: { children: ReactNode }) => {

  const [autenticado, setAutenticado] = useState<boolean>(() => JSON.parse(localStorage.getItem("autenticado") || "false"));
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const login = (user: Usuario) => {
    setUsuario(user);
    setAutenticado(true);
    localStorage.setItem("usuario", JSON.stringify(usuario));
    localStorage.setItem("autenticado", JSON.stringify(true));
  };

  const logout = useCallback(async () => {
    try {
      const token = Cookies.get("token");
      const nombreUsu = usuario?.nombre_usuario;
      if (token && usuario) {
        const response = await axios.post("https://mercadolasestrellas.online/intranet/public/v1/logout",
          { usuario: nombreUsu },
          {headers: {Authorization: `Bearer ${token}`,"Content-Type": "application/json",},}
        );
        if (response.status === 200) {
          limpiarSesion();
          mostrarAlerta("Cierre de sesión", response.data.message, "info");
        }
      } else {
        mostrarAlerta("error");
      }
    } catch (error) {
      manejarError(error);
    }
  }, [usuario]);

  const getDataSesion = useCallback(async () => {
    try {
      const token = Cookies.get("token");
      if (token) {
        const response = await axios.get(`https://mercadolasestrellas.online/intranet/public/v1/validaciones?token=${token}`);
        if (response.status === 200) {
          const user = response.data;
          setUsuario(user);
          setAutenticado(true);
          localStorage.setItem("usuario", JSON.stringify(user));
          localStorage.setItem("autenticado", JSON.stringify(true));
        } else {
          mostrarAlerta("Error");
        }
      }
    } catch (error) {
      manejarError(error);
    }
  }, []);

  const limpiarSesion = () => {
    Cookies.remove("token", { path: "/" });
    setUsuario(null);
    setAutenticado(false);
    localStorage.removeItem("usuario");
    localStorage.removeItem("autenticado");
  };

  useEffect(() => {
    const cargarSesion = async () => {
      const usuarioGuardado = localStorage.getItem("usuario");
      const autenticacion = JSON.parse(localStorage.getItem("autenticado") || "false");

      if (usuarioGuardado && autenticacion) {
        setUsuario(JSON.parse(usuarioGuardado));
        setAutenticado(true);
      } else {
        await getDataSesion(); // Intentamos cargar la sesión
      }
    };

    cargarSesion();
  }, [getDataSesion]);

  return (
    <AuthContext.Provider value={{ autenticado, usuario, login, logout, getDataSesion }}>
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
