import { useState, useEffect, useCallback } from "react";
import { Api_Global_Socios } from "../../service/SocioApi";
import useResponsive from "../Responsive/useResponsive";
import { useNavigate } from "react-router-dom";
import { Socio } from "../../interface/Socios";
import { formatDate } from "../../Utils/dateUtils";
import apiClient from "../../Utils/apliClient";

const useSocios = () => {
    const { isTablet, isMobile, isSmallMobile } = useResponsive();
    const [mostrarDetalles, setMostrarDetalles] = useState<number | null>(null);
    const [nombreIngresado, setNombreIngresado] = useState<string>("");
    const [numeroPuesto, setNumeroPuesto] = useState<string>("");
    const [socioSeleccionado, setSocioSeleccionado] = useState<Socio | null>(null);
    const [open, setOpen] = useState(false);
    const [exportFormat, setExportFormat] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [socios, setSocios] = useState<Socio[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [paginaActual, setPaginaActual] = useState(1);
    const navigate = useNavigate();

    const fetchSocios = useCallback(async (page: number = 1) => {
        setIsLoading(true);
        try {
            const response = await apiClient.get(Api_Global_Socios.socios.fetch(page, nombreIngresado, numeroPuesto));
            const data = response.data.data.map((item: Socio) => ({
                id_socio: item.id_socio,
                nombre_completo: item.nombre_completo,
                nombre_socio: item.nombre_socio,
                apellido_paterno: item.apellido_paterno,
                apellido_materno: item.apellido_materno,
                dni: item.dni,
                sexo: item.sexo,
                direccion: item.direccion,
                telefono: item.telefono,
                correo: item.correo,
                puestos: item.puestos.map((puesto) => ({
                    id_puesto: puesto.id_puesto,
                    numero_puesto: puesto.numero_puesto,
                    block: puesto.block,
                    gironegocio: puesto.gironegocio,
                    nombre_inquilino: puesto.nombre_inquilino,
                })),
                estado: item.estado,
                fecha_registro: formatDate(item.fecha_registro),
                deuda: item.deuda,
            }));
            setSocios(data);
            setTotalPages(response.data.meta.last_page);
            setPaginaActual(response.data.meta.current_page);
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    }, [nombreIngresado, numeroPuesto]);

    useEffect(() => {
        fetchSocios();
    }, [fetchSocios]);

    return {
        isTablet,
        isMobile,
        isSmallMobile,
        mostrarDetalles,
        setMostrarDetalles,
        nombreIngresado,
        setNombreIngresado,
        setNumeroPuesto,
        socioSeleccionado,
        setSocioSeleccionado,
        open,
        setOpen,
        exportFormat,
        setExportFormat,
        isLoading,
        socios,
        totalPages,
        paginaActual,
        setPaginaActual,
        navigate,
        fetchSocios,
    };
};

export default useSocios;
