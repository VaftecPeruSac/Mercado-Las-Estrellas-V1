import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Api_Global_Puestos } from "../../service/PuestoApi";
import { Data, Puesto } from "../../interface/Puestos";
import { formatDate } from "../../Utils/dateUtils";
import useResponsive from "../Responsive/useResponsive";
import apiClient from "../../Utils/apliClient";

const usePuestos = () => {
  const [giroSeleccionado, setGiroSeleccionado] = useState<string>("");
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState<string>("");
  const [nroPuestoIngresado, setNroPuestoIngresado] = useState<string>("");
  const [puestos, setPuestos] = useState<Data[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [paginaActual, setPaginaActual] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const { isLaptop, isTablet, isMobile } = useResponsive();
  const [mostrarDetalles, setMostrarDetalles] = useState<string | null>(null);
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
          giro_negocio: {
            id_gironegocio: item.giro_negocio.id_gironegocio,
            nombre: item.giro_negocio.nombre,
          },
          block: {
            id_block: item.block.id_block,
            nombre: item.block.nombre,
          },
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
