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
import {
  Edit,
  Download,
  FileCopy,
  WhatsApp,
  PictureAsPdf,
  Print,
  Upload,
  FolderShared,
  Payments,
  Plagiarism,
  SaveAlt,
  SaveAs,
} from "@mui/icons-material";
import { GridAddIcon } from "@mui/x-data-grid";
import axios from "axios";
import Agregar from "./Agregar";
import Pagar from "./Pagar";

  interface Socios {
    socio: string;        // Nombre del socio
    dni: string;
    block_nombre: string;
    numero_puesto: string;
    gironegocio_nombre: string;
    telefono: string;
    correo: string;
    inquilino: string;  
    fecha_registro: string;
    deuda: string;         // Indica si tiene deuda o no ("no" o "yes")
  }

interface Column {
  id: keyof Data | "accion";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: any) => string;
}
interface Data {
  socio: string;          // Nombre del socio
  dni: string;
  block_nombre: string;   // Nombre del bloque
  numero_puesto: string;  // Número del puesto
  gironegocio_nombre: string; // Nombre del giro de negocio
  telefono: string;
  correo: string;
  inquilino: string;  
  fecha_registro: string;
  deuda: string;          // Indica si tiene deuda o no ("no" o "yes")
  cuotas_extra: string;   // Cuotas extraordinarias
  pagar: string;          // Pagar
}

const columns: readonly Column[] = [
  { id: "socio", label: "Nombre", minWidth: 50 }, // Nombre del socio
  { id: "dni", label: "DNI", minWidth: 50 },      // DNI
  { id: "block_nombre", label: "Block", minWidth: 50 }, // Nombre del bloque
  { id: "numero_puesto", label: "Puesto", minWidth: 50 }, // Número del puesto
  { id: "gironegocio_nombre", label: "Giro", minWidth: 50 }, // Nombre del giro de negocio
  { id: "telefono", label: "Teléfono", minWidth: 50 },  // Teléfono
  { id: "correo", label: "Correo", minWidth: 50 },      // Correo
  { id: "inquilino", label: "Inquilino", minWidth: 50 }, // Inquilino
  { id: "fecha_registro", label: "Fecha", minWidth: 50 }, // Fecha de registro
  { id: "deuda", label: "Deuda Total", minWidth: 50 }, // Deuda total
  { id: "cuotas_extra", label: "Cuotas Extraordinarias", minWidth: 10 }, // Cuotas extraordinarias
  { id: "pagar", label: "Pagar", minWidth: 50 },      // Pagar
  { id: "accion", label: "Acción", minWidth: 20 },    // Acción
];



const TablaAsociados: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);
  const [exportFormat, setExportFormat] = React.useState("");
  const [openPagar, setOpenPagar] = useState<boolean>(false);
  // const [letra, numero] = puestos.block.nombre.split('-');
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleExport = () => {
    // Implement your export logic here
    console.log(`Exporting as ${exportFormat}`);
  };

  const handleOpenPagar = () => setOpenPagar(true);
  const handleClosePagar = () => setOpenPagar(false);

  const [puestos, setPuestos] = useState<Data[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

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

  const fetchData = async () => {
    try {
      const response = await axios.get("https://mercadolasestrellas.online/intranet/public/v1/socios"); //publico
      // const response = await axios.get("http://127.0.0.1:8000/v1/socios"); //local

      const data = response.data.data.map((item: Socios) => ({
        socio: item.socio,
        dni: item.dni,
        block_nombre: item.block_nombre,
        numero_puesto: item.numero_puesto,
        gironegocio_nombre: item.gironegocio_nombre,
        telefono: item.telefono,
        correo: item.correo,
        inquilino: item.inquilino,
        fecha_registro: formatDate(item.fecha_registro),
        deuda: item.deuda
      }));
      setPuestos(data);
      console.log("la data es", response.data);
    } catch (error) {
      console.error("Error al traer datos", error);
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
                minWidth: "150px",
                height: "50px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#dcdcdc", // Color del borde inicial (gris claro)
                  },
                  "&:hover fieldset": {
                    borderColor: "#dcdcdc", // Color del borde al hacer hover (gris claro)
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#dcdcdc", // Color del borde cuando está enfocado (gris claro)
                    boxShadow: "none", // Elimina la sombra del enfoque
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
                  height: "50px",
                  minWidth: "120px",
                  padding: "0 15px",
                  borderRadius: "30px",
                  color: exportFormat ? "#000" : "#999", // Texto negro si hay selección, gris si es el placeholder
                  "& .MuiSelect-icon": {
                    color: "#000", // Color del icono del menú desplegable
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
                backgroundColor: "#008001",
                "&:hover": {
                  backgroundColor: "#2c6d33",
                },
                height: "50px",
                width: "200px",
                borderRadius: "30px",
              }}
            >
              Imprimir
            </Button>
          </Box>
        </Box>
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
                        backgroundColor:
                          column.id === "deuda" ? "#f8d7da" : undefined,
                        color: column.id === "deuda" ? "#721c24" : undefined,
                        fontWeight: "bold",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {puestos
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      {columns.map((column) => {
                        const value =
                          column.id === "accion" ? "" : (row as any)[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            sx={{
                              backgroundColor:
                                column.id === "deuda" ? "#f8d7da" : undefined,
                              color:
                                column.id === "deuda" ? "#721c24" : undefined,
                            }}
                          >
                            {column.id === "cuotas_extra" ? (
                              <Box sx={{ display: "flex" }}>
                                <IconButton
                                  aria-label="edit"
                                  sx={{ color: "black" }}
                                >
                                  <SaveAs />
                                </IconButton>
                                <IconButton
                                  aria-label="edit"
                                  sx={{ color: "black" }}
                                >
                                  <Plagiarism />
                                </IconButton>
                              </Box>
                            ) : column.id === "pagar" ? (
                              <IconButton
                                aria-label="payment"
                                sx={{ color: "green" }}
                                onClick={handleOpenPagar}
                              >
                                <Payments />
                              </IconButton>
                            ) : column.id === "accion" ? (
                              <Box sx={{ display: "flex" }}>
                                <IconButton
                                  aria-label="edit"
                                  sx={{ color: "black" }}
                                >
                                  <Plagiarism />
                                </IconButton>
                                <IconButton
                                  aria-label="copy"
                                  sx={{ color: "black" }}
                                >
                                  <Download />
                                </IconButton>
                                <IconButton
                                  aria-label="whatsapp"
                                  sx={{ color: "green" }}
                                >
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

          <Box
            sx={{ display: "flex", justifyContent: "flex-start", marginTop: 3 }}
          >
            <Pagination count={10} color="primary" sx={{ marginLeft: "25%" }} />
          </Box>
        </Paper>
        <Pagar open={openPagar} onClose={handleClosePagar} />
      </Card>
    </Box>
  );
};
export default TablaAsociados;
