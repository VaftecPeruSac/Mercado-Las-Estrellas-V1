import React, { useEffect, useState } from 'react'
import { Autocomplete, Box, Button, FormControl, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import useResponsive from '../hooks/Responsive/useResponsive';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from './PogressBar/ProgressBarV1';
import BotonAgregar from './Shared/BotonAgregar';
import BotonExportar from './Shared/BotonExportar';
import { KeyboardReturn } from '@mui/icons-material';
import ContenedorBotones from './Shared/ContenedorBotones';

interface Puesto {
  id_puesto: string;
  numero_puesto: string;
}

interface Column {
  id: keyof Data | "accion";
  label: string;
  minWidth?: number;
  align?: "center";
}

interface Data {
  id_cuota: string;
  anio: string;
  mes: string;
  servicio_descripcion: string;
  total: string;
  importe_pagado: string;
  importe_por_pagar: string;
}

const columns: readonly Column[] = [
  { id: "id_cuota", label: "#ID", minWidth: 50, align: "center" },
  { id: "anio", label: "Año", minWidth: 50, align: "center" },
  { id: "mes", label: "Mes", minWidth: 50, align: "center" },
  { id: "servicio_descripcion", label: "Servicios", minWidth: 50, align: "center" },
  { id: "total", label: "Total (S/)", minWidth: 50, align: "center" },
  { id: "importe_pagado", label: "Imp. Pagado (S/)", minWidth: 50, align: "center" },
  { id: "importe_por_pagar", label: "Imp. Por pagar (S/)", minWidth: 50, align: "center" },
]

const BusquedaRapida = () => {

  const { isTablet, isMobile } = useResponsive();
  const [mostrarDetalles, setMostrarDetalles] = useState<string | null>(null);
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [puestoSeleccionado, setPuestoSeleccionado] = useState<number>(0);
  const [deudas, setDeudas] = useState<Data[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const cambiarPagina = (event: React.ChangeEvent<unknown>, value: number) => {
    setPaginaActual(value);
    fetchDeudas(value, puestoSeleccionado);
  };

  // Para exportar
  const [exportFormat, setExportFormat] = useState<string>("");

  // Metodo para obtener los puestos
  useEffect(() => {
    const fetchPuestos = async () => {
      try {
        const response = await axios.get("https://mercadolasestrellas.online/intranet/public/v1/puestos?per_page=50");
        setPuestos(response.data.data);
      } catch (error) {
      }
    }
    fetchPuestos();
  }, []);

  // Metodo para obtener las deudas de un puesto
  const fetchDeudas = async (pagina: number = 1, idPuesto: number) => {
    setIsLoading(true)
    try {
      const response = await axios.get(`https://mercadolasestrellas.online/intranet/public/v1/reportes/deudas?page=${pagina}&id_puesto=${idPuesto}`);
      setDeudas(response.data.data);
      setTotalPaginas(response.data.meta.last_page);
      setPaginaActual(response.data.meta.current_page);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }

  // Metodo para exportar el reporte de deudas
  const handleExportReporteDeudas = async (e: React.MouseEvent<HTMLButtonElement>) => {

    e.preventDefault();

    try {
      const response = await axios.get("https://mercadolasestrellas.online/intranet/public/v1/reporte-deudas/exportar",
        { responseType: 'blob' }
      );

      // Si no hay problemas
      if (response.status === 200) {
        if (exportFormat === "1") { // PDF
          alert("En proceso de actualizacion. Intentelo más tarde.");
        } else if (exportFormat === "2") { // Excel
          alert("El reporte de deudas se descargará en breve.");
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          const hoy = new Date();
          const formatDate = hoy.toISOString().split('T')[0];
          link.setAttribute('download', `reporte-deudas-${formatDate}.xlsx`); // Nombre del archivo
          document.body.appendChild(link);
          link.click();
          link.parentNode?.removeChild(link);
          setExportFormat("");
        } else {
          alert("Formato de exportación no válido.");
        }
      } else {
        alert("Ocurrio un error al exportar. Intentelo nuevamente más tarde.");
      }

    } catch (error) {
      console.log("Error:", error);
      alert("Ocurrio un error al exportar. Intentelo nuevamente más tarde.");
    }

  };

  return (
    <Box
      sx={{
        p: 4
      }}
    >
      <Box
        sx={{
          p: 3,
          borderRadius: "10px",
          boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.5)",
        }}
      >
        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              textTransform: "uppercase",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Busqueda rapida - Reporte de deudas
          </Typography>
          <Button
            variant="contained"
            color="error"
            sx={{
              position: "absolute",
              right: 0,
              width: "200px",
              height: "50px",
              borderRadius: "30px",
            }}
            startIcon={<KeyboardReturn />}
            onClick={() => navigate("/")}
          >
            Regresar
          </Button>
        </Box>
        <Box>
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
              {/* Seleccionar puesto */}
              <FormControl fullWidth required
                sx={{
                  width: isTablet ? "70%" : isMobile ? "100%" : "300px"
                }}
              >
                <Autocomplete
                  options={puestos}
                  getOptionLabel={(puesto) => puesto.numero_puesto} // Mostrar el numero del puesto
                  onChange={(event, value) => { // Obtener el id del puesto seleccionado
                    if (value) { // Si se selecciona un puesto
                      setPuestoSeleccionado(Number(value.id_puesto)); // Guardar el id del puesto
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Seleccionar puesto" // Etiqueta del input
                      InputProps={{ ...params.InputProps }} // Propiedades del input
                    />
                  )}
                  ListboxProps={{
                    style: {
                      maxHeight: 270, // Altura máxima de la lista de opciones
                      overflow: 'auto', // Hacer scroll si hay muchos elementos
                    },
                  }}
                  isOptionEqualToValue={(option, value) => option.id_puesto === value.id_puesto}
                />
              </FormControl>
              {/* Botón "Generar Reporte" */}
              <BotonAgregar
                exportar
                handleAction={() => fetchDeudas(undefined, puestoSeleccionado)}
                texto="Generar"
              />
            </Box>

            <BotonExportar
              exportFormat={exportFormat}
              setExportFormat={setExportFormat}
              handleExport={handleExportReporteDeudas}
            />

          </ContenedorBotones>
          {isLoading ? (
            <LoadingSpinner /> // Mostrar el loading mientras se están cargando los datos
          ) : (
            <>
              {/* Tabla reporte deudas */}
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
                      {deudas.length > 0
                        ? deudas
                          .map((deuda) => (
                            <TableRow hover role="checkbox" tabIndex={-1}>
                              {isTablet || isMobile
                                ? <TableCell padding="checkbox" colSpan={columns.length}>
                                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                                    <Typography
                                      sx={{
                                        p: 2,
                                        // Seleccionar la deuda y cambiar el color de fondo
                                        bgcolor: mostrarDetalles === deuda.id_cuota ? "#f0f0f0" : "inherit",
                                        "&:hover": {
                                          cursor: "pointer",
                                          bgcolor: "#f0f0f0",
                                        }
                                      }}
                                      onClick={() => setMostrarDetalles(
                                        mostrarDetalles === deuda.id_cuota ? null : deuda.id_cuota
                                      )}
                                    >
                                      {deuda.mes} - {deuda.anio} - S/{deuda.total}
                                    </Typography>
                                    {mostrarDetalles === deuda.id_cuota && (
                                      <Box
                                        sx={{
                                          p: 2,
                                          display: "flex",
                                          flexDirection: "column",
                                          gap: 1
                                        }}
                                      >
                                        {columns.map((column) => {
                                          const value = column.id === "accion" ? "" : (deuda as any)[column.id];
                                          return (
                                            <Box>
                                              {/* Mostrar titulo del campo */}
                                              <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                                                {column.label}
                                              </Typography>
                                              {/* Mostrar los detalles de la deuda */}
                                              {Array.isArray(value) // Si es un array de servicios
                                                ? (value.map((servicio, index) => ( // Mostrar los servicios
                                                  <Typography key={index}>
                                                    {servicio.nombre}: S/ {servicio.costo}
                                                  </Typography>
                                                ))
                                                ) : <Typography>
                                                  {value}
                                                </Typography>
                                              }
                                            </Box>
                                          )
                                        })}
                                      </Box>
                                    )}
                                  </Box>
                                </TableCell>
                                : columns.map((column) => {
                                  const value = column.id === "accion" ? "" : (deuda as any)[column.id];
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
                    color="primary" />
                </Box>
              </Paper>
            </>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default BusquedaRapida;