import React, { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

// Definimos la interfaz de las propiedades del componente
interface ProtectedRouteProps {
  children: ReactNode;
  requiredRol?: string;
}

// Creamos el componente de ruta protegida
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRol }) => {

  // Obtenemos el estado de autenticación
  const { autenticado, rol } = useAuth();

  // Si el usuario está autenticado, mostramos el contenido
  if (!autenticado) {
    return <Navigate to="/" />;
  }

  if (requiredRol && rol !== requiredRol) {
    if (rol === "1") {
      return <Navigate to="/home/reporte-pagos" />;
    }
    return <Navigate to="/home" />;
  }

  return <>{children}</>;

};

export default ProtectedRoute;