import { Column } from "../interface/Socios";

export const columns: readonly Column[] = [
    { id: "nombre_completo", label: "Nombre", minWidth: 50 }, // Nombre del socio
    { id: "dni", label: "DNI", minWidth: 50 },      // DNI
    { id: "telefono", label: "Teléfono", minWidth: 50 },  // Teléfono
    { id: "correo", label: "Correo", minWidth: 50 },      // Correo
    { id: "block_nombre", label: "Block", minWidth: 50 }, // Nombre del bloque
    { id: "numero_puesto", label: "Puesto", minWidth: 50 }, // Número del puesto
    { id: "gironegocio_nombre", label: "Giro", minWidth: 50 }, // Nombre del giro de negocio
    { id: "nombre_inquilino", label: "Inquilino", minWidth: 50 }, // Inquilino
    { id: "fecha_registro", label: "Fecha", minWidth: 50 }, // Fecha de registro
    { id: "deuda", label: "Deuda Total", minWidth: 30 }, // Deuda total
    { id: "ver_reporte", label: "Deudas / Pagos", minWidth: 10 }, // Ver Deuda / Pagos
    { id: "accion", label: "Acción", minWidth: 20 },    // Acción
  ];