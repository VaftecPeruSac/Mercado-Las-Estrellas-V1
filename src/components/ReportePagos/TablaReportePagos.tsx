import { Download } from '@mui/icons-material';
import { Autocomplete, Box, Button, Card, FormControl, MenuItem, Pagination, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import useResponsive from '../Responsive';

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
  numero: string;
  serie: string;
  aporte: string;
  total: string;
  fecha: string;
  detalle_pagos: {
    descripcion: string; 
    importe: string;
  }
}

const columns: readonly Column[] = [
  { id: "numero", label: "N° Pago", minWidth: 50, align: "center" },
  { id: "serie", label: "N° Serie", minWidth: 50, align: "center" },
  { id: "fecha", label: "Fec. Pago", minWidth: 50, align: "center" },
  { id: "aporte", label: "Aporte (S/)", minWidth: 50, align: "center" },
  { id: "total", label: "Total (S/)", minWidth: 50, align: "center" },
  { id: "detalle_pagos", label: "Detalle Pago", minWidth: 50, align: "center" },
]

const TablaReportePagos: React.FC = () => {

  // Variables para el responsive
  const { isTablet, isSmallTablet, isMobile, isSmallMobile } = useResponsive();
  const [mostrarDetalles, setMostrarDetalles] = useState<string | null>(null); 

  // Para seleccionar el socio
  const [socios, setSocios] = useState<Socio[]>([]);
  const [socioSeleccionado, setSocioSeleccionado] = useState<number>(0);

  // Para la tabla
  const [pagos, setPagos] = useState<Data[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPage, setRowsPage] = useState(5);

  // Para exportar
  const [exportFormat, setExportFormat] = useState<string>("");

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
  const fetchPagos = async (idSocio: number) => {
    try {
      const response = await axios.get(`https://mercadolasestrellas.online/intranet/public/v1/reportes/pagos?id_socio=${idSocio}`);
      setPagos(response.data.data);
    } catch (error) {
      console.log("Error:", error);
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
            pb: 1
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
                    InputProps={{...params.InputProps }} // Propiedades del input
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
              onClick={(e) => fetchPagos(socioSeleccionado)}
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
                {pagos
                  .slice(page * rowsPage, page * rowsPage + rowsPage)
                  .map((pago) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      {isTablet || isMobile
                      ? <TableCell padding="checkbox" colSpan={columns.length}>
                          <Box sx={{ display: "flex", flexDirection: "column"}}>
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
                                      )  : (value)
                            }
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}>
            <Pagination count={3} color="primary"/>
          </Box>
        </Paper>
      </Card>
    </Box>
  );

}

export default TablaReportePagos;