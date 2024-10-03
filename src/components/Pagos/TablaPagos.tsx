import {
  Download,
  FileDownload,
  Search,
  WhatsApp,
} from "@mui/icons-material";
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
  TextField,
  Typography,
} from "@mui/material";
import { GridAddIcon } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import RegistrarPago from "./RegistrarPago";
import axios from "axios";
import useResponsive from "../Responsive";
import LoadingSpinner from "../PogressBar/ProgressBarV1";

interface Pagos {
  id_pago: string;
  puesto: string;
  socio: string;
  dni: string;
  telefono: string;
  correo: string;
  total_pago: string;
  total_deuda: string;
  fecha_registro: string;
}

interface Column {
  id: keyof Data | "accion";
  label: string;
  minWidth?: number;
  align?: "center";
}

interface Data {
  id_pago: string;
  puesto: string;
  socio: string;
  dni: string;
  telefono: string;
  correo: string;
  total_pago: string;
  total_deuda: string;
  fecha_registro: string;
}

const columns: readonly Column[] = [
  { id: "id_pago", label: "#ID", minWidth: 50, align: "center" },
  { id: "puesto", label: "N° Puesto", minWidth: 50, align: "center" },
  { id: "socio", label: "Socio", minWidth: 50, align: "center" },
  { id: "dni", label: "DNI", minWidth: 50, align: "center" },
  { id: "fecha_registro", label: "Fecha", minWidth: 50, align: "center" },
  { id: "telefono", label: "Teléfono", minWidth: 50, align: "center" },
  { id: "correo", label: "Correo", minWidth: 50, align: "center" },
  { id: "total_pago", label: "A Cuenta", minWidth: 50, align: "center" },
  { id: "total_deuda", label: "Monto Actual", minWidth: 50, align: "center" },
  { id: "accion", label: "Acciones", minWidth: 50, align: "center" },
];

