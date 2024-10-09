export interface Cuotas {
    id_deuda: string; // Nombre del socio
    fecha_registro: string;
    fecha_vencimiento: string;
    importe: string;
    socio_nombre: string;
    puesto_descripcion: string;
    servicio_descripcion: string;
  }
  
export interface Column {
    id: keyof Data | "accion";
    label: string;
    minWidth?: number;
    align?: "right";
    format?: (value: any) => string;
  }
  
export interface Data {
    id_deuda: string;
    socio_nombre: string;
    puesto_descripcion: string;
    servicio_descripcion: string;
    fecha_registro: string;
    fecha_vencimiento: string;
    importe: string;
  }

export interface IMeses {
    value: string;
    label: string;
  }