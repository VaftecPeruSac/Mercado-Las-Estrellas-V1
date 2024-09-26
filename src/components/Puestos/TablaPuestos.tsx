import { DeleteForever, Download, ExpandLess, ExpandMore, SaveAs, Search } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  FormControl,
  IconButton,
  InputLabel,
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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { GridAddIcon } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import RegistrarPuesto from "./RegistrarPuesto";

interface Puesto {
  id_puesto: string;
  numero_puesto: string;
  area: string;
  estado: string;
  fecha_registro: string;
  socio: string;
  giro_negocio: {
    id_gironegocio: string;
    nombre: string;
  };
  block: {
    id_block: string;
    nombre: string;
  };
  inquilino: string;
}

interface Bloque {
  id_block: string;
  nombre: string;
}

interface GiroNegocio {
  id_gironegocio: string;
  nombre: string;
}

interface Column {
  id: keyof Data | "accion";
  label: string;
  minWidth?: number;
  align?: "center";
  format?: (value: any) => string;
}

interface Data {
  id_puesto: string;
  numero_puesto: string;
  area: string;
  estado: string;
  fecha_registro: string;
  socio: string;
  giro_negocio: {
    id_gironegocio: string;
    nombre: string;
  };
  block: {
    id_block: string;
    nombre: string;
  };
  inquilino: string;
}

const columns: readonly Column[] = [
  { id: "block", label: "Bloque", minWidth: 50 },
  { id: "numero_puesto", label: "N° Puesto", minWidth: 50 },
  { id: "area", label: "Área", minWidth: 50 },
  { id: "giro_negocio", label: "Giro de Negocio", minWidth: 50 },
  { id: "socio", label: "Socio", minWidth: 50 },
  { id: "inquilino", label: "Inquilino", minWidth: 50 },
  { id: "estado", label: "Estado", minWidth: 50 },
  { id: "fecha_registro", label: "Fecha Registro", minWidth: 50 },
  { id: "accion", label: "Acciones", minWidth: 50 },
];

