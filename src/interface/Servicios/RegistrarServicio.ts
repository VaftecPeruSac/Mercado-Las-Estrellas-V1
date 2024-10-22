export interface AgregarProps {
  open: boolean;
  handleClose: () => void;
  servicio: Editarservicio | null;
}

export interface Editarservicio {
  id_servicio: string;
  descripcion: string;
  costo_unitario: string;
  tipo_servicio: string;
  fecha_registro: string;
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
