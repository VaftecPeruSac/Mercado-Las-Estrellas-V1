export interface Puesto {
    id_puesto: number;
    numero_puesto: string;
    area: string;
    estado: string;
    fecha_registro: string;
    socio: string;
    giro_negocio: GiroNegocio
    block: Bloque;
    inquilino: {
        id_inquilino: string,
        nombre: string,
        apellido_materno: string,
        apellido_paterno: string,
        dni: string,
        telefono: string,
    };
}

export interface Bloque {
    id_block: number;
    nombre: string;
}

export interface GiroNegocio {
    id_gironegocio: number;
    nombre: string;
}

export interface PuestoSelect {
    id_puesto: number;
    numero_puesto: string;
}

export interface Column {
    id: keyof Puesto | "accion";
    label: string;
    minWidth?: number;
    align?: "center";
    format?: (value: any) => string;
}