const TablaPuestos: React.FC = () => {

  // Variables para el responsive
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [mostrarDetalles, setMostrarDetalles] = useState<string | null>(null);

  // Para filtrar los datos
  const [bloques, setBloques] = useState<Bloque[]>([]);
  const [girosNegocio, setGirosNegocio] = useState<GiroNegocio[]>([]);
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState<string>("");
  const [nroPuestoIngresado, setNroPuestoIngresado] = useState<string>("");
  const [giroSeleccionado, setGiroSeleccionado] = useState<string>("");

  // Para la tabla
  const [puestos, setPuestos] = useState<Data[]>([]);
  const [totalPages, setTotalPages] = useState(1); // Total de páginas
  const [paginaActal, setPaginaActual] = useState(1); // Página actual
  const [puestoSeleccionado, setPuestoSeleccionado] = useState<Puesto | null>(null);

  // Para exportar la información
  const [exportFormat, setExportFormat] = useState<string>("");

  // Para el modal
  const [open, setOpen] = useState(false);

  // Abrir modal con un pueto seleccionado o vacio
  const handleOpen = (puesto?: Puesto) => {
    setPuestoSeleccionado(puesto || null);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  // Metodo para exportar el listado de puestos
  const handleExportPuestos = async (e: React.MouseEvent<HTMLButtonElement>) => {

    e.preventDefault();

    try {
      const response = await axios.get("https://mercadolasestrellas.online/intranet/public/v1/puestos/exportar",
        { responseType: 'blob' }
      );

      // Si no hay problemas
      if (response.status === 200) {
        if (exportFormat === "1") { // PDF
          alert("En proceso de actualización. Intentelo más tarde.");
        } else if (exportFormat === "2") { // Excel
          alert("La lista de puestos se descargará en breve.");
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          const hoy = new Date();
          const formatDate = hoy.toISOString().split('T')[0];
          link.setAttribute('download', `lista-puestos-${formatDate}.xlsx`); // Nombre del archivo
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

  // Obtener bloques
  useEffect(() => {
    const fetchBloques = async () => {
      try {
        const response = await axios.get("https://mercadolasestrellas.online/intranet/public/v1/blocks");
        console.log("Bloques obtenidos:", response.data.data);
        setBloques(response.data.data);
      } catch (error) {
        console.error("Error al obtener los bloques", error);
      }
    };
    fetchBloques();
  }, []);

  // Obtener giro de negocio
  useEffect(() => {
    const fechGiroNegocio = async () => {
      try {
        const response = await axios.get("https://mercadolasestrellas.online/intranet/public/v1/giro-negocios");
        console.log("Giros de negocio obtenidos:", response.data.data);
        setGirosNegocio(response.data.data);
      } catch (error) {
        console.error("Error al obtener los giro de negocio", error);
      }
    };
    fechGiroNegocio();
  }, []);

  // Listar puestos
  const fetchPuestos = async (page: number = 1) => {
    try {
      const response = await axios.get(`https://mercadolasestrellas.online/intranet/public/v1/puestos?page=${page}&id_gironegocio=${giroSeleccionado}&id_block=${bloqueSeleccionado}&numero_puesto=${nroPuestoIngresado}`); //publico
      // const response = await axios.get("http://127.0.0.1:8000/v1/puestos?page=${page}"); //local

      const data = response.data.data.map((item: Puesto) => ({
        id_puesto: item.id_puesto,
        numero_puesto: item.numero_puesto,
        area: item.area,
        estado: item.estado,
        fecha_registro: formatDate(item.fecha_registro),
        socio: item.socio,
        giro_negocio: {
          id_gironegocio: item.giro_negocio.id_gironegocio,
          nombre: item.giro_negocio.nombre,
        },
        block: {
          id_block: item.block.id_block,
          nombre: item.block.nombre,
        },
        inquilino: item.inquilino,
      }));
      console.log("Total Pages:", totalPages);
      setPuestos(data);
      setTotalPages(response.data.meta.last_page); // Total de páginas
      setPaginaActual(response.data.meta.current_page); // Página actual
      console.log("Datos recuperados con exito", response.data);
    } catch (error) {
      console.error("Error al traer datos", error);
    }
  };

  useEffect(() => {
    fetchPuestos();
  }, []);

  // Filtrar puestos por Bloque / N° Puesto / Giro de Negocio
  const buscarPuestos = () => {
    fetchPuestos();
  }

  const CambioDePagina = (event: React.ChangeEvent<unknown>, value: number) => {
    setPaginaActual(value);
    fetchPuestos(value); // Obtén los datos para la página seleccionada
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
            mb: isMobile ? 2 : 3,
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
              width: isMobile ? "100%" : "230px",
              marginBottom: isMobile ? "1em" : "0",
              borderRadius: "30px",
            }}
            onClick={() => handleOpen()}
          >
            Agregar Puesto
          </Button>

          <RegistrarPuesto
            open={open}
            handleClose={handleClose}
            puesto={puestoSeleccionado}
          />

          <Box
            sx={{
              width: isMobile ? "100%" : "auto",
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
                onChange={(e) => setExportFormat(e.target.value)}
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
              onClick={handleExportPuestos}
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
              Filtrar Puestos
            </Button>
          </Box>
        )}

        {(!isMobile || mostrarFiltros) && (

          // Filtros de búsqueda
          <Box
            sx={{
              padding: isMobile ? "15px 0" : "15px 35px",
              borderTop: "1px solid rgba(0, 0, 0, 0.25)",
              borderBottom: "1px solid rgba(0, 0, 0, 0.25)",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "left" : "center",
            }}
          >
            <Typography 
              sx={{
                textAlign: "left",
                fontWeight: "bold", 
                mr: 2,
                mt: isMobile ? 1 : 0,
                mb: isMobile ? 2 : 0
              }}
            >
              Buscar por:
            </Typography>

            {/* Seleccionar Bloque */}
            <FormControl 
              sx={{ 
                width: isMobile ? "100%" : "200px", 
                mr: isMobile ? 0 : 2, 
                textAlign: "left" 
              }}
            >
              <InputLabel id="bloque-label">Bloque</InputLabel>
              <Select
                labelId="bloque-label"
                label="Bloque"
                id="select-bloque"
                value={bloqueSeleccionado}
                onChange={(e) => {
                  const value = e.target.value;
                  setBloqueSeleccionado(value);
                }}
              >
                <MenuItem value="" >Todos</MenuItem>
                {bloques.map((bloque: Bloque) => (
                  <MenuItem key={bloque.id_block} value={bloque.id_block}>
                    {bloque.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Input Numero de puesto */}
            <TextField 
              sx={{ 
                width: isMobile ? "100%" : "200px",
                mt: isMobile ? 2 : 0, 
                mb: isMobile ? 2 : 0, 
              }}
              type="text"
              label="Numero de puesto" 
              onChange={(e) => setNroPuestoIngresado(e.target.value)}
            />

            {/* Seleccionar Giro negocio */}
            <FormControl 
              sx={{ 
                width: isMobile ? "100%" : "200px", 
                ml: isMobile ? 0 : 2, 
                textAlign: "left" 
              }}
            >
              <InputLabel id="giro-negocio-label">Giro de negocio</InputLabel>
              <Select
                labelId="giro-negocio-label"
                label="Giro de negocio"
                id="select-giro-negocio"
                value={giroSeleccionado}
                onChange={(e) => {
                  const value = e.target.value;
                  setGiroSeleccionado(value);
                }}
              >
                <MenuItem value="">Todos</MenuItem>
                {girosNegocio.map((giro: GiroNegocio) => (
                  <MenuItem key={giro.id_gironegocio} value={giro.id_gironegocio}>
                    {giro.nombre}
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
                marginTop: isMobile ? 2 : 0,
                marginLeft: isMobile ? 0 : "1rem",
                borderRadius: "30px",
              }}
              onClick={buscarPuestos}
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
                        Lista de Puestos
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
                    ))
                  }
                </TableRow>
              </TableHead>
              <TableBody>
                {puestos.map((puesto) => (
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    {isMobile 
                    ? <TableCell padding="checkbox" colSpan={columns.length}>
                        <Box sx={{ display: "flex", flexDirection: "column"}}>
                          <Typography 
                            sx={{ 
                              p: 2,
                              // Seleccionar el puesto y cambiar el color de fondo
                              bgcolor: mostrarDetalles === puesto.id_puesto ? "#f0f0f0" : "inherit",
                              "&:hover": {
                                cursor: "pointer",
                                bgcolor: "#f0f0f0",
                              }
                            }}
                            onClick={() => setMostrarDetalles(
                              // Si el puesto seleccionado es igual al puesto actual, ocultar detalles
                              mostrarDetalles === puesto.id_puesto ? null : puesto.id_puesto
                            )}
                          >
                            {puesto.block.nombre} - {puesto.numero_puesto} - {puesto.giro_negocio.nombre}
                          </Typography>
                          {mostrarDetalles === puesto.id_puesto && (
                            <Box 
                              sx={{
                                p: 2,
                                display: "flex", 
                                flexDirection: "column", 
                                gap: 1 
                              }}
                            >
                              {columns.map((column) => {
                                const value = column.id === "accion" ? "" : (puesto as any)[column.id];
                                return (
                                  <Box>
                                    {/* Mostrar titulo del campo */}
                                    <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                                      {column.label}
                                    </Typography>
                                    {/* Mostrar los detalles del puesto */}
                                    <Typography>
                                      {column.id === "giro_negocio" ? (
                                        puesto.giro_negocio.nombre
                                      ) : column.id === "block" ? (
                                        puesto.block.nombre
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
                                            onClick={() => handleOpen(puesto)}
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
                        const value =
                          column.id === "accion"
                            ? ""
                            : (puesto as any)[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {/* Acciones */}
                            {column.id === "giro_negocio" ? (
                              puesto.giro_negocio.nombre
                            ) : column.id === "block" ? (
                              puesto.block.nombre
                            ) : column.id === "accion" ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 1,
                                  justifyContent: "center",
                                }}
                              >
                                <IconButton
                                  aria-label="edit"
                                  sx={{ color: "#0478E3" }}
                                  onClick={() => handleOpen(puesto)}
                                >
                                  <SaveAs />
                                </IconButton>
                                <IconButton
                                  aria-label="delete"
                                  sx={{ color: "red" }}
                                  onClick={() => alert("En proceso de actualización. Intentelo más tarde.")}
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
            <Pagination
              count={totalPages} // Total de páginas
              page={paginaActal} // Página actual
              onChange={CambioDePagina} // Manejar el cambio de página
              color="primary"
              // sx={{ marginLeft: "25%" }}
            />
          </Box>
        </Paper>
      </Card>
    </Box>
  );
};

export default TablaPuestos;
