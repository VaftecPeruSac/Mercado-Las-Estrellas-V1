import * as React from "react";
import { useState, useEffect } from "react";
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
  InputLabel,
  Typography,
} from "@mui/material";
import {
  Download,
  Search,
  WhatsApp,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { GridAddIcon } from "@mui/x-data-grid";
import axios from "axios";
import GenerarCuota from "./GenerarCuota";
import useResponsive from "../Responsive";

interface Cuotas {
  id_deuda: string; // Nombre del socio
  fecha_registro: string;
  fecha_vencimiento: string;
  importe: string;
  socio_nombre: string;
  puesto_descripcion: string;
  servicio_descripcion: string;
}

interface Column {
  id: keyof Data | "accion";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: any) => string;
}

interface Data {
  id_deuda: string;
  socio_nombre: string;
  puesto_descripcion: string;
  servicio_descripcion: string;
  fecha_registro: string;
  fecha_vencimiento: string;
  importe: string;
}

const columns: readonly Column[] = [
  { id: "id_deuda", label: "# ID", minWidth: 50 }, // Nombre del socio
  { id: "socio_nombre", label: "Socio", minWidth: 50 },
  { id: "puesto_descripcion", label: "Puesto", minWidth: 50 },
  { id: "servicio_descripcion", label: "Servicio", minWidth: 50 },
  { id: "fecha_registro", label: "Fecha Emisión", minWidth: 50 }, // DNI
  { id: "fecha_vencimiento", label: "Fecha Vencimiento", minWidth: 50 }, // Nombre del bloque
  { id: "importe", label: "Importe", minWidth: 50 }, // Número del puesto
  { id: "accion", label: "Acción", minWidth: 20 }, // Acciones
];

const optMeses = [
  {value: "1", label: "Enero"},
  {value: "2", label: "Febrero"},
  {value: "3", label: "Marzo"},
  {value: "4", label: "Abril"},
  {value: "5", label: "Mayo"},
  {value: "6", label: "Junio"},
  {value: "7", label: "Julio"},
  {value: "8", label: "Agosto"},
  {value: "9", label: "Septiembre"},
  {value: "10", label: "Octubre"},
  {value: "11", label: "Noviembre"},
  {value: "12", label: "Diciembre"},
];
interface IMeses {
  value: string;
  label: string;
}

