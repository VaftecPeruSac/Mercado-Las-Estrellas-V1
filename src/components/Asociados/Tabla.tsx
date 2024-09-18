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
} from "@mui/material";
import {
  Download,
  WhatsApp,
  Print,
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
  datos_socio: {
    nombre_socio: string;
    apellido_paterno: string;
    apellido_materno: string;
    dni: string;
    sexo: string;
    direccion: string;
    telefono: string;
    correo: string;
  }
  puesto: {
    id_puesto: string;
    numero_puesto: string;
    bloque: {
      id_block: string;
      nombre: string;
    }
    gironegocio_nombre: string;
    inquilino: {
      id_inquilino: string;
      nombre_inquilino: string;
    }
  }
  estado: string;
  fecha_registro: string;
  deuda: string;
  ver_reporte: string;
}

type NestedKeys<T> = {
  [K in keyof T]: K extends string
    ? T[K] extends object
      ? `${K}.${NestedKeys<T[K]>}`
      : K
    : never
}[keyof T];

interface Column {
  id: NestedKeys<Data> | "accion";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: any) => string;
}
interface Data {
  id_socio: string;
  nombre_completo: string;
  datos_socio: {
    nombre_socio: string;
    apellido_paterno: string;
    apellido_materno: string;
    dni: string;
    sexo: string;
    direccion: string;
    telefono: string;
    correo: string;
  }
  puesto: {
    id_puesto: string;
    numero_puesto: string;
    bloque: {
      id_block: string;
      nombre: string;
    }
    gironegocio_nombre: string;
    inquilino: {
      id_inquilino: string;
      nombre_inquilino: string;
    }
  }
  estado: string;
  fecha_registro: string;
  deuda: string;
  ver_reporte: string;
}

const columns: readonly Column[] = [
  { id: "nombre_completo", label: "Nombre", minWidth: 50 }, // Nombre del socio
  { id: "datos_socio.dni", label: "DNI", minWidth: 50 },      // DNI
  { id: "puesto.bloque.nombre", label: "Block", minWidth: 50 }, // Nombre del bloque
  { id: "puesto.numero_puesto", label: "Puesto", minWidth: 50 }, // Número del puesto
  { id: "puesto.gironegocio_nombre", label: "Giro", minWidth: 50 }, // Nombre del giro de negocio
  { id: "datos_socio.telefono", label: "Teléfono", minWidth: 50 },  // Teléfono
  { id: "datos_socio.correo", label: "Correo", minWidth: 50 },      // Correo
  { id: "puesto.inquilino.nombre_inquilino", label: "Inquilino", minWidth: 50 }, // Inquilino
  { id: "fecha_registro", label: "Fecha", minWidth: 50 }, // Fecha de registro
  { id: "deuda", label: "Deuda Total", minWidth: 50 }, // Deuda total
  { id: "ver_reporte", label: "Deudas / Pagos", minWidth: 10 }, // Ver Deuda / Pagos
  { id: "accion", label: "Acción", minWidth: 20 },    // Acción
];

const TablaAsociados: React.FC = () => {

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
        "id_socio": item.id_socio,
        "nombre_completo": item.nombre_completo,
        "datos_socio.nombre_socio": item.datos_socio.nombre_socio,
        "datos_socio.apellido_paterno": item.datos_socio.apellido_paterno,
        "datos_socio.apellido_materno": item.datos_socio.apellido_materno,
        "datos_socio.dni": item.datos_socio.dni,
        "datos_socio.direccion": item.datos_socio.direccion,
        "datos_socio.telefono": item.datos_socio.telefono,
        "datos_socio.correo": item.datos_socio.correo,
        "puesto.id_puesto": typeof item.puesto === 'object' ? item.puesto.id_puesto : '',
        "puesto.numero_puesto": typeof item.puesto === 'object' ? item.puesto.numero_puesto : 'No asignado',
        "puesto.bloque.id_block": typeof item.puesto === 'object' ? item.puesto.bloque.id_block : '',
        "puesto.bloque.nombre": typeof item.puesto === 'object' ? item.puesto.bloque.nombre : 'No asignado',
        "puesto.gironegocio_nombre": typeof item.puesto === 'object' ? item.puesto.gironegocio_nombre : 'No asignado',
        "puesto.inquilino.nombre_inquilino": typeof item.puesto.inquilino === 'object' ? item.puesto.inquilino.nombre_inquilino : 'No asignado',
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
              onClick={handleExportSocios}
            >
              Imprimir
            </Button>
          </Box>
        </Box>

        {/* Buscar socio */}
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

        {/* Input Nombre Socio */}
        <TextField 
          sx={{ width: "400px" }} 
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
            width: "170px",
            marginLeft: "25px",
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
