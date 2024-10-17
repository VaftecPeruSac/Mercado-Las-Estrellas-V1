import { Button } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import Cookies from 'js-cookie';

// Suponiendo que estás en un componente funcional
const MiComponente = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout(); // Llama a la función de logout
    Cookies.remove('token'); // También elimina el token de las cookies si es necesario
    // Redirige a la página de login o a donde desees
  };

  return (
    <Button onClick={handleLogout}>Cerrar sesión</Button>
  );
};
