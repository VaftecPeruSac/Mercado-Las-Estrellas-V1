export interface Servicio {
    id_servicio: string;
    nombre: string;
    costo_unitario: string;
    tipo_servicio: string;
    fecha_registro: string;
}

export interface AgregarProps {
    open: boolean;
    handleClose: () => void;
    servicio: Servicio | null;
}

export interface Column {
    id: keyof Servicio | "accion";
    label: string;
    minWidth?: number;
    align?: "right";
    format?: (value: any) => string;
}
