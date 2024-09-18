import { DeleteForever, Print, SaveAs, Search } from "@mui/icons-material";
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
      ></Box>

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
                onChange={(e) => setExportFormat(e.target.value)}
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
              onClick={handleExportPuestos}
            >
              Imprimir
            </Button>
          </Box>
        </Box>

        {/* Buscar */}
        <Box
          sx={{
            padding: "15px 35px",
            borderTop: "1px solid rgba(0, 0, 0, 0.25)",
            borderBottom: "1px solid rgba(0, 0, 0, 0.25)",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontWeight: "bold", mr: 2 }}>
            Buscar por:
          </Typography>

          {/* Seleccionar Bloque */}
          <FormControl sx={{ width: "200px", mr: 2, textAlign: "left" }}>
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
              <MenuItem value="">Todos</MenuItem>
              {bloques.map((bloque: Bloque) => (
                <MenuItem key={bloque.id_block} value={bloque.id_block}>
                  {bloque.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Input Numero de puesto */}
          <TextField 
            sx={{ width: "200px" }}
            type="text"
            label="Numero de puesto" 
            onChange={(e) => setNroPuestoIngresado(e.target.value)}
          />

          {/* Seleccionar Giro negocio */}
          <FormControl sx={{ width: "200px", ml: 2, textAlign: "left" }}>
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
              width: "170px",
              marginLeft: "25px",
              borderRadius: "30px",
            }}
            onClick={buscarPuestos}
          >
            Buscar
          </Button>
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
                {puestos
                  // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((puesto) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      {columns.map((column) => {
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
