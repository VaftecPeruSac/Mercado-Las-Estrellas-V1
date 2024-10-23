export interface Socio {
    id_socio: string;
    nombre_completo: string;
    nombre_socio: string;
    apellido_paterno: string;
    apellido_materno: string;
    dni: string;
    sexo: string;
    direccion: string;
    telefono: string;
    correo: string;
    id_puesto: string;
    numero_puesto: string;
    id_block: string;
    block_nombre: string;
    gironegocio_nombre: string;
    nombre_inquilino: string;
    estado: string;
    fecha_registro: string;
    deuda: string;
  }
  
export interface Column {
    id: keyof Data | "accion";
    label: string;
    minWidth?: number;
    align?: "right";
    format?: (value: any) => string;
  }
export interface Data {
    id_socio: string;
    nombre_completo: string;
    nombre_socio: string;
    apellido_paterno: string;
    apellido_materno: string;
    dni: string;
    sexo: string;
    direccion: string;
    telefono: string;
    correo: string;
    id_puesto: string;
    numero_puesto: string;
    id_block: string;
    block_nombre: string;
    gironegocio_nombre: string;
    nombre_inquilino: string;
    estado: string;
    fecha_registro: string;
    deuda: string;
    ver_reporte: string;
  }