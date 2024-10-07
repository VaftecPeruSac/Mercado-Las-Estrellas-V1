
import { Column } from "../interface/Servicios"; // se esta importando la interface servicios

export const columns: readonly Column[] = [
    { id: "descripcion", label: "Descripción", minWidth: 50 },
    { id: "costo_unitario", label: "Costo Unitario", minWidth: 50 },
    { id: "fecha_registro", label: "Fecha Registro", minWidth: 50 },
    { id: "tipo_servicio", label: "Tipo de Servicio", minWidth: 50 },
    { id: "accion", label: "Acciones", minWidth: 20 },
];
