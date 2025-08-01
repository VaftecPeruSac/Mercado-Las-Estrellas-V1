import { Column } from "../interface/Socios";

export const columns: readonly Column[] = [
  { id: "nombre_completo", label: "Nombre del socio", minWidth: 50 },
  { id: "dni", label: "DNI", minWidth: 50 },
  { id: "telefono", label: "Teléfono", minWidth: 50 },
  { id: "correo", label: "Correo", minWidth: 50 },
  { id: "bloque", label: "Block", minWidth: 50 },
  { id: "numero_puesto", label: "Puesto", minWidth: 40 }, 
  { id: "giro_negocio", label: "Giro", minWidth: 50 },
  { id: "inquilino", label: "Inquilino", minWidth: 50 },
  { id: "fecha_registro", label: "Fec. Registro", minWidth: 40 },
  // { id: "deuda", label: "Deuda Total", minWidth: 30 },
  { id: "ver_reporte", label: "Deudas / Pagos", minWidth: 10 },
  { id: "accion", label: "Acción", minWidth: 20 },
];