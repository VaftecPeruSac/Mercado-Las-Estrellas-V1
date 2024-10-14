import {
  Autocomplete,
  Box,
  FormControl,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import useResponsive from "../../hooks/Responsive/useResponsive";
import { useSearchParams } from "react-router-dom";
import LoadingSpinner from "../PogressBar/ProgressBarV1";
import Contenedor from "../Shared/Contenedor";
import BotonExportar from "../Shared/BotonExportar";
import BotonAgregar from "../Shared/BotonAgregar";
import ContenedorBotones from "../Shared/ContenedorBotones";
import { Api_Global_Reportes } from "../../service/ReporteApi";
import { handleExport } from "../../Utils/exportUtils";

interface Puesto {
  id_puesto: number;
  numero_puesto: string;
}

interface Column {
  id: keyof Data | "accion";
  label: string;
  minWidth?: number;
  align?: "center";
}

interface Data {
  id_recibo: string;
  ingreso: string;
  gastos: string;
  multa_inasistencia: string;
  pagos_transferencia: string;
  cuotas_extra: string;
  total: string;
}

const columns: readonly Column[] = [
  { id: "id_recibo", label: "N° Recibo", minWidth: 50, align: "center" },
  { id: "ingreso", label: "Ingreso", minWidth: 50, align: "center" },
  {
    id: "gastos",
    label: "Gastos Administrativos",
    minWidth: 50,
    align: "center",
  },
  {
    id: "multa_inasistencia",
    label: "Multas inasistencia",
    minWidth: 50,
    align: "center",
  },
  {
    id: "pagos_transferencia",
    label: "Pagos transferencia",
    minWidth: 50,
    align: "center",
  },
  {
    id: "cuotas_extra",
    label: "Cuotas Extraordinarias",
    minWidth: 50,
    align: "center",
  },
];
const TablaReporteResumen = () => {
  const { isTablet, isMobile } = useResponsive();
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [mostrarDetalles, setMostrarDetalles] = useState<string | null>(null);
  const [puestoSeleccionado, setPuestoSeleccionado] = useState<number>(0);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [resumen, setResumen] = useState<Data[]>([]);
  const [exportFormat, setExportFormat] = useState<string>("");


  const cambiarPagina = (event: React.ChangeEvent<unknown>, value: number) => {
    setPaginaActual(value);
    fetchResumen(value, puestoSeleccionado);
  };

  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const getMonth = (date: string) => {
    const fecha = new Date(date);
    return meses[fecha.getMonth()];
  };

  const getDay = (date: string) => {
    const fecha = new Date(date);
    const day = fecha.getDate() < 10 ? `0${fecha.getDate()}` : fecha.getDate();
    return day;
  };

  useEffect(() => {
    const fetchPuestos = async () => {
      try {
        const response = await axios.get(
          "https://mercadolasestrellas.online/intranet/public/v1/puestos?per_page=50"
        );
        setPuestos(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPuestos();
  }, []);

  const fetchResumen = async (pagina: number = 1, idPuesto: number) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://mercadolasestrellas.online/intranet/public/v1/reportes/resumen-por-puestos?page=${pagina}&id_puesto=${idPuesto}`
      );
      setResumen(response.data.data);
      setTotalPaginas(response.data.meta.last_page);
      setPaginaActual(response.data.meta.current_page);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportReporteResumen = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const exportUrl = Api_Global_Reportes.reportes.exportarResumen(); // URL específica para servicios
    const fileNamePrefix = "lista-reporte-resumen"; // Nombre del archivo
    await handleExport(exportUrl, exportFormat, fileNamePrefix, setExportFormat);
  };
  return (
    <Contenedor>
      <ContenedorBotones reporte>
        <Box
          sx={{
            width: isTablet || isMobile ? "100%" : "auto",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            alignItems: "center",
            ml: isTablet || isMobile ? "0px" : "10px",
            mr: isMobile ? "0px" : "auto",
          }}
        >
          {/* Seleccionar socio */}
          <FormControl
            fullWidth
            required
            sx={{
              width: isTablet ? "70%" : isMobile ? "100%" : "300px",
            }}
          >
            <Autocomplete
              options={puestos}
              getOptionLabel={(puesto) => puesto.numero_puesto}
              onChange={(event, value) => {
                if (value) {
                  setPuestoSeleccionado(value.id_puesto);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Seleccionar puesto"
                  InputProps={{ ...params.InputProps }}
                />
              )}
              ListboxProps={{
                style: {
                  maxHeight: 270,
                  overflow: "auto",
                },
              }}
              isOptionEqualToValue={(option, value) =>
                option.id_puesto === value.id_puesto
              }
            />
          </FormControl>
          <BotonAgregar
            exportar
            handleAction={() => fetchResumen(undefined, puestoSeleccionado)}
            texto="Generar"
          />
        </Box>

        <BotonExportar
          exportFormat={exportFormat}
          setExportFormat={setExportFormat}
          handleExport={handleExportReporteResumen}
        />
      </ContenedorBotones>
      {isLoading ? (
        <LoadingSpinner /> // Mostrar el loading mientras se están cargando los datos
      ) : (
        <>
          {/* Tabla reporte pagos */}
          <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: "none" }}>
            <TableContainer
              sx={{ maxHeight: "100%", borderRadius: "5px", border: "none" }}
            >
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {isTablet || isMobile ? (
                      <Typography
                        sx={{
                          mt: 2,
                          mb: 1,
                          fontSize: "1.5rem",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          textAlign: "center",
                        }}
                      >
                        Lista de Pagos
                      </Typography>
                    ) : (
                      columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                          sx={{
                            fontWeight: "bold",
                          }}
                        >
                          {column.label}
                        </TableCell>
                      ))
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {resumen.length > 0 ? (
                    resumen.map((resum) => (
                      <TableRow hover role="checkbox" tabIndex={-1}>
                        {isTablet || isMobile ? (
                          <TableCell
                            padding="checkbox"
                            colSpan={columns.length}
                          >
                            <Box
                              sx={{ display: "flex", flexDirection: "column" }}
                            >
                             <Typography
                                  sx={{
                                    p: 2,
                                    // Al seleccionar la cuota se cambia el color de fondo
                                    bgcolor: mostrarDetalles === resum.multa_inasistencia? "#f0f0f0" : "inherit",
                                    "&:hover": {
                                      cursor: "pointer",
                                      bgcolor: "#f0f0f0",
                                    }
                                  }}
                                  onClick={() => setMostrarDetalles(
                                    mostrarDetalles === resum.multa_inasistencia ? null : resum.multa_inasistencia
                                  )}
                                >
                                  {resum.multa_inasistencia}
                                </Typography>
                              {mostrarDetalles === resum.multa_inasistencia && (
                                <Box
                                  sx={{
                                    p: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1,
                                  }}
                                >
                                  {columns.map((column) => {
                                    const value =
                                      column.id === "accion"
                                        ? ""
                                        : (resum as any)[column.id];
                                    return (
                                      <Box>
                                        {/* Mostrar titulo del campo */}
                                        <Typography
                                          sx={{ fontWeight: "bold", mb: 1 }}
                                        >
                                          {column.label}
                                        </Typography>
                                        {/* Mostrar los detalles del pago */}
                                        {Array.isArray(value) ? ( // Si es un array de servicios
                                          value.map(
                                            (
                                              detalle,
                                              index // Mostrar los servicios
                                            ) => (
                                              <Typography key={index}>
                                                {detalle.descripcion}: S/{" "}
                                                {detalle.importe}
                                              </Typography>
                                            )
                                          )
                                        ) : (
                                          <Typography>{value}</Typography>
                                        )}
                                      </Box>
                                    );
                                  })}
                                </Box>
                              )}
                            </Box>
                          </TableCell>
                        ) : (
                          columns.map((column) => {
                            const value =
                              column.id === "accion"
                                ? ""
                                : (resum as any)[column.id];
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {Array.isArray(value)
                                  ? value.map(
                                      (
                                        detalle,
                                        index // Mostrar los servicios
                                      ) => (
                                        <Typography
                                          textAlign="left"
                                          key={index}
                                        >
                                          {detalle.descripcion}: S/{" "}
                                          {detalle.importe}
                                        </Typography>
                                      )
                                    )
                                  : value}
                              </TableCell>
                            );
                          })
                        )}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} align="center">
                        No hay datos para mostrar. <br />
                        Para generar el reporte, seleccione un puesto y de clic
                        en el botón "GENERAR".
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Box
              sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}
            >
              <Pagination
                count={totalPaginas}
                page={paginaActual}
                onChange={cambiarPagina}
                color="primary"
              />
            </Box>
          </Paper>
        </>
      )}
    </Contenedor>
  );
};

export default TablaReporteResumen;
