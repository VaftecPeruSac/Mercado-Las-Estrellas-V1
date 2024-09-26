import { useEffect } from "react";
import { useAuth } from "./AuthContext";

const TemporizadorInactividad = (tiempoCerrarSesion: number, tiempoAlerta: number) => {

  // Obtenemos las funciones de autenticación
  const { logout } = useAuth();

  // Función para cerrar sesión por inactividad
  useEffect(() => {

    // Inicializamos el temporizador
    let temporizador: NodeJS.Timeout;
    let alerta: NodeJS.Timeout;

    const reiniciarTemporizador = () => {
      // Limpiamos el temporizador
      clearTimeout(temporizador);
      clearTimeout(alerta);

      // Mostramos una alerta de inactividad
      alerta = setTimeout(() => {
        alert("Su sesión se cerrará por inactividad en 5 minutos");
      }, tiempoCerrarSesion - tiempoAlerta);

      // Iniciamos el temporizador
      temporizador = setTimeout(logout, tiempoCerrarSesion);
    };

    const manejarEvento = () => {
      // Reiniciamos el temporizador
      reiniciarTemporizador();
    };

    // Escuchamos los eventos de movimiento del mouse y teclado
    window.addEventListener('mousemove', manejarEvento);
    window.addEventListener('keypress', manejarEvento);

    // Reiniciamos el temporizador al cargar el componente
    reiniciarTemporizador();

    // Retornamos la limpieza del efect
    return () => {
      // Limpiamos el temporizador
      clearTimeout(temporizador);
      clearTimeout(alerta);
      // Eliminamos los eventos al desmontar el componente
      window.removeEventListener('mousemove', manejarEvento);
      window.removeEventListener('keypress', manejarEvento);
    };

  }, [logout, tiempoCerrarSesion, tiempoAlerta]);

};

export default TemporizadorInactividad;