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
  TextField,
  Typography,
} from "@mui/material";
import { SaveAs, DeleteForever, Search, Download } from "@mui/icons-material";
import { GridAddIcon } from "@mui/x-data-grid";
import axios from "axios";
import RegistrarServicio from "./RegistrarServicio";
import useResponsive from "../Responsive";
import LoadingSpinner from "../PogressBar/ProgressBarV1";

interface Servicio {
  id_servicio: string;
  descripcion: string;
  costo_unitario: string;
  tipo_servicio: string;
  fecha_registro: string;
}

interface Column {
  id: keyof Data | "accion";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: any) => string;
}

interface Data {
  id_servicio: string;
  descripcion: string;
  costo_unitario: string;
  fecha_registro: string;
  tipo_servicio: string;
}

const columns: readonly Column[] = [
  { id: "descripcion", label: "Descripción", minWidth: 50 },
  { id: "costo_unitario", label: "Costo Unitario", minWidth: 50 },
  { id: "fecha_registro", label: "Fecha Registro", minWidth: 50 },
  { id: "tipo_servicio", label: "Tipo de Servicio", minWidth: 50 },
  { id: "accion", label: "Acción", minWidth: 20 }, // Puede ajustarse según las acciones disponibles
];

const TablaServicios: React.FC = () => {

  // Variables para el responsive
  const { isTablet, isSmallTablet, isMobile, isSmallMobile } = useResponsive();
  const [mostrarDetalles, setMostrarDetalles] = useState<string | null>(null);

  const [buscarTexto, setBuscarTexto] = useState<string>("");
  // Para la tabla
  const [servicios, setServicios] = useState<Data[]>([]);
  const [servicioSeleccionado, setServicioSeleccionado] = useState<Servicio | null>(null);

  const [totalPages, setTotalPages] = useState(1); // Total de páginas
  const [paginaActual, setPaginaActual] = useState(1); // Página actual
  const [exportFormat, setExportFormat] = React.useState("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 


  // Abrir modal con un servicio seleccionado o vacio
  const handleOpen = (servicio?: Servicio) => {
    setServicioSeleccionado(servicio || null);
    setOpen(true);
  }

  const handleClose = () => {
    setServicioSeleccionado(null);
    setOpen(false);
  }

  // Metodo para exportar el listado de servicios
  const handleExportServicios = async (e: React.MouseEvent<HTMLButtonElement>) => {

    e.preventDefault();

    try {
      const response = await axios.get("https://mercadolasestrellas.online/intranet/public/v1/servicios/exportar",
        {responseType: 'blob'}
      );
      
      // Si no hay problemas
      if (response.status === 200) {
        if (exportFormat === "1") { // PDF
          alert("En proceso de actualización. Inténtelo más tarde.");
        } else if (exportFormat === "2") { // Excel
          alert("La lista de servicios se descargará en breve.");
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          const hoy = new Date();
          const formatDate = hoy.toISOString().split('T')[0];
          link.setAttribute('download', `lista-servicios-${formatDate}.xlsx`); // Nombre del archivo
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

  const fetchServicios = async (page: number = 1) => {
    try {
      setIsLoading(true);
      // const response = await axios.get("http://127.0.0.1:8000/v1/servicios?page=${page}"); //local
      const response = await axios.get(`https://mercadolasestrellas.online/intranet/public/v1/servicios?page=${page}&buscar_texto=${buscarTexto}`);

      const data = response.data.data.map((item: Servicio) => ({
        id_servicio: item.id_servicio,
        descripcion: item.descripcion,
        costo_unitario: item.costo_unitario,
        tipo_servicio: item.tipo_servicio,
        fecha_registro: formatDate(item.fecha_registro),
      }));
      setServicios(data);
      setTotalPages(response.data.meta.last_page); // Total de páginas
      setPaginaActual(response.data.meta.current_page); // Página actual
      console.log("la data es", response.data);
    } catch (error) {
      console.error("Error al traer datos", error);
    } finally {
      setIsLoading(false); 
    }
  };

  const CambioDePagina = (event: React.ChangeEvent<unknown>, value: number) => {
    setPaginaActual(value);
    fetchServicios(value); // Obtén los datos para la página seleccionada
  };

  useEffect(() => {
    fetchServicios(paginaActual);
  }, []);

  const buscarServicios = () => {
    fetchServicios(1);
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
          // Centra el Card horizontalmente y añade espacio a los lados
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: isTablet ? "column" : { xs: "column", sm: "row" }, // Columna en mobile, fila en desktop
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
              width: isTablet || isMobile ? "100%" : "230px",
              marginBottom: isTablet || isMobile ? "1em" : "0",
              borderRadius: "30px",
            }}
            onClick={() => handleOpen()}
          >
            Agregar Servicio
          </Button>

          <RegistrarServicio open={open} handleClose={handleClose} servicio={servicioSeleccionado} />

          <Box
            sx={{
              width: isTablet ? "100%" : isMobile ? "100%" : "auto",
              display: "flex",
              gap: 2,
              alignItems: "center",
              ml: "auto",
            }}
          >
            <FormControl
              variant="outlined"
              sx={{
                width: isTablet || isMobile ? "50%" : "150px",
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
                width: isTablet || isMobile ? "50%" : "200px",
                borderRadius: "30px",
                fontSize: isMobile ? "0.8rem" : "auto"
              }}
              disabled={ exportFormat === "" }
              onClick={handleExportServicios}
            >
              Descargar
            </Button>
          </Box>
        </Box>

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

        {/* Input Nombre Servicio */}
        <TextField 
          sx={{ 
            width: isTablet || isMobile ? "60%" : "30%",
            "& .MuiInputLabel-root": {
            fontSize: isSmallMobile ? "0.9rem" : "auto",
            },
            "& .MuiInputBase-input": {
              fontSize: isSmallMobile ? "0.9rem" : "auto",
            },
          }}
          label="Nombre del servicio"
          type="text"
          onChange={(e) => setBuscarTexto(e.target.value)}
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
            fontSize: isSmallMobile ? "0.8rem" : "auto",
            borderRadius: "30px",
          }}
          // onClick={}buscarServicios
          onClick={buscarServicios}
        >
          Buscar
        </Button>
      </Box>
      {isLoading ? (
          <LoadingSpinner /> // Mostrar el loading mientras se están cargando los datos
        ) : (
        <>
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
                          textAlign: "center" 
                        }}
                      >
                        Lista de Servicios
                      </Typography>
                    : columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                        sx={{ fontWeight: "bold", }}
                      >
                        {column.label}
                      </TableCell>
                    ))
                  }
                </TableRow>
              </TableHead>
              <TableBody>
                {servicios.map((servicio) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      {isTablet || isMobile 
                      ? <TableCell padding="checkbox" colSpan={columns.length}>
                          <Box sx={{ display: "flex", flexDirection: "column"}}>
                            <Typography 
                              sx={{ 
                                p: 2,
                                // Seleccionar el servicio y cambiar el color de fondo
                                bgcolor: mostrarDetalles === servicio.id_servicio ? "#f0f0f0" : "inherit",
                                "&:hover": {
                                  cursor: "pointer",
                                  bgcolor: "#f0f0f0",
                                }
                              }}
                              onClick={() => setMostrarDetalles(
                                // Si el servicio seleccionado es igual al servicio actual, ocultar detalles
                                mostrarDetalles === servicio.id_servicio ? null : servicio.id_servicio
                              )}
                            >
                              {servicio.descripcion} - {parseInt(servicio.tipo_servicio) === 1
                                ? "Ordinario" 
                                : parseInt(servicio.tipo_servicio) === 2
                                ? "Extraordinario"
                                : "Por metrado"}
                            </Typography>
                            {mostrarDetalles === servicio.id_servicio && (
                              <Box 
                                sx={{
                                  p: 2,
                                  display: "flex", 
                                  flexDirection: "column", 
                                  gap: 1 
                                }}
                              >
                                {columns.map((column) => {
                                  const value = column.id === "accion" ? "" : (servicio as any)[column.id];
                                  return (
                                    <Box>
                                      {/* Mostrar titulo del campo */}
                                      <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                                        {column.label}
                                      </Typography>
                                      {/* Mostrar los detalles del servicio */}
                                      <Typography>
                                        {column.id === "tipo_servicio" ? (
                                          // Si el campo es tipo_servicio, mostrar el tipo de servicio
                                          parseInt(servicio.tipo_servicio) === 1 
                                            ? "Ordinario (Pagos fijos)" 
                                            : parseInt(servicio.tipo_servicio) === 2
                                            ? "Extraordinario (Pagos extras)"
                                            : "Por metrado (Pagos por metraje)"
                                        ) : column.id === "accion" ? (
                                          <Box
                                            sx={{
                                              display: "flex",
                                              justifyContent: "flex-start",
                                              gap: 1,
                                            }}
                                          >
                                            <Button
                                              variant="contained"
                                              sx={{ 
                                                width: "50%",
                                                bgcolor: "#EA9A00", 
                                                color: "#fff" 
                                              }}
                                              onClick={() => handleOpen(servicio)}
                                            >
                                              <SaveAs sx={{ mr: 1 }}/>
                                              Editar
                                            </Button>
                                            <Button
                                              variant="contained"
                                              sx={{ 
                                                width: "50%",
                                                bgcolor: "crimson", 
                                                color: "#fff" 
                                              }}
                                              onClick={() => alert("En proceso de actualización. Intentelo más tarde.")}
                                            >
                                              <DeleteForever sx={{ mr: 1 }}/>
                                              Eliminar
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
                        const value = column.id === "accion" 
                          ? ""
                          : (servicio as any)[column.id];
                        return (
                            <TableCell key={column.id} align={column.align}>
                              {column.id === "accion" ? (
                                <Box sx={{ display: "flex" }}>
                                <IconButton
                                  aria-label="edit"
                                  sx={{ color: "#0478E3" }}
                                  onClick={() => handleOpen(servicio)}
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
        </>
        )}
      </Card>
    </Box>
  );
};

export default TablaServicios;
