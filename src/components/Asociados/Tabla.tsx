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
  Box,
  Card,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  Typography,
  TextField,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Download,
  WhatsApp,
  Payments,
  SaveAs,
  Search,
} from "@mui/icons-material";
import { GridAddIcon } from "@mui/x-data-grid";
import axios from "axios";
import Agregar from "./Agregar";
import Pagar from "./Pagar";

interface Socio {
  id_socio: string;
  nombre_completo: string;
  nombre_socio: string;
  apellido_paterno: string;
  apellido_materno: string;
  dni: string;
  sexo: string;
  direccion: string;
  telefono: string;
  correo: string;
  id_puesto: string;
  numero_puesto: string;
  id_block: string;
  block_nombre: string;
  gironegocio_nombre: string;
  nombre_inquilino: string;
  estado: string;
  fecha_registro: string;
  deuda: string;
}

interface Column {
  id: keyof Data | "accion";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: any) => string;
}
interface Data {
  id_socio: string;
  nombre_completo: string;
  nombre_socio: string;
  apellido_paterno: string;
  apellido_materno: string;
  dni: string;
  sexo: string;
  direccion: string;
  telefono: string;
  correo: string;
  id_puesto: string;
  numero_puesto: string;
  id_block: string;
  block_nombre: string;
  gironegocio_nombre: string;
  nombre_inquilino: string;
  estado: string;
  fecha_registro: string;
  deuda: string;
  ver_reporte: string;
}

const columns: readonly Column[] = [
  { id: "nombre_completo", label: "Nombre", minWidth: 50 }, // Nombre del socio
  { id: "dni", label: "DNI", minWidth: 50 },      // DNI
  { id: "telefono", label: "Teléfono", minWidth: 50 },  // Teléfono
  { id: "correo", label: "Correo", minWidth: 50 },      // Correo
  { id: "block_nombre", label: "Block", minWidth: 50 }, // Nombre del bloque
  { id: "numero_puesto", label: "Puesto", minWidth: 50 }, // Número del puesto
  { id: "gironegocio_nombre", label: "Giro", minWidth: 50 }, // Nombre del giro de negocio
  { id: "nombre_inquilino", label: "Inquilino", minWidth: 50 }, // Inquilino
  { id: "fecha_registro", label: "Fecha", minWidth: 50 }, // Fecha de registro
  { id: "deuda", label: "Deuda Total", minWidth: 50 }, // Deuda total
  { id: "ver_reporte", label: "Deudas / Pagos", minWidth: 10 }, // Ver Deuda / Pagos
  { id: "accion", label: "Acción", minWidth: 20 },    // Acción
];

