import { useEffect, useState } from "react";
import useResponsive from "../../hooks/Responsive/useResponsive";
import axios from "axios";
import { Autocomplete, Box, FormControl, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import LoadingSpinner from "../PogressBar/ProgressBarV1";
import Contenedor from "../Shared/Contenedor";
import ContenedorBotonesReportes from "../Shared/ContenedorBotonesReportes";
import BotonExportar from "../Shared/BotonExportar";
import BotonAgregar from "../Shared/BotonAgregar";

interface Puesto {
  id_puesto: number;
  numero_puesto: string;
}

interface Data {
  anio: string;
  servicio_descripcion: string;
  aprobado: string;
  pagado: string;
  por_pagar: string;
  fecha: string;
}

interface Column {
  id: keyof Data | "mes" | "dia" | "accion";
  label: string;
  minWidth?: number;
  align?: "center";
}

const columns: readonly Column[] = [
  { id: "anio", label: "Año", minWidth: 50, align: "center" },
  { id: "mes", label: "Mes", minWidth: 50, align: "center" },
  { id: "dia", label: "Día", minWidth: 50, align: "center" },
  { id: "servicio_descripcion", label: "Descripción del servicio", minWidth: 50, align: "center" },
  { id: "aprobado", label: "Imp. Aprobado", minWidth: 50, align: "center" },
  { id: "pagado", label: "Imp. Pagado (S/)", minWidth: 50, align: "center" },
  { id: "por_pagar", label: "Imp. Por pagar (S/)", minWidth: 50, align: "center" },
]

const TablaCuotasPuesto: React.FC = () => {

  // Variables para el responsive
  const { isTablet, isMobile } = useResponsive();
  const [mostrarDetalles, setMostrarDetalles] = useState<string | null>(null);
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [puestoSeleccionado, setPuestoSeleccionado] = useState<number>(0);
  const [cuotas, setCuotas] = useState<Data[]>([]);
  const [exportFormat, setExportFormat] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const cambiarPagina = (event: React.ChangeEvent<unknown>, value: number) => {
    setPaginaActual(value);
    fetchCuotas(value, puestoSeleccionado);
  };

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const getMonth = (date: string) => {
    const fecha = new Date(date);
    return meses[fecha.getMonth()];
  }

  const getDay = (date: string) => {
    const fecha = new Date(date);
    const day = fecha.getDate() < 10 ? `0${fecha.getDate()}` : fecha.getDate();
    return day;
  }

  // Obtener los puestos
  useEffect(() => {
    const fetchPuestos = async () => {
      try {
        const response = await axios.get("https://mercadolasestrellas.online/intranet/public/v1/puestos?per_page=50");
        setPuestos(response.data.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchPuestos();
  }, []);

  // Obtener las cuotas por puesto
  const fetchCuotas = async (pagina: number = 1, idPuesto: number) => {
    setIsLoading(true)
    try {
      const response = await axios.get(`https://mercadolasestrellas.online/intranet/public/v1/reportes/cuota-por-puestos?page=${pagina}&id_puesto=${idPuesto}`);
      setCuotas(response.data.data);
      setTotalPaginas(response.data.meta.last_page);
      setPaginaActual(response.data.meta.current_page);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Contenedor>
      <ContenedorBotonesReportes>
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
          {/* Seleccionar cuota */}
          <FormControl fullWidth required
            sx={{
              width: isTablet ? "70%" : isMobile ? "100%" : "300px"
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
                  overflow: 'auto',
                },
              }}
              isOptionEqualToValue={(option, value) => option.id_puesto === value.id_puesto}
            />
          </FormControl>
          {/* Botón "Generar Reporte" */}
          <BotonAgregar
            handleAction={() => fetchCuotas(undefined, puestoSeleccionado)}
            texto="Generar"
          />
        </Box>

        <BotonExportar
          exportFormat={exportFormat}
          setExportFormat={setExportFormat}
          handleExport={() => alert("En proceso...")}
        />

      </ContenedorBotonesReportes>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: "none" }}>
            <TableContainer
              sx={{ maxHeight: "100%", borderRadius: "5px", border: "none" }}
            >
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {isTablet || isMobile
                      ? <Typography
                        sx={{
                          mt: 2,
                          mb: 1,
                          fontSize: "1.5rem",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          textAlign: "center",
                        }}
                      >
                        Lista de Deudas
                      </Typography>
                      : columns.map((column) => (
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
                      ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cuotas.length > 0
                    ? cuotas
                      .map((cuota) => (
                        <TableRow hover role="checkbox" tabIndex={-1}>
                          {isTablet || isMobile
                            ? <TableCell padding="checkbox" colSpan={columns.length}>
                              <Box sx={{ display: "flex", flexDirection: "column" }}>
                                <Typography
                                  sx={{
                                    p: 2,
                                    // Al seleccionar la cuota se cambia el color de fondo
                                    bgcolor: mostrarDetalles === cuota.servicio_descripcion ? "#f0f0f0" : "inherit",
                                    "&:hover": {
                                      cursor: "pointer",
                                      bgcolor: "#f0f0f0",
                                    }
                                  }}
                                  onClick={() => setMostrarDetalles(
                                    mostrarDetalles === cuota.servicio_descripcion ? null : cuota.servicio_descripcion
                                  )}
                                >
                                  {cuota.servicio_descripcion}
                                </Typography>
                                {mostrarDetalles === cuota.servicio_descripcion && (
                                  <Box
                                    sx={{
                                      p: 2,
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: 1
                                    }}
                                  >
                                    {columns.map((column) => {
                                      const value = column.id === "accion" ? "" : (cuota as any)[column.id];
                                      return (
                                        <Box>
                                          {/* Mostrar titulo del campo */}
                                          <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                                            {column.label}
                                          </Typography>
                                          {/* Mostrar los detalles de la cuota */}
                                          <Typography>
                                            {
                                              column.id === "mes"
                                                ? getMonth(cuota.fecha)
                                                : column.id === "dia"
                                                  ? getDay(cuota.fecha)
                                                  : value
                                            }
                                          </Typography>
                                        </Box>
                                      )
                                    })}
                                  </Box>
                                )}
                              </Box>
                            </TableCell>
                            : columns.map((column) => {
                              const value = column.id === "accion" ? "" : (cuota as any)[column.id];
                              return (
                                <TableCell
                                  key={column.id}
                                  align={column.align}
                                >
                                  {
                                    column.id === "mes"
                                      ? getMonth(cuota.fecha)
                                      : column.id === "dia"
                                        ? getDay(cuota.fecha)
                                        : value
                                  }
                                </TableCell>
                              );
                            })}
                        </TableRow>
                      ))
                    : <TableRow>
                      <TableCell colSpan={columns.length} align="center">
                        No hay datos para mostrar. <br />
                        Para generar el reporte, seleccione un puesto y de clic en el botón "GENERAR".
                      </TableCell>
                    </TableRow>
                  }
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}>
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
  )
}

export default TablaCuotasPuesto;