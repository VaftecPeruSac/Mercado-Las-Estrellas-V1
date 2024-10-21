import { useEffect, useState, useCallback } from "react";
import { Servicio, Data } from "../../interface/Servicios";
import useResponsive from "../Responsive/useResponsive";
import axios from "axios";
import { API_ROUTES } from "../../service/ServicioApi";
import { formatDate } from "../../Utils/dateUtils";

const useServicioState = () => {
  const [mostrarDetalles, setMostrarDetalles] = useState<string | null>(null);
  const [buscarTexto, setBuscarTexto] = useState<string>("");
  const [servicios, setServicios] = useState<Data[]>([]);
  const [servicioSeleccionado, setServicioSeleccionado] =
    useState<Servicio | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [paginaActual, setPaginaActual] = useState(1);
  const [exportFormat, setExportFormat] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isTablet, isMobile, isSmallMobile } = useResponsive();

  const fetchServicios = useCallback(
    async (page: number = 1) => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          API_ROUTES.servicios.fetch(page, buscarTexto)
        );
        const data = response.data.data.map((item: Servicio) => ({
          id_servicio: item.id_servicio,
          descripcion: item.descripcion,
          costo_unitario: item.costo_unitario,
          tipo_servicio: item.tipo_servicio,
          fecha_registro: formatDate(item.fecha_registro),
        }));
        setServicios(data);
        setTotalPages(response.data.meta.last_page); 
        setPaginaActual(response.data.meta.current_page); 
        console.log("la data es", response.data);
      } catch (error) {
        console.error("Error al traer datos", error);
      } finally {
        setIsLoading(false);
      }
    },
    [buscarTexto] 
  );
  

  useEffect(() => {
    fetchServicios(paginaActual);
  }, []);

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
    isTablet,
    isMobile,
    isSmallMobile,
    fetchServicios,
  };
};

export default useServicioState;
