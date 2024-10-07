import { useEffect, useState } from "react";
import { Servicio, Data } from "../interface/Servicios";

const useServicioState = () => {
    const [mostrarDetalles, setMostrarDetalles] = useState<string | null>(null);
    const [buscarTexto, setBuscarTexto] = useState<string>("");
    const [servicios, setServicios] = useState<Data[]>([]);
    const [servicioSeleccionado, setServicioSeleccionado] = useState<Servicio | null>(null);
    const [totalPages, setTotalPages] = useState(1);
    const [paginaActual, setPaginaActual] = useState(1);
    const [exportFormat, setExportFormat] = useState("");
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    // useEffect(() => {
    //     fetchServicios(paginaActual);
    //   }, []);

    return {
        mostrarDetalles,
        setMostrarDetalles,
        buscarTexto,
        setBuscarTexto,
        servicios,
        setServicios,
        servicioSeleccionado,
        setServicioSeleccionado,
        totalPages,
        setTotalPages,
        paginaActual,
        setPaginaActual,
        exportFormat,
        setExportFormat,
        open,
        setOpen,
        isLoading,
        setIsLoading,
    };
};


export default useServicioState