const TablaAsociados: React.FC = () => {

  // Variables para el responsive
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Para filtrar los registros
  const [nombreIngresado, setNombreIngresado] = useState<string>("");
  const [socioSeleccionado, setSocioSeleccionado] = useState<Socio | null>(null);

  const [open, setOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState("");
  const [openPagar, setOpenPagar] = useState<boolean>(false);

  const handleOpen = (socio?: Socio) => {
    setSocioSeleccionado(socio || null);
    setOpen(true);
  }

  const handleClose = () => setOpen(false);

  // Metodo para exportar el listado de socios
  const handleExportSocios = async (e: React.MouseEvent<HTMLButtonElement>) => {

    e.preventDefault();

    try {
      const response = await axios.get("https://mercadolasestrellas.online/intranet/public/v1/socios/exportar",
        { responseType: 'blob' } // Para manejar archivos
      );

      // Si no hay error
      if (response.status === 200) {
        if (exportFormat === "1") { // PDF
          alert("En proceso de actualización. Intentelo más tarde.");
        } else if (exportFormat === "2") { // Excel
          alert("La lista de socios se descargará en breve.");
          // Creamos un elemento a partir del blob
          const url = window.URL.createObjectURL(new Blob([response.data]));
          // Creamos el enlace de descarga
          const link = document.createElement('a');
          link.href = url;
          // Para obtener la fecha
          const hoy = new Date();
          const formatDate = hoy.toISOString().split('T')[0];
          link.setAttribute('download', `lista-socios-${formatDate}.xlsx`); // Nombre del archivo
          document.body.appendChild(link);
          link.click();
          // Para limpiar el enlace
          link.parentNode?.removeChild(link);
          // Limpiamos el formato de exportación
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

  const handleOpenPagar = () => setOpenPagar(true);
  const handleClosePagar = () => setOpenPagar(false);

  const [socios, setSocios] = useState<Data[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [paginaActual, setPaginaActual] = useState(1);

  const formatDate = (fecha: string): string => {
    const date = new Date(fecha);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDay = day.toString().padStart(2, "0");
    const formattedMonth = month.toString().padStart(2, "0");

    return `${formattedDay}/${formattedMonth}/${year}`;
  };

  const fetchSocios = async (page: number = 1) => {
    try {
      // const response = await axios.get(`http://127.0.0.1:8000/v1/socios?page=${page}`);
      const response = await axios.get(`https://mercadolasestrellas.online/intranet/public/v1/socios?page=${page}&buscar_texto=${nombreIngresado}`); //publico

      const data = response.data.data.map((item: Socio) => ({
        id_socio: item.id_socio,
        nombre_completo: item.nombre_completo,
        nombre_socio: item.nombre_socio,
        apellido_paterno: item.apellido_paterno,
        apellido_materno: item.apellido_materno,
        dni: item.dni,
        sexo: item.sexo,
        direccion: item.direccion,
        telefono: item.telefono,
        correo: item.correo,
        id_puesto: item.id_puesto,
        numero_puesto: item.numero_puesto,
        id_block: item.id_block,
        block_nombre: item.block_nombre,
        gironegocio_nombre: item.gironegocio_nombre,
        nombre_inquilino: item.nombre_inquilino,
        estado: item.estado,
        fecha_registro: formatDate(item.fecha_registro),
        deuda: item.deuda
      }));

      console.log('Total Pages:', totalPages);
      setSocios(data);
      console.log(data);
      setTotalPages(response.data.meta.last_page);
      setPaginaActual(response.data.meta.current_page);
    } catch (error) {
      console.error("Error al traer datos", error);
    }
  };

  useEffect(() => {
    fetchSocios();
  }, []);

  const buscarSocios = () => {
    fetchSocios();
  }

  const handleSocioRegistrado = () => {
    fetchSocios();
  };

  const CambioDePagina = (event: React.ChangeEvent<unknown>, value: number) => {
    setPaginaActual(value);
    fetchSocios(value);
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

      <Box sx={{ mb: 3 }} />

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
            flexDirection: { xs: "column", sm: "row" }, // Columna en mobile, fila en desktop
            justifyContent: "space-between",
            alignItems: "center",
            mb: isMobile ? 2 : 3,
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
              width: isMobile ? "100%" : "230px",
              marginBottom: isMobile ? "1em" : "0",
              borderRadius: "30px",
            }}
            onClick={() => handleOpen()}
          >
            Agregar Socio
          </Button>

          <Agregar
            open={open}
            handleClose={handleClose}
            socio={socioSeleccionado}
            onSocioRegistrado={handleSocioRegistrado}
          />

          <Box
            sx={{
              width: isMobile ? "100%" : "auto", // Ancho del contenedor
              display: "flex",
              gap: 2,
              alignItems: "center",
              ml: isMobile ? 0 : "auto",
            }}
          >
            <FormControl
              variant="outlined"
              sx={{
                width: isMobile ? "50%" : "150px",
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
                  width: "100%",
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
                <MenuItem value="1">PDF</MenuItem>
                <MenuItem value="2">Excel</MenuItem>
              </Select>
            </FormControl>

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
              onClick={ handleExportSocios }
            >
              Descargar
            </Button>
          </Box>
        </Box>

        {/* Buscar socio */}
        <Box
          sx={{
            padding: isMobile ? "15px 0px" : "15px 35px",
            borderTop: "1px solid rgba(0, 0, 0, 0.25)",
            borderBottom: "1px solid rgba(0, 0, 0, 0.25)",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Typography 
            sx={{ 
              display: isMobile ? "none" : "inline-block",
              fontWeight: "bold", 
              mr: 2,
            }}>
            Buscar por:
          </Typography>

          {/* Input Nombre Socio */}
          <TextField
            sx={{ width: isMobile ? "60%" : "30%" }}
            label="Nombre del socio"
            onChange={(e) => setNombreIngresado(e.target.value)}
          />

          {/* Boton Buscar */}
          <Button
            variant="contained"
            startIcon={<Search />}
            sx={{
              backgroundColor: "#008001",
              "&:hover": {
                backgroundColor: "#2c6d33",
              },
              height: "50px",
              width: isMobile ? "40%" : "170px",
              marginLeft: isMobile ? "10px" : "1rem",
              borderRadius: "30px",
            }}
            onClick={buscarSocios}
          >
            Buscar
          </Button>
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
                {socios
                  // .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
                  .map((socio) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      {columns.map((column) => {
                        const value =
                          column.id === "accion" ? "" : (socio as any)[column.id];
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
                            {column.id === "ver_reporte" ? (
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <IconButton
                                  aria-label="payment"
                                  sx={{ color: "crimson" }}
                                  onClick={handleOpenPagar}
                                >
                                  <Payments />
                                </IconButton>
                                <Typography> / </Typography>
                                <IconButton
                                  aria-label="payment"
                                  sx={{ color: "green" }}
                                  onClick={handleOpenPagar}
                                >
                                  <Payments />
                                </IconButton>
                              </Box>
                            ) : column.id === "accion" ? (
                              <Box sx={{ display: "flex" }}>
                                <IconButton
                                  aria-label="edit"
                                  sx={{ color: "#0478E3" }}
                                  onClick={() => handleOpen(socio)}
                                >
                                  <SaveAs />
                                </IconButton>
                                <IconButton
                                  aria-label="download"
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
            sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}
          >
            <Pagination
              count={totalPages} // Total de páginas
              page={paginaActual} // Página actual
              onChange={CambioDePagina} // Manejar el cambio de página
              color="primary"
            // sx={{ marginLeft: "25%" }}
            />

          </Box>

        </Paper>
        <Pagar open={openPagar} onClose={handleClosePagar} />
      </Card>
    </Box>
  );
};
export default TablaAsociados;
