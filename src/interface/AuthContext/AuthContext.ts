import { Usuario } from "./Usuario";

export interface AuthContextType {
  autenticado: boolean;
  usuario: Usuario | null;
  login: () => void;
  logout: () => void;
}