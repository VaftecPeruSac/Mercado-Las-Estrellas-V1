export interface AgregarProps {
  open: boolean;
  handleClose: () => void;
}

export interface Servicio {
  id_servicio: string;
  descripcion: string;
  costo_unitario: string;
  tipo_servicio: string;
  estado: string;
  fecha_registro: string;
}

export interface Column {
  id: keyof Data | "accion";
  label: string;
  minWidth?: number;
  align?: "center";
}

export interface Data {
  descripcion: string;
  costo_unitario: string;
}
