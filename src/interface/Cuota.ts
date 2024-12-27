import { Servicio } from "./Servicios";

export interface Cuotas {
  id_cuota: string;
  importe: string;
  fecha_emision: string;
  fecha_vencimiento: string;
  puestos_asignados: Array<PuestoCuotas>;
  servicios: Array<Servicio>;
}

interface PuestoCuotas {
  id_puesto: string;  
  numero: string;
}

export interface IMeses {
  value: string;
  label: string;
}

export interface ServicioSelect {
  id_servicio: number;
  nombre: string;
}

export interface Column {
  id: keyof Cuotas | "accion";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: any) => string;
}

export interface ColumnServicios {
  id: keyof Servicio | "accion";
  label: string;
  minWidth?: number;
  align?: "center";
}

export interface AgregarProps {
  open: boolean;
  handleClose: () => void;
}
