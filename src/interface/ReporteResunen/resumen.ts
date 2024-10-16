 export interface Puesto {
    id_puesto: number;
    numero_puesto: string;
  }
  
 export interface Column {
    id: keyof Data | "accion";
    label: string;
    minWidth?: number;
    align?: "center";
  }
  
 export  interface Data {
    id_recibo: string;
    ingreso: string;
    gastos: string;
    multa_inasistencia: string;
    pagos_transferencia: string;
    cuotas_extra: string;
    total: string;
  }