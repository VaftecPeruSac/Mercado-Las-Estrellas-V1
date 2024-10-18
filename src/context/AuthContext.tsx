import axios from "axios";
import Cookies from "js-cookie";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { manejarError, mostrarAlerta } from "../components/Alerts/Registrar";

// Definimos la estructura del contexto de autenticación
interface AuthContextType {
  autenticado: boolean;
  usuario: string | null; // Añadido para guardar el nombre de usuario
  login: (nombreUsuario: string) => void; // Ahora acepta un nombre de usuario
  logout: () => void; // No se pasa como parámetro, se obtiene del estado
}

// Creamos el contexto de autenticación
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Creamos el proveedor de autenticación para envolver la aplicación
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [autenticado, setAutenticado] = useState<boolean>(() => {
    const guardarAutenticado = localStorage.getItem("autenticado");
    return guardarAutenticado ? JSON.parse(guardarAutenticado) : false;
  });

  const [usuario, setUsuario] = useState<string | null>(() => {
    return localStorage.getItem("usuario"); // Recupera el nombre de usuario al iniciar
  });

  // Funciones para iniciar sesión
  const login = (nombreUsuario: string) => {
    setAutenticado(true);
    setUsuario(nombreUsuario); // Guarda el nombre de usuario
    localStorage.setItem("autenticado", JSON.stringify(true));
    localStorage.setItem("usuario", nombreUsuario); // Guarda el usuario en localStorage
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      const token = Cookies.get("token"); // Recuperamos el token

      if (token && usuario) {
        await axios.post(
          "https://mercadolasestrellas.online/intranet/public/v1/logout",
          { usuario }, // Enviamos el usuario en el cuerpo de la solicitud
          {
            headers: {
              Authorization: `Bearer ${token}`, // Token como Bearer
              "Content-Type": "application/json", // Tipo de contenido
            },
          }
        );
      }

      // Limpieza de cookies y estado
      Cookies.remove("token", { path: "/" });
      setAutenticado(false);
      setUsuario(null);
      localStorage.removeItem("autenticado");
      localStorage.removeItem("usuario");

      mostrarAlerta("Cierre de sesión", "Sesión cerrada correctamente.", "info");
    } catch (error) {
      manejarError(error);
    }
  };

  useEffect(() => {
    const manejarAutenticacion = () => {
      const guardarAutenticado = localStorage.getItem("autenticado");
      const guardarUsuario = localStorage.getItem("usuario"); // Obtiene el usuario del localStorage
      if (guardarAutenticado) {
        setAutenticado(JSON.parse(guardarAutenticado));
        setUsuario(guardarUsuario); // Actualiza el usuario en el estado
      }
    };

    window.addEventListener("storage", manejarAutenticacion);
    return () => {
      window.removeEventListener("storage", manejarAutenticacion);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ autenticado, usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para consumir el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Error: Debe iniciar sesión para navegar en la aplicación.");
  }
  return context;
};
