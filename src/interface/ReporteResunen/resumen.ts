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

export interface Data {
  serie_numero: string;
  importe_ingreso: string;
  importe_gastos_administrativo: string;
  importe_multas_inasistencia: string;
  importe_pagos_transferencia: string;
  importe_cuotas_extraordinarias: string;
  importe_total: string;
}
