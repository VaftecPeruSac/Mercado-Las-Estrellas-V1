import { Download } from '@mui/icons-material';
import { Autocomplete, Box, Button, Card, FormControl, MenuItem, Pagination, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import useResponsive from '../Responsive';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadingSpinner from '../PogressBar/ProgressBarV1';

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

const TablaReporteDeudas: React.FC = () => {
  const { isTablet, isSmallTablet, isMobile, isSmallMobile } = useResponsive();
  const [mostrarDetalles, setMostrarDetalles] = useState<string | null>(null);
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [puestoSeleccionado, setPuestoSeleccionado] = useState<number>(0);
  const [deudas, setDeudas] = useState<Data[]>([]);
  const [searchParams] = useSearchParams();
  const idPuesto = searchParams.get("puesto");
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate();

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const cambiarPagina = (event: React.ChangeEvent<unknown>, value: number) => {
    setPaginaActual(value);
    fetchDeudas(value, puestoSeleccionado);
  };

  // Si el parametro puesto existe, obtener las deudas del puesto
  useEffect(() => {
    if (idPuesto) {
      setPuestoSeleccionado(Number(idPuesto));
      fetchDeudas(undefined, Number(idPuesto));
    }
  }, [idPuesto]);

  // Para exportar
  const [exportFormat, setExportFormat] = useState<string>("");

  // Metodo para obtener los puestos
  useEffect(() => {
    const fetchPuestos = async () => {
      try {
        const response = await axios.get("https://mercadolasestrellas.online/intranet/public/v1/puestos?per_page=50");
        setPuestos(response.data.data);
      } catch (error) {
        console.log("Error:", error);
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
      console.log("Error:", error);
    } finally {
      setIsLoading(false); 
    }
  }

  // Metodo para exportar el reporte de deudas
  const handleExportReporteDeudas = async (e: React.MouseEvent<HTMLButtonElement>) => {

    e.preventDefault();

    try {
      const response = await axios.get("https://mercadolasestrellas.online/intranet/public/v1/reporte-deudas/exportar",
        {responseType: 'blob'}
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
        flexGrow: 1,
        p: isSmallMobile ? 2 : 3,
        pt: isSmallTablet || isMobile ? 16 : isSmallMobile ? 14 : 10,
        backgroundColor: "#f0f0f0",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflowX: "auto",
      }}
    >
      <Box sx={{ mb: 3 }}/>
      
      <Card
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: "30px",
          width: "100%",
          height: "100%",
          textAlign: "left",
          position: "relative",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          p: isSmallMobile ? 2 : 3,
          overflow: "auto",
          display: "-ms-inline-flexbox",
          margin: "0 auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: isTablet ? "column" : { xs: "column", sm: "row" }, // Columna en mobile, fila en desktop
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(0, 0, 0, 0.25)",
            mb: isMobile ? 2 : 3,
            p: 0,
            pb: 1,
          }}
        >
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
                    InputProps={{...params.InputProps }} // Propiedades del input
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
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#008001",
                "&:hover": {
                  backgroundColor: "#2c6d33",
                },
                height: "50px",
                width: isMobile ? "100%" : "150px",
                borderRadius: "30px",
              }}
              onClick={() => {
                fetchDeudas(undefined, puestoSeleccionado);
                navigate(`/home/reporte-deudas`);
              }}
            >
              Generar
            </Button>
          </Box>
          <Box
            sx={{
              width: isTablet || isMobile ? "100%" : "auto",
              display: "flex",
              gap: 2,
              alignItems: "center",
              ml: "auto",
              mt: 2,
              mb: 1
            }}
          >
            {/* Formulario para el Select "Exportar" */}
            <FormControl
              variant="outlined"
              sx={{
                width: isTablet || isMobile ? "50%" : "150px",
                height: "50px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#dcdcdc",
                  },
                  "&:hover fieldset": {
                    borderColor: "#dcdcdc",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#dcdcdc",
                    boxShadow: "none",
                  },
                },
              }}
            >
              <Select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as string)}
                displayEmpty
                sx={{
                  backgroundColor: "white",
                  "&:hover": {
                    backgroundColor: "#e0e0e0",
                  },
                  height: "50px",
                  width: "100%",
                  padding: "0 15px",
                  borderRadius: "30px",
                  color: exportFormat ? "#000" : "#999",
                  "& .MuiSelect-icon": {
                    color: "#000",
                  },
                }}
              >
                <MenuItem disabled value="">
                  Exportar
                </MenuItem>
                <MenuItem value="1">PDF</MenuItem>
                <MenuItem value="2">Excel</MenuItem>
              </Select>
            </FormControl>

            {/* Botón "Descargar" */}
            <Button
              variant="contained"
              startIcon={<Download />}
              sx={{
                backgroundColor: "#008001",
                "&:hover": {
                  backgroundColor: "#2c6d33",
                },
                height: "50px",
                width: isTablet || isMobile ? "50%" : "200px",
                borderRadius: "30px",
                fontSize: isMobile ? "0.8rem" : "auto"
              }}
              disabled={ exportFormat === "" }
              onClick={handleExportReporteDeudas}
            >
              Descargar
            </Button>
          </Box>
        </Box>
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
                          <Box sx={{ display: "flex", flexDirection: "column"}}>
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
      </Card>
    </Box>
  )

}

export default TablaReporteDeudas;