const TablaCuota: React.FC = () => {

  // Variables para el responsive
  const { isTablet, isSmallTablet, isMobile, isSmallMobile } = useResponsive();
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [mostrarDetalles, setMostrarDetalles] = useState<string | null>(null);

  const [iMeses, setIMeses] = useState<IMeses[]>([]);
  const [totalPages, setTotalPages] = useState(1); // Total de páginas
  const [paginaActual, setPaginaActual] = useState(1); // Página actual
  const [exportFormat, setExportFormat] = useState<string>("");
  const [anio, setAnio] = useState<string>("");
  const [mes, setMes] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [cuotas, setCuotas] = useState<Data[]>([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Metodo para exportar el listado de cuotas
  const handleExportCuotas = async (e: React.MouseEvent<HTMLButtonElement>) => {

    e.preventDefault();

    try {
      const response = await axios.get("https://mercadolasestrellas.online/intranet/public/v1/cuotas/exportar",
        {responseType: 'blob'}
      );

      // Si no hay problemas
      if(response.status === 200){
        if (exportFormat === "1") { // PDF
          alert("En proceso de actualización. Intentelo más tarde.");
        } else if (exportFormat === "2") { // Excel
          alert("La lista de cuotas se descargará en breve.");
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          const hoy = new Date();
          const formatDate = hoy.toISOString().split('T')[0];
          link.setAttribute('download', `lista-cuotas-${formatDate}.xlsx`); // Nombre del archivo
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

  // Metodo para buscar cuotas por fecha
  const handleSearchCuota = () => {
    fetchCuotas();
  }

  const formatDate = (fecha: string): string => {
    const date = new Date(fecha);
    const day = date.getDate();
    const month = date.getMonth() + 1; 
    const year = date.getFullYear();
    const formattedDay = day.toString().padStart(2, "0");
    const formattedMonth = month.toString().padStart(2, "0");
    return `${formattedDay}/${formattedMonth}/${year}`;
  };

  const fetchCuotas = async (page: number = 1) => {
    try {
      const response = await axios.get(`https://mercadolasestrellas.online/intranet/public/v1/cuotas?page=${page}&anio=${anio}&mes=${mes}`); //publico
      // const response = await axios.get("http://127.0.0.1:8000/v1/cuotas?page=${page}"); //local

      // console.log(anio, mes);
      const data = response.data.data.map((item: Cuotas) => ({
        id_deuda: item.id_deuda,
        fecha_registro: formatDate(item.fecha_registro),
        fecha_vencimiento: formatDate(item.fecha_vencimiento),
        importe: item.importe,
        // --
        socio_nombre: item.socio_nombre,
        puesto_descripcion: item.puesto_descripcion,
        servicio_descripcion: item.servicio_descripcion,
      }));
      setCuotas(data);
      setTotalPages(response.data.meta.last_page); // Total de páginas
      setPaginaActual(response.data.meta.current_page); // Página actual
      console.log("la data es", response.data);
    } catch (error) {
      console.error("Error al traer datos", error);
    }
  };

  const CambioDePagina = (event: React.ChangeEvent<unknown>, value: number) => {
    setPaginaActual(value);
  fetchCuotas(value)  };

  useEffect(() => {
    fetchCuotas(paginaActual);
  }, []);

  useEffect(() => {
    setIMeses(optMeses);
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
          {/* Botón "Generar Cuota" */}
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
            Generar Cuota
          </Button>

          <GenerarCuota open={open} handleClose={handleClose} />

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
                  minWidth: "100%",
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
              onClick={handleExportCuotas}
            >
              Descargar
            </Button>
          </Box>
        </Box>

        {isMobile && (
          // Botón "Filtros" para mostrar/ocultar los filtros
          <Box 
            sx={{
              width: "100%",
              borderTop: "1px solid rgba(0, 0, 0, 0.25)",
              borderBottom: !mostrarFiltros ? "1px solid rgba(0, 0, 0, 0.25)" : "none",
              pt: "1rem",
            }}
          >
            <Button
              variant="contained"
              sx={{
                height: "50px",
                width: "100%",
                borderRadius: "30px",
                mb: "1rem",
              }}
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              endIcon={mostrarFiltros 
                ? <ExpandLess /> 
                : <ExpandMore />}
            >
              {mostrarFiltros ? "Ocultar Filtros" : "Mostrar Filtros"}
            </Button>
          </Box>
        )}

        {(!isMobile || mostrarFiltros) && (

          // Filtros de búsqueda
          <Box
            sx={{
              padding: isTablet || isMobile ? "15px 0" : "15px 35px",
              borderTop: "1px solid rgba(0, 0, 0, 0.25)",
              borderBottom: "1px solid rgba(0, 0, 0, 0.25)",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "left" : "center",
            }}
          >
            <Typography 
              sx={{
                display: isTablet ? "none" : "block",
                textAlign: "left",
                fontWeight: "bold", 
                mr: 2,
                mt: isMobile ? 1 : 0,
                mb: isMobile ? 2 : 0
              }}
            >
              Buscar por:
            </Typography>

            {/* Seleccionar año */}
            <FormControl 
              sx={{ 
                width: isMobile ? "100%" : "200px", 
                mr: isMobile ? 0 : 1, 
              }}
            >
              <InputLabel id="cuota-anio-label">Año</InputLabel>
              <Select value={anio} onChange={(e) => setAnio(e.target.value)} label="Año">
                {[
                  2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015,
                  2014, 2013, 2012,
                ].map((año) => (
                  <MenuItem
                    sx={{ padding: "10px 25px !important" }}
                    key={año}
                    value={año}
                  >
                    {año}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Seleccionar mes */}
            <FormControl
              sx={{ 
                width: isMobile ? "100%" : "200px", 
                mr: isMobile ? 0 : 1,
                mt: isMobile ? 2 : 0,
                mb: isMobile ? 2 : 0,
              }}
            >
              <InputLabel id="cuota-mes-label">Mes</InputLabel>
              <Select value={mes} onChange={(e) => setMes(e.target.value)} label="Mes">
              {iMeses.map((iMes: IMeses) => (
                          <MenuItem key={iMes.value} value={iMes.value}>
                            {iMes.label}
                          </MenuItem>
                        ))}
              </Select>
            </FormControl>

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
                width: isMobile ? "100%" : "170px",
                marginLeft: isMobile ? 0 : "1rem",
                borderRadius: "30px",
              }}
              onClick={handleSearchCuota}
            >
              Buscar
            </Button>
          </Box>

        )}

        {/* Tabla */}
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
                      Listado de Cuotas
                    </Typography>
                  : columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.id === "accion" ? "center" : column.align} // Alinear 'accion' a la derecha
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
                {cuotas.map((cuota) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      {isTablet || isMobile
                      ? <TableCell padding="checkbox" colSpan={columns.length}>
                          <Box sx={{ display: "flex", flexDirection: "column"}}>
                            <Typography 
                              sx={{ 
                                p: 2,
                                // Seleccionar la cuota y cambiar el color de fondo
                                bgcolor: mostrarDetalles === cuota.id_deuda ? "#f0f0f0" : "inherit",
                                "&:hover": {
                                  cursor: "pointer",
                                  bgcolor: "#f0f0f0",
                                }
                              }}
                              onClick={() => setMostrarDetalles(
                                // Si la cuota seleccionada es igual a la cuota actual, ocultar detalles
                                mostrarDetalles === cuota.id_deuda ? null : cuota.id_deuda
                              )}
                            >
                              {cuota.fecha_registro} - {cuota.socio_nombre}
                            </Typography>
                            {mostrarDetalles === cuota.id_deuda && (
                              <Box 
                                sx={{
                                  p: 2,
                                  display: "flex", 
                                  flexDirection: "column", 
                                  gap: 1 
                                }}
                              >
                                {columns.map((column) => {
                                  const value = column.id === "accion" ? "" : (cuota as any)[column.id];
                                  return (
                                    <Box>
                                      {/* Mostrar titulo del campo */}
                                      <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                                        {column.label}
                                      </Typography>
                                      {/* Mostrar los detalles de la cuota */}
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
                          column.id === "accion" ? "" : (cuota as any)[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align={
                              column.id === "accion" ? "center" : column.align
                            }
                          >
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                            {column.id === "accion" && (
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                {/* Alinea los íconos a la derecha */}
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
      </Card>
    </Box>
  );
};

export default TablaCuota;
