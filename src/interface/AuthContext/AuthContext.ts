export interface AuthContextType {
  autenticado: boolean;
  usuario: string | null; // Añadido para guardar el nombre de usuario
  rol: string | null; // Añadido para guardar el rol de usuario
  login: (nombreUsuario: string, rolUsuario: string) => void;
  logout: () => void; // No se pasa como parámetro, se obtiene del estado
}