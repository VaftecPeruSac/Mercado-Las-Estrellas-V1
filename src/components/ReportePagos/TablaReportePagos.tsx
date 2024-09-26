import { Download, Person } from '@mui/icons-material';
import { Box, Button, Card, FormControl, InputLabel, MenuItem, Pagination, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery, useTheme } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react'

interface Column {
  id: keyof Data | "accion";
  label: string;
  minWidth?: number;
  align?: "center";
}

interface Data {
  id_pago: string;
  fecha_pago: string;
  numero_recibo: string;
  aporte: string;
  servicios: Array<{nombre: string; costo: string;}>;
  total: string;
}

const columns: readonly Column[] = [
  { id: "fecha_pago", label: "Fec. Pago", minWidth: 50, align: "center" },
  { id: "numero_recibo", label: "N° Recibo", minWidth: 50, align: "center" },
  { id: "aporte", label: "Aporte (S/)", minWidth: 50, align: "center" },
  { id: "servicios", label: "Servicios", minWidth: 50, align: "center" },
  { id: "total", label: "Total (S/)", minWidth: 50, align: "center" },
]

const initialRows: Data[] = [
  {
    id_pago: "1",
    fecha_pago: "04-09-2024",
    numero_recibo: "100002",
    aporte: "165.50",
    servicios: [
      {nombre: "Agua", costo: "30"}, 
      {nombre: "Luz", costo: "70"}, 
      {nombre: "Gas", costo: "20"}, 
      {nombre: "Vigilancia", costo: "30"},
      {nombre: "Renovación de luminaria", costo: "15.50"}
    ],
    total: "165.50",
  },
  {
    id_pago: "2",
    fecha_pago: "03-09-2024",
    numero_recibo: "100001",
    aporte: "150",
    servicios: [
      {nombre: "Agua", costo: "30"}, 
      {nombre: "Luz", costo: "70"}, 
      {nombre: "Gas", costo: "20"}, 
      {nombre: "Vigilancia", costo: "30"}
    ],
    total: "150",
  },
]

const TablaReportePagos: React.FC = () => {

  // Variables para el responsive
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mostrarDetalles, setMostrarDetalles] = useState<string | null>(null); 

  // Para la tabla
  const [rows, setRows] = useState<Data[]>(initialRows);
  const [page, setPage] = useState(0);
  const [rowsPage, setRowsPage] = useState(5);

  // Para exportar
  const [exportFormat, setExportFormat] = useState<string>("");

  // Metodo para generar el reporte de pagos de un socio
  const handleGenerarReporte = async (e: React.MouseEvent<HTMLButtonElement>) => {

    e.preventDefault();

    try {
      alert("En proceso de actualizacion.");
    } catch {
      alert("En proceso de actualizacion.");
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
        p: 3,
        pt: isMobile ? 16 : 10,
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
          p: 3,
          overflow: "auto",
          display: "-ms-inline-flexbox",
          margin: "0 auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
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
              width: isMobile ? "100%" : "auto",
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              alignItems: "center",
              ml: isMobile ? "0px" : "10px",
              mr: isMobile ? "0px" : "auto",
            }}
          >
            {/* Seleccionar socio */}
            <FormControl sx={{ width: isMobile ? "100%" : "400px" }} required>
              <InputLabel id="seleccionar-socio-label">
                Seleccionar Socio
              </InputLabel>
              <Select
                labelId="seleccionar-socio-label"
                label="Seleccionar Socio"
                startAdornment={<Person sx={{ mr: 1, color: "gray" }} />}
              >
                {/* Listado de socios */}
                <MenuItem value="1">Juanito Perez</MenuItem>
              </Select>
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
              onClick={handleGenerarReporte}
            >
              Generar
            </Button>
          </Box>
          <Box
            sx={{
              width: isMobile ? "100%" : "auto",
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
                width: isMobile ? "50%" : "150px",
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
                width: isMobile ? "50%" : "200px",
                borderRadius: "30px",
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
                  {isMobile
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
                {rows
                  .slice(page * rowsPage, page * rowsPage + rowsPage)
                  .map((row) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      {isMobile
                      ? <TableCell padding="checkbox" colSpan={columns.length}>
                          <Box sx={{ display: "flex", flexDirection: "column"}}>
                            <Typography 
                              sx={{ 
                                p: 2,
                                // Seleccionar el pago y cambiar el color de fondo
                                bgcolor: mostrarDetalles === row.id_pago ? "#f0f0f0" : "inherit",
                                "&:hover": {
                                  cursor: "pointer",
                                  bgcolor: "#f0f0f0",
                                }
                              }}
                              onClick={() => setMostrarDetalles(
                                mostrarDetalles === row.id_pago ? null : row.id_pago
                              )}
                            >
                              N°{row.numero_recibo} - {row.fecha_pago} - S/{row.total}
                            </Typography>
                            {mostrarDetalles === row.id_pago && (
                              <Box 
                                sx={{
                                  p: 2,
                                  display: "flex", 
                                  flexDirection: "column", 
                                  gap: 1 
                                }}
                              >
                                {columns.map((column) => {
                                  const value = column.id === "accion" ? "" : (row as any)[column.id];
                                  return (
                                    <Box>
                                      {/* Mostrar titulo del campo */}
                                      <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                                        {column.label}
                                      </Typography>
                                      {/* Mostrar los detalles del pago */}
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
                        const value = column.id === "accion" ? "" : (row as any)[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                          >
                            {column.id === "servicios" ? ((value as {nombre: string; costo: string}[])
                              .map((servicio, index) => (
                                <div key={index}>{servicio.nombre}: S/ {servicio.costo} </div>
                              ))) : (value)
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