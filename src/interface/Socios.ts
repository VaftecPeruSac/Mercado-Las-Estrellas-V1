import { Bloque, GiroNegocio } from "./Puestos";

export interface Socio {
  id_socio: number;
  nombre_completo: string;
  nombre_socio: string;
  apellido_paterno: string;
  apellido_materno: string;
  dni: string;
  sexo: string;
  direccion: string;
  telefono: string;
  correo: string;
  puestos: Array<Puesto>;
  estado: string;
  fecha_registro: string;
  deuda: string;
}

interface Puesto {
  id_puesto: number;
  numero_puesto: string;
  block: Bloque;
  gironegocio: GiroNegocio;
  nombre_inquilino: string;
}

export interface SocioSelect {
  id_socio: number;
  nombre_completo: string;
}

export interface Column {
  id: keyof Socio | "nombre_completo" | "bloque" | "numero_puesto" | "giro_negocio" | "inquilino" | "deuda" | "ver_reporte" | "accion";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: any) => string;
}

export interface AgregarProps {
  open: boolean;
  handleClose: () => void;
  socio: Socio | null;
}