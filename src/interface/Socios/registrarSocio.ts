export interface AgregarProps {
  open: boolean;
  handleClose: () => void;
  socio: EditarSocio | null;
  // onSocioRegistrado: () => void;  // Nuevo callback para actualizar la lista
}

export interface EditarSocio {
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

export interface Bloque {
  id_block: number;
  nombre: string;
}

export interface Puesto {
  id_puesto: number;
  id_block: number;
  numero_puesto: string;
}
