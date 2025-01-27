export interface AgregarProps {
  open: boolean;
  handleClose: () => void;
}

export interface Socio {
  id_socio: number;
  nombre_completo: string;
}

export interface Puesto {
  id_puesto: number;
  numero_puesto: string;
  block: {
    nombre: string;
  };
}

export interface Deuda {
  id_deuda_cuota: number,
  id_deuda: number;
  total: string;
  por_pagar: string;
  servicio_descripcion: string;
  nombre_servicio: string;
  anio: string;
  mes: string;
  a_cuenta: string;
  deuda: string;
}

export interface Column {
  id: keyof Data | "accion";
  label: string;
  minWidth?: number;
  align?: "center";
}

export interface Data {
  id_deuda: number;
  total: string;
  servicio_descripcion: string;
  anio: string;
  mes: string;
  a_cuenta: string;
  deuda: string;
  pago: string;
}

export interface DeudaPendiente {
  id_deuda_cuota: number,
  id_deuda: number;
  total: string;
  servicio_descripcion: string;
  anio: string;
  mes: string;
  a_cuenta: string;
  deuda: any;
  pago: string;
  checked: boolean;
}

export interface Banco {
  id_banco: number;
  siglas_nombre: string;
}
export interface BancoCuenta {
  id_bancocuenta: number;
  numero_cuenta: string;
}