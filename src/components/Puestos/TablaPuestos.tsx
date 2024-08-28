import { DeleteForever, Print, SaveAs } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  FormControl,
  IconButton,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { GridAddIcon } from '@mui/x-data-grid';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

interface Puestos {
  numero_puesto: string;
  area: string;
  estado: string;
  fecha_registro: string;
  socio: string;
  gironegocio_nombre: string;
  block_nombre: string;
  inquilino: string;
}

interface Column {
  id: keyof Data | "accion";
  label: string;
  minWidth?: number;
  align?: "center";
  format?: (value: any) => string;
}

interface Data {
  numero_puesto: string;
  area: string;
  estado: string;
  fecha_registro: string;
  socio: string;
  gironegocio_nombre: string;
  block_nombre: string;
  inquilino: string;
}

const columns: readonly Column[] = [
  { id: "block_nombre", label: "Bloque", minWidth: 50 },
  { id: "numero_puesto", label: "N° Puesto", minWidth: 50 },
  { id: "area", label: "Área", minWidth: 50 },
  { id: "gironegocio_nombre", label: "Giro de Negocio", minWidth: 50 },
  { id: "socio", label: "Socio", minWidth: 50 },
  { id: "inquilino", label: "Inquilino",  minWidth: 50},
  { id: "estado", label: "Estado", minWidth: 50},
  { id: "fecha_registro",  label: "Fecha Registro",  minWidth: 50 },
  { id: "accion", label: "Acciones", minWidth: 50 },
]


const TablaPuestos: React.FC = () => {

  // Para la tabla
  const [rows, setRows] = useState<Data[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Para el modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Para exportar la información
  const [exportFormat, setExportFormat] = useState<string>("");

  const handleExport = () => {
    console.log(`Exporting as ${exportFormat}`);
  };

  // Formato de fecha
  const formatDate = (fecha: string): string => {
    // Crear un objeto Date a partir de la cadena de fecha

    const date = new Date(fecha);

    // Obtener el día, mes y año
    const day = date.getDate();
    const month = date.getMonth() + 1; // Los meses en JavaScript son 0-indexados
    const year = date.getFullYear();

    // Formatear a dos dígitos para el día y el mes si es necesario
    const formattedDay = day.toString().padStart(2, "0");
    const formattedMonth = month.toString().padStart(2, "0");

    // Retornar la fecha en el formato "día mes año"
    return `${formattedDay}/${formattedMonth}/${year}`;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try{
      const response = await axios.get("https://mercadolasestrellas.online/intranet/public/v1/puestos"); //publico
      // const response = await axios.get("http://127.0.0.1:8000/v1/puestos"); //local

      const data = response.data.data.map((item: Puestos) => ({
        numero_puesto: item.numero_puesto,
        area: item.area,
        estado: item.estado,
        fecha_registro: formatDate(item.fecha_registro),
        // socio: item.socio,
        // gironegocio_nombre: item.gironegocio_nombre,
        // block_nombre: item.block_nombre,
        // inquilino: item.inquilino
      }));
      setRows(data);
      console.log("Datos recuperados con exito", response.data)
    } catch (error) {
      console.error("Error al traer datos", error);
    }
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        pt: 10,
        backgroundColor: "#f0f0f0",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflowX: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: 3,
        }}
      >
      </Box>
      
      <Card
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: "30px",
          width: "100%",
          height: "100%",
          textAlign: "center",
          position: "relative",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          p: 3,
          overflow: "auto",
          display: "-ms-inline-flexbox",
          margin: "0 auto",
          // Centra el Card horizontalmente y añade espacio a los lados
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            P: 0,
          }}
        >
          {/* Botón "Agregar Puesto" */}
          <Button
            variant="contained"
            startIcon={<GridAddIcon />}
            sx={{
              backgroundColor: "#008001",
              "&:hover": {
                backgroundColor: "#2c6d33",
              },
              height: "50px",
              width: "230px",
              borderRadius: "30px",
            }}
            onClick={handleOpen}
          >
            Agregar Puesto
          </Button>

          {/* <RegistrarPuesto open={open} handleClose={handleClose} /> */}

          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              ml: "auto",
            }}
          >

            {/* Formulario para el Select "Exportar" */}
            <FormControl
              variant="outlined"
              sx={{
                minWidth: "150px",
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
                  minWidth: "120px",
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
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="excel">Excel</MenuItem>
              </Select>
            </FormControl>

            {/* Botón "Imprimir" */}
            <Button
              variant="contained"
              startIcon={<Print />}
              sx={{
                backgroundColor: "#008001",
                "&:hover": {
                  backgroundColor: "#2c6d33",
                },
                height: "50px",
                width: "200px",
                borderRadius: "30px",
              }}
              onClick={handleExport}
            >
              Imprimir
            </Button>
          </Box>
        </Box>

        {/* Tabla */}
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
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                    >
                      {columns.map((column) => {
                        const value = column.id === "accion" ? "" : (row as any)[column.id];
                        return (
                          <TableCell key={column.id} align="center">
                            {/* Acciones */}
                            {column.id === "accion" ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 1,
                                  justifyContent: "center",
                                }}
                              >
                                <IconButton
                                  aria-label="save "
                                  sx={{ color: "#0478E3" }}
                                >
                                  <SaveAs />
                                </IconButton>
                                <IconButton
                                  aria-label="delete"
                                  sx={{ color: "red" }}
                                >
                                  <DeleteForever />
                                </IconButton>
                              </Box>
                            ) : (
                              value
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}>
            <Pagination count={10} color="primary" />
          </Box>
        </Paper>
      </Card>
    </Box>
  )
}

export default TablaPuestos;
