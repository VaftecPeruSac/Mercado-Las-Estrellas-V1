import React, { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

// Definimos la interfaz de las propiedades del componente
interface ProtectedRouteProps {
  children: ReactNode;
}

// Creamos el componente de ruta protegida
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {

  // Obtenemos el estado de autenticación
  const { autenticado } = useAuth();

  // Si el usuario está autenticado, mostramos el contenido
  return autenticado ? <>{children}</> : <Navigate to="/" />;

};

export default ProtectedRoute;