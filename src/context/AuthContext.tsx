import { createContext, ReactNode, useContext, useEffect, useState } from "react";

// Definimos la estructura del contexto de autenticación
interface AuthContextType {
  autenticado: boolean;
  login: () => void;
  logout: () => void;
}

// Creamos el contexto de autenticación
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Creamos el proveedor de autenticación para envolver la aplicación
export const AuthProvider = ({ children }: { children: ReactNode }) => {

  // Por defecto la utenticación es falsa
  const [autenticado, setAutenticado] = useState<boolean>(() => {
    // Obtenemos el estado de autenticación guardado en el localStorage
    const guardarAutenticado = localStorage.getItem('autenticado');
    // Si existe el estado de autenticación, lo retornamos, de lo contrario retornamos falso
    return guardarAutenticado ? JSON.parse(guardarAutenticado) : false;
  });

  // Funciones para iniciar y cerrar sesión
  const login = () => {
    setAutenticado(true);
    // Guardamos el estado de autenticación en el localStorage
    localStorage.setItem('autenticado', JSON.stringify(true));
  }
  const logout = () => {
    setAutenticado(false);
    // Eliminamos el estado de autenticación del localStorage
    localStorage.removeItem('autenticado');
  }

  // Efecto para escuchar los cambios en el localStorage
  useEffect(() => {

    const manejarAutenticacion = () => {
      // Obtenemos el estado de autenticación guardado en el localStorage
      const guardarAutenticado = localStorage.getItem('autenticado');
      // Si existe el estado de autenticación, lo actualizamos
      if (guardarAutenticado) {
        setAutenticado(JSON.parse(guardarAutenticado));
      }
    };

    // Escuchamos los cambios en el localStorage
    window.addEventListener('storage', manejarAutenticacion);
    return () => {
      // Eliminamos el evento al desmontar el componente
      window.removeEventListener('storage', manejarAutenticacion);
    };

  }, []);

  // Retornamos el proveedor de autenticación
  return (
    <AuthContext.Provider value={{ autenticado, login, logout }}>
      {children}
    </AuthContext.Provider>
  );

};

// Hook para consumir el contexto de autenticación
export const useAuth = () => {

  // Obtenemos el contexto de autenticación
  const context = useContext(AuthContext);

  // Si no se encuentra el contexto, lanzamos un error
  if (!context) {
    throw new Error('Error: Debe iniciar sesión para navegar en la aplicación.');
  }

  // Retornamos el contexto
  return context;

};