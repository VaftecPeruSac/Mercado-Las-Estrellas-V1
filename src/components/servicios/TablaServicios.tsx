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





interface Column {
  id: keyof Data | "accion";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: any) => string;
}

interface Data {
  numero: string;
  cuota_extra: string;
  costo_uni: string;
  fecha: string;
}

const columns: readonly Column[] = [
  { id: "numero", label: "#ID", minWidth: 50 },  // Reduce el minWidth
  { id: "cuota_extra", label: "Cuota Extraordinaria", minWidth: 50 },
  { id: "costo_uni", label: "Costo Unitario", minWidth: 50 },
  { id: "fecha", label: "Fecha de Registro", minWidth: 50 },

  { id: "accion", label: "Acción", minWidth: 20 }, // Puede ajustarse según las acciones disponibles
];

const rows: Data[] = [
  {
    numero: "1",
    cuota_extra: "200",
    costo_uni: "100",
    fecha: "2024",

  },
  {
    numero: "2",
    cuota_extra: "300",
    costo_uni: "100",
    fecha: "2024",
  },
];

const TablaServicios: React.FC = () => {
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

  // const [puestos, setPuestos] = useState<Data[]>([]);

  // useEffect(() => {
  //   fetchData();
  // }, []);

  // const fetchData = async () => {
  //   try {
  //     const response = await axios.get("http://127.0.0.1:8000/v1/puestos");
  //     const data = response.data.data.map((item: Puestos) => ({
  //       socio: item.persona.nombre,
  //       puesto: item.nombre,
  //       dni: item.persona.dni,
  //       block: item.id_block.toString(),
  //       // giro: "", // No hay información de giro en la API
  //       // telefono: "", // No hay información de teléfono en la API
  //       correo: item.socio.correo,
  //       // inquilino: "", // No hay información de inquilino en la API
  //       // cuotas_extra: "", // No hay información de cuotas_extra en la API
  //       // fecha: "", // No hay información de fecha en la API
  //       // pagar: "", // No hay información de pagar en la API
  //       // deuda_total: "", // No hay información de deuda_total en la API
  //     }));
  //     setPuestos(data);
  //     console.log("la data es", response.data)
  //   } catch (error) {
  //     console.error("Error al traer datos", error);
  //   }
  // };

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
              // textTransform: "none",
            }}
            onClick={handleOpen}
          >

            Agregar Servicio
          </Button>
          {/* <Agregar open={open} handleClose={handleClose} /> */}
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
                        //   backgroundColor: column.id === 'deuda_total' ? '#f8d7da' : undefined,
                        //   color: column.id === 'deuda_total' ? '#721c24' : undefined,
                        fontWeight: 'bold',
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              {/* <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.numero}>
                      {columns.map((column) => {
                        const value = column.id === 'accion' ? '' : (row as any)[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                          // sx={{
                          //   backgroundColor: column.id === 'deuda_total' ? '#f8d7da' : undefined,
                          //   color: column.id === 'deuda_total' ? '#721c24' : undefined,
                          // }}
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
              </TableBody> */}
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginTop: 3 }}>
            <Pagination count={10} color="primary" sx={{ marginLeft: '25%' }} />
          </Box>
        </Paper>
        {/* <Pagar open={openPagar} onClose={handleClosePagar} /> */}
      </Card >

    </Box >
  );
}

export default TablaServicios;
