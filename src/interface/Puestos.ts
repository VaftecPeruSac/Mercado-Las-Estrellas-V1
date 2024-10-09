export interface Puesto {
    id_puesto: string;
    numero_puesto: string;
    area: string;
    estado: string;
    fecha_registro: string;
    socio: string;
    giro_negocio: {
        id_gironegocio: string;
        nombre: string;
    };
    block: {
        id_block: string;
        nombre: string;
    };
    inquilino: string;
}

export interface Bloque {
    id_block: string;
    nombre: string;
}

export interface GiroNegocio {
    id_gironegocio: string;
    nombre: string;
}

export interface Column {
    id: keyof Data | "accion";
    label: string;
    minWidth?: number;
    align?: "center";
    format?: (value: any) => string;
}

export interface Data {
    id_puesto: string;
    numero_puesto: string;
    area: string;
    estado: string;
    fecha_registro: string;
    socio: string;
    giro_negocio: {
        id_gironegocio: string;
        nombre: string;
    };
    block: {
        id_block: string;
        nombre: string;
    };
    inquilino: string;
}