import React, { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

// Definimos la interfaz de las propiedades del componente
interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
}

// Creamos el componente de ruta protegida
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles }) => {

  // Obtenemos el estado de autenticación
  const { autenticado, usuario } = useAuth();

  // Si el usuario está autenticado, mostramos el contenido
  if (!autenticado) {
    return <Navigate to="/" />;
  }

  if (requiredRoles && !requiredRoles.includes(usuario?.rol ? usuario?.rol : "")) {
    if (usuario?.rol === "Socio") {
      return <Navigate to="/home/reporte-pagos" />;
    }
    return <Navigate to="/home" />;
  }

  return <>{children}</>;

};

export default ProtectedRoute;