import * as React from "react";
import { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Typography,
  Box,
  Card,
  Stack,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  Modal,
} from "@mui/material";
import { Edit, Download, FileCopy, WhatsApp, PictureAsPdf, Print, Upload, FolderShared, Payments, Plagiarism, SaveAlt, SaveAs } from "@mui/icons-material";
import { GridAddIcon } from "@mui/x-data-grid";
import axios from "axios";
import Agregar from "./Agregar";
import Pagar from "./Pagar";



interface Column {
  id: keyof Data | "accion";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: any) => string;
}

interface Data {
  socio: string;
  puesto: string;
  dni: string;
  block: string;
  giro: string;
  telefono: string;
  correo: string;
  inquilino: string;
  cuotas_extra: string;
  fecha: string;
  pagar: string;
  deuda_total: string;
}

const columns: readonly Column[] = [
  { id: "socio", label: "Socio", minWidth: 50 },  // Reduce el minWidth
  { id: "puesto", label: "Puesto", minWidth: 50 },
  { id: "dni", label: "DNI", minWidth: 50 },
  { id: "block", label: "Block", minWidth: 50 },
  { id: "giro", label: "Giro", minWidth: 50 },
  { id: "telefono", label: "Teléfono", minWidth: 50 },
  { id: "correo", label: "Correo", minWidth: 50 }, // Puedes reducir aún más si es necesario
  { id: "inquilino", label: "Inquilino", minWidth: 50 },
  { id: "cuotas_extra", label: "Cuotas Extraordinarias", minWidth: 50 },
  { id: "fecha", label: "Fecha", minWidth: 50 },
  { id: "pagar", label: "Pagar", minWidth: 50 },
  { id: "deuda_total", label: "Deuda Total", minWidth: 50 },
  { id: "accion", label: "Acción", minWidth: 20 }, // Puede ajustarse según las acciones disponibles
];

const rows: Data[] = [
  {
    socio: "Juan Ramiro",
    puesto: "A-4",
    dni: "772834491",
    block: "1",
    giro: "Carne",
    telefono: "912345678",
    correo: "juan1123@example.com",
    inquilino: "Sí",
    cuotas_extra: "500",
    fecha: "2024",
    pagar: "No",
    deuda_total: "1200",
  },
  {
    socio: "Alberth Gonzales",
    puesto: "A-3",
    dni: "772834492",
    block: "2",
    giro: "Abarrotes",
    telefono: "912345679",
    correo: "gonzales123@example.com",
    inquilino: "No",
    cuotas_extra: "300",
    fecha: "2024",
    pagar: "Sí",
    deuda_total: "2300",
  },
];

export default function StickyHeadTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);
  const [exportFormat, setExportFormat] = React.useState("");
  const [openPagar, setOpenPagar] = useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleExport = () => {
    // Implement your export logic here
    console.log(`Exporting as ${exportFormat}`);
  };


  const handleOpenPagar = () => setOpenPagar(true);
  const handleClosePagar = () => setOpenPagar(false);

  const [socios, setSocios] = useState<Data[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://rickandmortyapi.com/api/character/14");
      setSocios(response.data);
      console.log("Los datos son", response.data)
    } catch (error) {
      console.error("Error al traer dato", error);
    }
  };

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
        {/* Título opcional */}
      </Box>

      <Card
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: "30px",
          width: "100%",
          height: "100%",
          textAlign: "left",
          position: "relative",
          transition: "all 0.3s ease",
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
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
            P: 0
          }}
        >
          <Button
            variant="contained"
            startIcon={<GridAddIcon />}
            sx={{
              backgroundColor: "#388e3c",
              "&:hover": {
                backgroundColor: "#2c6d33",
              },
              height: "40px",
              minWidth: "120px",
              marginBottom: { xs: 2, sm: 0 },
              borderRadius: "30px",
            }}
            onClick={handleOpen}
          >
            Agregar Socio
          </Button>
          <Agregar open={open} handleClose={handleClose} />
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              ml: "auto",
            }}
          >
            <FormControl
              variant="outlined"
              sx={{
                minWidth: 130,
                height: "37px",
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#dcdcdc', // Color del borde inicial (gris claro)
                  },
                  '&:hover fieldset': {
                    borderColor: '#dcdcdc', // Color del borde al hacer hover (gris claro)
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#dcdcdc', // Color del borde cuando está enfocado (gris claro)
                    boxShadow: 'none', // Elimina la sombra del enfoque
                  },
                },
              }}
            >
              <Select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                displayEmpty
                sx={{
                  backgroundColor: "white", // Color de fondo suave y clásico
                  "&:hover": {
                    backgroundColor: "#e0e0e0", // Cambio sutil al hacer hover
                  },
                  height: "37px",
                  minWidth: "120px",
                  borderRadius: "30px",
                  color: exportFormat ? "#000" : "#999", // Texto negro si hay selección, gris si es el placeholder
                  '& .MuiSelect-icon': {
                    color: '#000', // Color del icono del menú desplegable
                  },
                }}
              >
                <MenuItem disabled value="">
                  Exportar
                </MenuItem>
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="word">Excel</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              startIcon={<Print />}
              sx={{
                backgroundColor: "#388e3c",
                "&:hover": {
                  backgroundColor: "#2c6d33",
                },
                height: "40px",
                minWidth: "170px", // Botón más largo que el Select
                borderRadius: "30px",
              }}
            >
              Imprimir
            </Button>
          </Box>
        </Box>
        <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 'none' }}>
          <TableContainer sx={{ maxHeight: '100%', borderRadius: '5px', border: 'none' }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                      sx={{
                        backgroundColor: column.id === 'deuda_total' ? '#f8d7da' : undefined,
                        color: column.id === 'deuda_total' ? '#721c24' : undefined,
                        fontWeight: 'bold',
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
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.socio}>
                      {columns.map((column) => {
                        const value = column.id === 'accion' ? '' : (row as any)[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            sx={{
                              backgroundColor: column.id === 'deuda_total' ? '#f8d7da' : undefined,
                              color: column.id === 'deuda_total' ? '#721c24' : undefined,
                            }}
                          >
                            {column.id === 'cuotas_extra' ? (
                              <Box sx={{ display: 'flex' }}>
                                <IconButton aria-label="edit" sx={{ color: 'black' }}>
                                  <SaveAs />
                                </IconButton>
                                <IconButton aria-label="edit" sx={{ color: 'black' }}>
                                  <Plagiarism />
                                </IconButton>
                              </Box>
                            ) : column.id === 'pagar' ? (
                              <IconButton aria-label="payment" sx={{ color: 'green' }} onClick={handleOpenPagar}>
                                <Payments />
                              </IconButton>
                            ) : column.id === 'accion' ? (
                              <Box sx={{ display: 'flex' }}>
                                <IconButton aria-label="edit" sx={{ color: 'black' }}>
                                  <Plagiarism />
                                </IconButton>
                                <IconButton aria-label="copy" sx={{ color: 'black' }}>
                                  <Download />
                                </IconButton>
                                <IconButton aria-label="whatsapp" sx={{ color: 'green' }}>
                                  <WhatsApp />
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

          <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginTop: 3 }}>
            <Pagination count={10} color="primary" sx={{ marginLeft: '25%' }} />
          </Box>
        </Paper>
        <Pagar open={openPagar} handleClose={handleClosePagar} />
      </Card >

    </Box >
  );
}
