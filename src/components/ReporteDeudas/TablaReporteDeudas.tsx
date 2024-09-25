import { Download, Person } from '@mui/icons-material';
import { Box, Button, Card, FormControl, InputLabel, MenuItem, Pagination, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery, useTheme } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react'

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
  servicios: Array<{nombre: string; costo: string;}>;
  total: string;
  pagado: string;
  por_pagar: string;
}

const columns: readonly Column[] = [
  { id: "id_cuota", label: "#ID CUOTA", minWidth: 50, align: "center" },
  { id: "anio", label: "Año", minWidth: 50, align: "center" },
  { id: "mes", label: "Mes", minWidth: 50, align: "center" },
  { id: "servicios", label: "Desc. Servicios por Cuota", minWidth: 50, align: "center" },
  { id: "total", label: "Total (S/)", minWidth: 50, align: "center" },
  { id: "pagado", label: "Imp. Pagado (S/)", minWidth: 50, align: "center" },
  { id: "por_pagar", label: "Imp. Por pagar (S/)", minWidth: 50, align: "center" },
]

const initialRows: Data[] = [
  {
    id_cuota: "1",
    anio: "2024",
    mes: "SEPTIEMBRE",
    servicios: [
      {nombre: "Agua", costo: "30"}, 
      {nombre: "Luz", costo: "70"}, 
      {nombre: "Gas", costo: "20"}, 
      {nombre: "Vigilancia", costo: "30"}
    ],
    total: "150",
    pagado: "70",
    por_pagar: "80",
  },
]

const TablaReporteDeudas: React.FC = () => {

  // Variables para el responsive
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Para la tabla
  const [rows, setRows] = useState<Data[]>(initialRows);
  const [page, setPage] = useState(0);
  const [rowsPage, setRowsPage] = useState(5);

  // Para exportar
  const [exportFormat, setExportFormat] = useState<string>("");

  // Metodo para generar el reporte de deudas de un socio
  const handleGenerarReporte = async (e: React.MouseEvent<HTMLButtonElement>) => {

    e.preventDefault();

    try {
      alert("En proceso de actualizacion.");
    } catch {
      alert("En proceso de actualizacion.");
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
            pb: 1,
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
              mt: 2 ,
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

        {/* Tabla reporte deudas */}
        <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: "none" }}>
          <TableContainer
            sx={{ maxHeight: "100%", borderRadius: "5px", border: "none" }}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
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
                    <TableRow>
                      {columns.map((column) => {
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
          <Box sx={{ display: "flex", justifyContent: "flex-start", marginTop: 3 }}>
            <Pagination count={10} color="primary" sx={{ marginLeft: "25%" }} />
          </Box>
        </Paper>
      </Card>
    </Box>
  )

}

export default TablaReporteDeudas;