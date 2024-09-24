import { createContext, ReactNode, useContext, useState } from "react";

// Definimos la estructura del contexto de autenticación
interface AuthContextType {
  autenticado: boolean;
  login: () => void;
  logout: () => void;
}

// Creamos el contexto de autenticación
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Creamos el proveedor de autenticación
export const AuthProvider = ({ children }: { children: ReactNode }) => {

  // Por defecto la utenticación es falsa
  const [autenticado, setAutenticado] = useState(false);

  // Funciones para iniciar y cerrar sesión
  const login = () => setAutenticado(true);
  const logout = () => setAutenticado(false);

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