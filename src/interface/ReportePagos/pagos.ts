export interface Socio {
    id_socio: string;
    nombre_completo: string;
  }
  
 export interface Column {
    id: keyof Data | "accion";
    label: string;
    minWidth?: number;
    align?: "center";
  }
  
 export interface Data {
    id_pago: string;
    numero: string;
    serie: string;
    serie_numero: string;
    aporte: string;
    total: string;
    fecha: string;
    detalle_pagos: {
      descripcion: string;
      importe: string;
    }
  }