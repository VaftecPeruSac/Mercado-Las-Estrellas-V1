import { Column } from "../interface/Pagos";

export const columns: readonly Column[] = [
    { id: "id_pago", label: "#ID", minWidth: 50, align: "center" },
    { id: "puesto", label: "N° Puesto", minWidth: 50, align: "center" },
    { id: "socio", label: "Socio", minWidth: 50, align: "center" },
    { id: "dni", label: "DNI", minWidth: 50, align: "center" },
    { id: "fecha_registro", label: "Fecha", minWidth: 50, align: "center" },
    { id: "telefono", label: "Teléfono", minWidth: 50, align: "center" },
    { id: "correo", label: "Correo", minWidth: 50, align: "center" },
    { id: "total_pago", label: "A Cuenta", minWidth: 50, align: "center" },
    { id: "total_deuda", label: "Monto Actual", minWidth: 50, align: "center" },
    { id: "accion", label: "Acciones", minWidth: 50, align: "center" },
  ];