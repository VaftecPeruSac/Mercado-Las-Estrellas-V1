export interface AuthContextType {
    autenticado: boolean;
    usuario: string | null; // Añadido para guardar el nombre de usuario
    login: (nombreUsuario: string) => void; // Ahora acepta un nombre de usuario
    logout: () => void; // No se pasa como parámetro, se obtiene del estado
  }