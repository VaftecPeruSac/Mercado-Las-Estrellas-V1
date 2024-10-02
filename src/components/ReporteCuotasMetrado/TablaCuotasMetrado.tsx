import React, { useEffect, useState } from 'react'
import useResponsive from '../Responsive';
import { Autocomplete, Box, Button, Card, FormControl, MenuItem, Pagination, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { Download } from '@mui/icons-material';
import axios from 'axios';

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

  // Variables para el responsive
  const { isTablet, isSmallTablet, isMobile, isSmallMobile } = useResponsive();
  const [mostrarDetalles, setMostrarDetalles] = useState<string | null>(null);

  // Para el select
  const [cuotasSelect, setCuotasSelect] = useState<Cuota[]>([]);
  const [cuotaSeleccionada, setCuotaSeleccionada] = useState<number>(0);

  // Para la tabla
  const [cuotas, setCuotas] = useState<Data[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPage, setRowsPage] = useState(5);

  // Para exportar
  const [exportFormat, setExportFormat] = useState<string>("");

  // Para el formato de fecha
  const formatDate = (date: string) => {
    const fecha = new Date(date);
    const mes = fecha.getMonth() + 1 < 10 ? `0${fecha.getMonth() + 1}` : fecha.getMonth() + 1;
    const dia = fecha.getDate() < 10 ? `0${fecha.getDate()}` : fecha.getDate();
    return `${dia}/${mes}/${fecha.getFullYear()}`;
  }

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
  const listarCuotas = async (idCuota: number) => {
    try {
      const response = await axios.get(`https://mercadolasestrellas.online/intranet/public/v1/reportes/cuota-por-metros?id_cuota=${idCuota}`);
      setCuotas(response.data.data);
    } catch (error) {
      console.log("Error:", error);
    }
  }

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
            flexDirection: isTablet ? "column" : { xs: "column", sm: "row" },
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
                    InputProps={{...params.InputProps }}
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
              onClick={(e) => {
                listarCuotas(cuotaSeleccionada);
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
              // onClick={handleExportReporteDeudas}
            >
              Descargar
            </Button>
          </Box>
        </Box>

        {/* Tabla reporte cuotas por metrado */}
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
                  .slice(page * rowsPage, page * rowsPage + rowsPage)
                  .map((cuota) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      {isTablet || isMobile
                      ? <TableCell padding="checkbox" colSpan={columns.length}>
                          <Box sx={{ display: "flex", flexDirection: "column"}}>
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
            <Pagination count={3} color="primary" />
          </Box>
        </Paper>
      </Card>
    </Box>
  )
}

export default TablaReporteCuotasMetrado;