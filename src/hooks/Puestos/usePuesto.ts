import { useEffect, useState, useCallback } from "react";
import { Api_Global_Puestos } from "../../service/PuestoApi";
import { Puesto } from "../../interface/Puestos";
import { formatDate } from "../../Utils/dateUtils";
import useResponsive from "../Responsive/useResponsive";
import apiClient from "../../Utils/apliClient";

const usePuestos = () => {
  const [giroSeleccionado, setGiroSeleccionado] = useState<string>("");
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState<string>("");
  const [nroPuestoIngresado, setNroPuestoIngresado] = useState<string>("");
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [paginaActual, setPaginaActual] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const { isLaptop, isTablet, isMobile } = useResponsive();
  const [mostrarDetalles, setMostrarDetalles] = useState<number | null>(null);
  const [puestoSeleccionado, setPuestoSeleccionado] = useState<Puesto | null>(
    null
  );
  const [exportFormat, setExportFormat] = useState<string>("");
  const [open, setOpen] = useState(false);

  const fetchPuestos = useCallback(
    async (page: number = 1) => {
      setIsLoading(true);
      try {
        const response = await apiClient.get(Api_Global_Puestos.puestos.fetch(page, giroSeleccionado, bloqueSeleccionado, nroPuestoIngresado));
        const data = response.data.data.map((item: Puesto) => ({
          id_puesto: item.id_puesto,
          numero_puesto: item.numero_puesto,
          area: item.area,
          estado: item.estado,
          fecha_registro: formatDate(item.fecha_registro),
          socio: item.socio,
          giro_negocio: item.giro_negocio,
          block: item.block,
          inquilino: item.inquilino,
        }));

        setPuestos(data);
        setTotalPages(response.data.meta.last_page);
        setPaginaActual(response.data.meta.current_page);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [giroSeleccionado, bloqueSeleccionado, nroPuestoIngresado]
  );

  useEffect(() => {
    fetchPuestos();
  }, [fetchPuestos]);

  return {
    puestos,
    totalPages,
    paginaActual,
    isLoading,
    fetchPuestos,
    mostrarFiltros,
    setMostrarFiltros,
    isLaptop,
    isTablet,
    isMobile,
    mostrarDetalles,
    setMostrarDetalles,
    bloqueSeleccionado,
    setBloqueSeleccionado,
    nroPuestoIngresado,
    setNroPuestoIngresado,
    giroSeleccionado,
    setGiroSeleccionado,
    puestoSeleccionado,
    setPuestoSeleccionado,
    exportFormat,
    setExportFormat,
    open,
    setOpen,
  };
};

export default usePuestos;