const TablaPago: React.FC = () => {

  // Variables para el responsive
  const { isTablet, isSmallTablet, isMobile, isSmallMobile } = useResponsive();
  const [mostrarDetalles, setMostrarDetalles] = useState<string | null>(null);

  const [pagos, setPagos] = useState<Data[]>([]);
  const [totalPages, setTotalPages] = useState(1); // Total de páginas
  const [paginaActual, setPaginaActual] = useState(1); // Página actual
  const [exportFormat, setExportFormat] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Metodo para exportar el listado de pagos
  const handleExportPagos = async (e: React.MouseEvent<HTMLButtonElement>) => {

    e.preventDefault();

    try {
      const response = await axios.get("https://mercadolasestrellas.online/intranet/public/v1/pagos/exportar",
        {responseType: 'blob'}
      );

      // Si no hay problemas
      if (response.status === 200) {
        if (exportFormat === "1") { // PDF
          alert("En proceso de actualización. Intentelo más tarde.");
        } else if (exportFormat === "2") { // Excel
          alert("La lista de pagos se descargará en breve.");
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          const hoy = new Date();
          const formatDate = hoy.toISOString().split('T')[0];
          link.setAttribute('download', `lista-pagos-${formatDate}.xlsx`); // Nombre del archivo
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

  // Metodo para buscar pagos por socio
  const handleSearchPagos = async (e: React.MouseEvent<HTMLButtonElement>) => {

    e.preventDefault();

    // try {
    //   alert("En proceso de actualización.");
    // } catch {
    //   alert("Error al buscar los pagos del socio. Intentelo nuevamente más tarde.")
    // }
    fetchPagos(1);

  }

  const fetchPagos = async (page: number = 1) => {
    setIsLoading(true)
    try {
      const response = await axios.get(`https://mercadolasestrellas.online/intranet/public/v1/pagos?page=${page}`);
      // const response = await axios.get("http://127.0.0.1:8000/v1/pagos?page=${page}");
      const data = response.data.data.map((item: Pagos) => ({
        id_pago: item.id_pago,
        puesto: item.puesto,
        socio: item.socio,
        dni: item.dni,
        telefono: item.telefono,
        correo: item.correo,
        total_pago: item.total_pago,
        total_deuda: item.total_deuda,
        fecha_registro: item.fecha_registro
      }));
      setPagos(data);
      setTotalPages(response.data.meta.last_page); // Total de páginas
      setPaginaActual(response.data.meta.current_page); // Página actual
      // console.log("La data es:", response.data.data);
    } catch (error) {
      console.error("Error al traer datos", error);
    } finally {
      setIsLoading(false); 
    }
  };

  const CambioDePagina = (event: React.ChangeEvent<unknown>, value: number) => {
    // console.log("CambioDePagina !!!");
    setPaginaActual(value);
    fetchPagos(value); // Obtén los datos para la página seleccionada
  };

  useEffect(() => {
    fetchPagos(paginaActual);
  }, []);

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
            mb: isMobile ? 2 : 3,
            p: 0,
          }}
        >
          {/* Botón "Registrar Pago" */}
          <Button
            variant="contained"
            startIcon={<GridAddIcon />}
            sx={{
              backgroundColor: "#008001",
              "&:hover": {
                backgroundColor: "#2c6d33",
              },
              height: "50px",
              width: isTablet || isMobile ? "100%" : "230px",
              marginBottom: isTablet || isMobile ? "1em" : "0",
              borderRadius: "30px",
            }}
            onClick={handleOpen}
          >
            Registrar Pago
          </Button>

          {/* Modal Registrar Pago */}
          <RegistrarPago open={open} handleClose={handleClose} />

          <Box
            sx={{
              width: isTablet ? "100%" : isMobile ? "100%" : "auto",
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
                width: isTablet || isMobile ? "50%" : "150px",
                height: "50px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { 
                    borderColor: "#dcdcdc" 
                  },
                  "&:hover fieldset": { 
                    borderColor: "#dcdcdc" 
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
              onClick={handleExportPagos}
            >
              Descargar
            </Button>
          </Box>
        </Box>

        {/* Buscar Pagos X Socio */}
        <Box
          sx={{
            padding: isTablet || isMobile ? "15px 0px" : "15px 35px",
            borderTop: "1px solid rgba(0, 0, 0, 0.25)",
            borderBottom: "1px solid rgba(0, 0, 0, 0.25)",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Typography 
            sx={{ 
              display: isTablet || isMobile ? "none" : "inline-block",
              fontWeight: "bold", 
              mr: 2 
            }}
          >
            Buscar por:
          </Typography>

          {/* Input Nombre Socio */}
          <TextField 
            sx={{ width: isTablet || isMobile ? "60%" : "30%" }} 
            label="Nombre del socio" 
            type="text"
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
              width: isTablet || isMobile ? "40%" : "170px",
              marginLeft: isMobile ? "10px" : "1rem",
              borderRadius: "30px",
              fontSize: isSmallMobile ? "0.8rem" : "auto"
            }}
            onClick={handleSearchPagos}
          >
            Buscar
          </Button>
        </Box>
        {isLoading ? (
          <LoadingSpinner /> // Mostrar el loading mientras se están cargando los datos
        ) : (
        <>
        {/* Tabla Deudas */}
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
                      Lista de pagos
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
                {pagos.map((pago) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      {isTablet || isMobile 
                      ? <TableCell padding="checkbox" colSpan={columns.length}>
                          <Box sx={{ display: "flex", flexDirection: "column"}}>
                            <Typography 
                              sx={{ 
                                p: 2,
                                // Seleccionar el pago y cambiar el color de fondo
                                bgcolor: mostrarDetalles === pago.id_pago ? "#f0f0f0" : "inherit",
                                "&:hover": {
                                  cursor: "pointer",
                                  bgcolor: "#f0f0f0",
                                }
                              }}
                              onClick={() => setMostrarDetalles(
                                // Si el pago seleccionado es igual al pago actual, ocultar detalles
                                mostrarDetalles === pago.id_pago ? null : pago.id_pago
                              )}
                            >
                              {pago.fecha_registro} - {pago.socio} - {pago.total_pago}
                            </Typography>
                            {mostrarDetalles === pago.id_pago && (
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
                                      <Typography>
                                        {column.id === "accion" ? (
                                          <Box 
                                            sx={{
                                              width: "100%",
                                              display: "flex", 
                                              flexDirection: "column",
                                              justifyContent: "center"
                                            }}
                                          >
                                            {/* <Button 
                                              variant="contained"
                                              sx={{
                                                padding: "0.5rem 1.5rem",
                                                backgroundColor: "#0478E3", 
                                                color: "white" 
                                              }}
                                              // onClick={() => handleOpen(pago)}
                                            >
                                              <InsertDriveFile sx={{ mr: 1 }} />
                                              Ver detalles
                                            </Button> */}
                                            <Button
                                              variant="contained"
                                              sx={{
                                                mt: 1,
                                                mb: 1,
                                                padding: "0.5rem 1.5rem",
                                                backgroundColor: "black", 
                                                color: "white"
                                              }}
                                            >
                                              <Download sx={{ mr: 1 }} />
                                              Descargar
                                            </Button>
                                            <Button
                                              variant="contained"
                                              sx={{
                                                padding: "0.5rem 1.5rem",
                                                backgroundColor: "green", 
                                                color: "white"
                                              }}
                                            >
                                              <WhatsApp sx={{ mr: 1 }} />
                                              Enviar
                                            </Button>
                                          </Box>
                                        ) : (
                                          value
                                        )}
                                      </Typography>
                                    </Box>
                                  )
                                })}
                              </Box>
                            )}
                          </Box>
                        </TableCell>
                      : columns.map((column) => {
                        const value =
                          column.id === "accion" ? "" : (pago as any)[column.id];
                        return (
                          <TableCell key={column.id} align="center">
                            {column.id === "accion" ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 1,
                                  justifyContent: "center",
                                }}
                              >
                                {/* Boton Ver pago */}
                                {/* <IconButton
                                  aria-label="file"
                                  sx={{ color: "#000" }}
                                >
                                  <InsertDriveFile />
                                </IconButton> */}

                                {/* Boton Descargar */}
                                <IconButton
                                  aria-label="download"
                                  sx={{ color: "#002B7E" }}
                                >
                                  <FileDownload />
                                </IconButton>

                                {/* Boton Whatsapp */}
                                <IconButton
                                  aria-label="share"
                                  sx={{ color: "#008001" }}
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
            />
          </Box>
        </Paper>
        </>
        )}
      </Card>
    </Box>
  );
};

export default TablaPago;
