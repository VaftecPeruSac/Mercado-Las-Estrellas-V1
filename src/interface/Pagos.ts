 export interface Pagos {
    id_pago: string;
    puesto: string;
    socio: string;
    dni: string;
    telefono: string;
    correo: string;
    total_pago: string;
    total_deuda: string;
    fecha_registro: string;
  }
  
 export interface Column {
    id: keyof Data | "accion";
    label: string;
    minWidth?: number;
    align?: "center";
  }
  
 export  interface Data {
    id_pago: string;
    puesto: string;
    socio: string;
    dni: string;
    telefono: string;
    correo: string;
    total_pago: string;
    total_deuda: string;
    fecha_registro: string;
  }

export  interface Usuario {
  nombre_completo: string;
  nombre_usuario: string;
  rol: string;
}