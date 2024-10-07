export interface Servicio {
    id_servicio: string;
    descripcion: string;
    costo_unitario: string;
    tipo_servicio: string;
    fecha_registro: string;
}

export interface Column {
    id: keyof Data | "accion";
    label: string;
    minWidth?: number;
    align?: "right";
    format?: (value: any) => string;
}

export interface Data {
    id_servicio: string;
    descripcion: string;
    costo_unitario: string;
    fecha_registro: string;
    tipo_servicio: string;
}