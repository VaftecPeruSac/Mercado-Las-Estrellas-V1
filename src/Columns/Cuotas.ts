import { Column } from "../interface/Cuotas/cuota";

export const columns: readonly Column[] = [
    { id: "id_deuda", label: "# ID", minWidth: 50 }, // Nombre del socio
    { id: "socio_nombre", label: "Socio", minWidth: 50 },
    { id: "puesto_descripcion", label: "Puesto", minWidth: 50 },
    { id: "servicio_descripcion", label: "Servicio", minWidth: 50 },
    { id: "fecha_registro", label: "Fecha Emisión", minWidth: 50 }, // DNI
    { id: "fecha_vencimiento", label: "Fecha Vencimiento", minWidth: 50 }, // Nombre del bloque
    { id: "importe", label: "Importe", minWidth: 50 }, // Número del puesto
    { id: "accion", label: "Acción", minWidth: 20 }, // Acciones
  ];