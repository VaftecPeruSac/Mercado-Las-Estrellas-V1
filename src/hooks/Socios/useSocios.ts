import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Api_Global_Socios } from "../../service/SocioApi";
import useResponsive from "../Responsive/useResponsive";
import { useNavigate } from "react-router-dom";
import { Data, Socio } from "../../interface/Socios";

const useSocios = () => {
    const { isTablet, isMobile, isSmallMobile } = useResponsive();
    const [mostrarDetalles, setMostrarDetalles] = useState<string | null>(null);
    const [nombreIngresado, setNombreIngresado] = useState<string>("");
    const [socioSeleccionado, setSocioSeleccionado] = useState<Socio | null>(null);
    const [open, setOpen] = useState(false);
    const [exportFormat, setExportFormat] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [socios, setSocios] = useState<Data[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [paginaActual, setPaginaActual] = useState(1);
    const navigate = useNavigate();

    const fetchSocios = useCallback(async (page: number = 1) => {
        setIsLoading(true);
        try {
            const response = await axios.get(Api_Global_Socios.socios.fetch(page, nombreIngresado));
            const data = response.data.data;
            setSocios(data);
            setTotalPages(response.data.meta.last_page);
            setPaginaActual(response.data.meta.current_page);
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    }, [nombreIngresado,]);

    useEffect(() => {
        fetchSocios(paginaActual);
    }, []);

    return {
        isTablet,
        isMobile,
        isSmallMobile,
        mostrarDetalles,
        setMostrarDetalles,
        nombreIngresado,
        setNombreIngresado,
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
