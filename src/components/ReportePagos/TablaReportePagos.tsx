import { Autocomplete, Box, FormControl, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import useResponsive from '../../hooks/Responsive/useResponsive';
import { useSearchParams } from 'react-router-dom';
import LoadingSpinner from '../PogressBar/ProgressBarV1';
import Contenedor from '../Shared/Contenedor';
import BotonExportar from '../Shared/BotonExportar';
import BotonAgregar from '../Shared/BotonAgregar';
import ContenedorBotones from '../Shared/ContenedorBotones';

interface Socio {
  id_socio: string;
  nombre_completo: string;
}

interface Column {
  id: keyof Data | "accion";
  label: string;
  minWidth?: number;
  align?: "center";
}

interface Data {
  id_pago: string;
  numero: string;
  serie: string;
  serie_numero: string;
  aporte: string;
  total: string;
  fecha: string;
  detalle_pagos: {
    descripcion: string;
    importe: string;
  }
}

const columns: readonly Column[] = [
  // { id: "numero", label: "N° Pago", minWidth: 50, align: "center" },
  { id: "id_pago", label: "N° Pago", minWidth: 50, align: "center" },
  // { id: "serie", label: "N° Serie", minWidth: 50, align: "center" },
  { id: "serie_numero", label: "N° Serie", minWidth: 50, align: "center" },
  { id: "fecha", label: "Fec. Pago", minWidth: 50, align: "center" },
  { id: "aporte", label: "Aporte (S/)", minWidth: 50, align: "center" },
  { id: "total", label: "Total (S/)", minWidth: 50, align: "center" },
  { id: "detalle_pagos", label: "Detalle Pago", minWidth: 50, align: "center" },
]

const TablaReportePagos: React.FC = () => {
  const { isTablet, isMobile } = useResponsive();
  const [mostrarDetalles, setMostrarDetalles] = useState<string | null>(null);
  const [socios, setSocios] = useState<Socio[]>([]);
  const [socioSeleccionado, setSocioSeleccionado] = useState<number>(0);
  const [pagos, setPagos] = useState<Data[]>([]);
  const [exportFormat, setExportFormat] = useState<string>("");
  const [searchParams] = useSearchParams();
  const idSocio = searchParams.get("socio");
  const [isLoading, setIsLoading] = useState(false);

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const cambiarPagina = (event: React.ChangeEvent<unknown>, value: number) => {
    setPaginaActual(value);
    fetchPagos(value, socioSeleccionado);
  };

  // Si el parametro puesto existe, obtener las deudas del puesto
  useEffect(() => {
    if (idSocio) {
      setSocioSeleccionado(Number(idSocio));
      fetchPagos(undefined, Number(idSocio));
    }
  }, [idSocio]);

  // Metodo para obtener los socios
  useEffect(() => {
    const fetchSocios = async () => {
      try {
        const response = await axios.get("https://mercadolasestrellas.online/intranet/public/v1/socios?per_page=100");
        setSocios(response.data.data);
      } catch (error) {
        console.log("Error:", error);
      }
    }
    fetchSocios();
  }, []);

  // Metodo para obtener los pagos realizados por un socio
  const fetchPagos = async (pagina: number = 1, idSocio: number) => {
    setIsLoading(true)
    try {
      const response = await axios.get(`https://mercadolasestrellas.online/intranet/public/v1/reportes/pagos?page=${pagina}&id_socio=${idSocio}`);
      setPagos(response.data.data);
      setTotalPaginas(response.data.meta.last_page);
      setPaginaActual(response.data.meta.current_page);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Metodo para exportar el reporte de pagos
  const handleExportReporteDeudas = async (e: React.MouseEvent<HTMLButtonElement>) => {

    e.preventDefault();

    try {
      const response = await axios.get("https://mercadolasestrellas.online/intranet/public/v1/reporte-pagos/exportar");
      // Si no hay problemas
      if (response.status === 200) {
        if (exportFormat === "1") { // PDF
          alert("En proceso de actualizacion. Intentelo más tarde.");
        } else if (exportFormat === "2") { // Excel
          alert("El reporte de pagos se descargará en breve.");
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          const hoy = new Date();
          const formatDate = hoy.toISOString().split('T')[0];
          link.setAttribute('download', `reporte-pagos-${formatDate}.xlsx`); // Nombre del archivo
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
          <FormControl fullWidth required
            sx={{
              width: isTablet ? "70%" : isMobile ? "100%" : "300px"
            }}
          >
            <Autocomplete
              options={socios}
              getOptionLabel={(socio) => socio.nombre_completo} // Mostrar el nombre completo del socio
              onChange={(event, value) => { // Obtener el id del socio seleccionado
                if (value) { // Si se selecciona un socio
                  setSocioSeleccionado(Number(value.id_socio)); // Guardar el id del socio
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Seleccionar socio" // Etiqueta del input
                  InputProps={{ ...params.InputProps }} // Propiedades del input
                />
              )}
              ListboxProps={{
                style: {
                  maxHeight: 270, // Altura máxima de la lista de opciones
                  overflow: 'auto', // Hacer scroll si hay muchos elementos
                },
              }}
              isOptionEqualToValue={(option, value) => option.id_socio === value.id_socio}
            />
          </FormControl>
          {/* Botón "Generar Reporte" */}
          <BotonAgregar
            exportar
            handleAction={() => fetchPagos(undefined, socioSeleccionado)}
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
          {/* Tabla reporte pagos */}
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
                        Lista de Pagos
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
                  {pagos.length > 0
                    ? pagos
                      .map((pago) => (
                        <TableRow hover role="checkbox" tabIndex={-1}>
                          {isTablet || isMobile
                            ? <TableCell padding="checkbox" colSpan={columns.length}>
                              <Box sx={{ display: "flex", flexDirection: "column" }}>
                                <Typography
                                  sx={{
                                    p: 2,
                                    // Seleccionar el pago y cambiar el color de fondo
                                    bgcolor: mostrarDetalles === pago.numero ? "#f0f0f0" : "inherit",
                                    "&:hover": {
                                      cursor: "pointer",
                                      bgcolor: "#f0f0f0",
                                    }
                                  }}
                                  onClick={() => setMostrarDetalles(
                                    mostrarDetalles === pago.numero ? null : pago.numero
                                  )}
                                >
                                  N°{pago.numero} - {pago.fecha} - S/{pago.total}
                                </Typography>
                                {mostrarDetalles === pago.numero && (
                                  <Box
                                    sx={{
                                      p: 2,
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: 1
                                    }}
                                  >
                                    {columns.map((column) => {
                                      const value = column.id === "accion" ? "" : (pago as any)[column.id];
                                      return (
                                        <Box>
                                          {/* Mostrar titulo del campo */}
                                          <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                                            {column.label}
                                          </Typography>
                                          {/* Mostrar los detalles del pago */}
                                          {Array.isArray(value) // Si es un array de servicios
                                            ? (value.map((detalle, index) => ( // Mostrar los servicios
                                              <Typography key={index}>
                                                {detalle.descripcion}: S/ {detalle.importe}
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
                              const value = column.id === "accion" ? "" : (pago as any)[column.id];
                              return (
                                <TableCell
                                  key={column.id}
                                  align={column.align}
                                >
                                  {Array.isArray(value) ? (value.map((detalle, index) => ( // Mostrar los servicios
                                    <Typography textAlign="left" key={index}>
                                      {detalle.descripcion}: S/ {detalle.importe}
                                    </Typography>
                                  ))
                                  ) : (value)
                                  }
                                </TableCell>
                              );
                            })}
                        </TableRow>
                      ))
                    : <TableRow>
                      <TableCell colSpan={columns.length} align="center">
                        No hay datos para mostrar. <br />
                        Para generar el reporte, seleccione un socio y de clic en el botón "GENERAR".
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
  );

}

export default TablaReportePagos;