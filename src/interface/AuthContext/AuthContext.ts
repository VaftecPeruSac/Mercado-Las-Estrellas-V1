import { Usuario } from "./Usuario";

export interface AuthContextType {
  autenticado: boolean;
  usuario: Usuario | null;
  login: (user: Usuario) => void;
  logout: () => void;
  getDataSesion: () => void;
}