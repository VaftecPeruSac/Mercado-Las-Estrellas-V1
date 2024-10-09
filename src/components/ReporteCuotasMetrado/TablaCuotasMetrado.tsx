import React, { useEffect, useState } from 'react'
import useResponsive from '../../hooks/Responsive/useResponsive';
import { Autocomplete, Box, FormControl, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import axios from 'axios';
import LoadingSpinner from '../PogressBar/ProgressBarV1';
import Contenedor from '../Shared/Contenedor';
import ContenedorBotonesReportes from '../Shared/ContenedorBotonesReportes';
import BotonExportar from '../Shared/BotonExportar';
import BotonAgregar from '../Shared/BotonAgregar';
import { formatDate } from "../../Utils/dateUtils";

interface Cuota {
  id_cuota: string;
  fecha_registro: string;
}

interface Data {
  nombre_completo: string;
  numero_puesto: string;
  area: string;
  total: string;
  importe_pagado: string;
}

interface Column {
  id: keyof Data | "accion";
  label: string;
  minWidth?: number;
  align?: "center";
}

const columns: readonly Column[] = [
  { id: "nombre_completo", label: "Nombre completo", minWidth: 50, align: "center" },
  { id: "numero_puesto", label: "N° Puesto", minWidth: 50, align: "center" },
  { id: "area", label: "Área m2", minWidth: 50, align: "center" },
  { id: "total", label: "Total (S/)", minWidth: 50, align: "center" },
  { id: "importe_pagado", label: "Importe pagado (S/)", minWidth: 50, align: "center" },
]

const TablaReporteCuotasMetrado: React.FC = () => {

  const { isTablet, isMobile } = useResponsive();
  const [mostrarDetalles, setMostrarDetalles] = useState<string | null>(null);
  const [cuotasSelect, setCuotasSelect] = useState<Cuota[]>([]);
  const [cuotaSeleccionada, setCuotaSeleccionada] = useState<number>(0);
  const [cuotas, setCuotas] = useState<Data[]>([]);
  const [exportFormat, setExportFormat] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Paginación
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const [totalPaginas, setTotalPaginas] = useState<number>(1);

  const cambiarPagina = (event: React.ChangeEvent<unknown>, value: number) => {
    setPaginaActual(value);
    listarCuotas(value, cuotaSeleccionada);
  };


  // Obtener las cuotas
  useEffect(() => {
    const fetchCuotas = async () => {
      try {
        const response = await axios.get("https://mercadolasestrellas.online/intranet/public/v1/cuotas?per_page=50");
        setCuotasSelect(response.data.data);
      } catch (error) {
        console.log("Error:", error);
      }
    }
    fetchCuotas();
  }, []);

  // Listar cuotas por metrado
  const listarCuotas = async (pagina: number = 1, idCuota: number) => {
    setIsLoading(true)
    try {
      const response = await axios.get(`https://mercadolasestrellas.online/intranet/public/v1/reportes/cuota-por-metros?page=${pagina}&id_cuota=${idCuota}`);
      setCuotas(response.data.data);
      setTotalPaginas(response.data.meta.last_page);
      setPaginaActual(response.data.meta.current_page);
    } catch (error) {
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
              options={cuotasSelect}
              getOptionLabel={(cuota) => `${cuota.id_cuota} - ${formatDate(cuota.fecha_registro)}`}
              onChange={(event, value) => {
                if (value) {
                  setCuotaSeleccionada(Number(value.id_cuota));
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Seleccionar cuota"
                  InputProps={{ ...params.InputProps }}
                />
              )}
              ListboxProps={{
                style: {
                  maxHeight: 270,
                  overflow: 'auto',
                },
              }}
              isOptionEqualToValue={(option, value) => option.id_cuota === value.id_cuota}
            />
          </FormControl>
          {/* Botón "Generar Reporte" */}
          <BotonAgregar
            handleAction={() => listarCuotas(undefined, cuotaSeleccionada)}
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
        <LoadingSpinner /> // Mostrar el loading mientras se están cargando los datos
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
                        Lista de cuotas
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
                                    bgcolor: mostrarDetalles === cuota.numero_puesto ? "#f0f0f0" : "inherit",
                                    "&:hover": {
                                      cursor: "pointer",
                                      bgcolor: "#f0f0f0",
                                    }
                                  }}
                                  onClick={() => setMostrarDetalles(
                                    mostrarDetalles === cuota.numero_puesto ? null : cuota.numero_puesto
                                  )}
                                >
                                  {cuota.nombre_completo} - {cuota.numero_puesto}
                                </Typography>
                                {mostrarDetalles === cuota.numero_puesto && (
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
                                          {/* Mostrar los detalles de la deuda */}
                                          <Typography>
                                            {value}
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
                                  {value}
                                </TableCell>
                              );
                            })}
                        </TableRow>
                      ))
                    : <TableRow>
                      <TableCell colSpan={columns.length} align="center">
                        No hay datos para mostrar. <br />
                        Para generar el reporte, seleccione una cuota y de clic en el botón "GENERAR".
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

export default TablaReporteCuotasMetrado;