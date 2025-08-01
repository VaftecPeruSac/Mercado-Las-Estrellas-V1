import Cookies from "js-cookie";
import {
  createContext, ReactNode, useCallback, useContext, useEffect,useState,
} from "react";
import { manejarError, mostrarAlerta } from "../components/Alerts/Registrar";
import { AuthContextType } from "../interface/AuthContext/AuthContext";
import { Usuario } from "../interface/AuthContext/Usuario";
import apiClient from "../Utils/apliClient";

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
    const token = Cookies.get("token");
    const nombreUsu = usuario?.nombre_usuario;
    if (!token || !usuario) {
      mostrarAlerta("error","Ocurrio un error inesperado, Ingrese nuevamente al sistema","info");
      return;
    }
    apiClient.post("/logout", { usuario: nombreUsu })
      .then((response) => {
        limpiarSesion();
        mostrarAlerta("Cierre de sesión", response.data.message, "info");
      })
      .catch((error) => {
        manejarError(error.response.data);
      });
  }, [usuario]);

  const getDataSesion = useCallback(async () => {
    const token = Cookies.get("token");
    if (!token) {
      return;
    }
    apiClient.get(`/validaciones?token=${token}`)
      .then((response) => {
        const user = response.data;
        setUsuario(user);
        setAutenticado(true);
        localStorage.setItem("usuario", JSON.stringify(user));
        localStorage.setItem("autenticado", JSON.stringify(true));
      })
      .catch((error) => {
        manejarError(error.response.data);
      });
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