import { DeleteForever, Print, SaveAs } from "@mui/icons-material";
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
} from "@mui/material";
import { GridAddIcon } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import RegistrarPuesto from "./RegistrarPuesto";

interface Puestos {
  numero_puesto: string;
  area: string;
  estado: string;
  fecha_registro: string;
  socio: string;
  gironegocio_nombre: string;
  block_nombre: string;
  inquilino: string;
}

interface Column {
  id: keyof Data | "accion";
  label: string;
  minWidth?: number;
  align?: "center";
  format?: (value: any) => string;
}

interface Data {
  numero_puesto: string;
  area: string;
  estado: string;
  fecha_registro: string;
  socio: string;
  gironegocio_nombre: string;
  block_nombre: string;
  inquilino: string;
}

const columns: readonly Column[] = [
  { id: "block_nombre", label: "Bloque", minWidth: 50 },
  { id: "numero_puesto", label: "N° Puesto", minWidth: 50 },
  { id: "area", label: "Área", minWidth: 50 },
  { id: "gironegocio_nombre", label: "Giro de Negocio", minWidth: 50 },
  { id: "socio", label: "Socio", minWidth: 50 },
  { id: "inquilino", label: "Inquilino", minWidth: 50 },
  { id: "estado", label: "Estado", minWidth: 50 },
  { id: "fecha_registro", label: "Fecha Registro", minWidth: 50 },
  { id: "accion", label: "Acciones", minWidth: 50 },
];

const TablaPuestos: React.FC = () => {
  // Para la tabla
  const [puestos, setPuestos] = useState<Data[]>([]);
  const [totalPages, setTotalPages] = useState(1); // Total de páginas
  const [paginaActal, setPaginaActual] = useState(1); // Página actual
  // const [rowsPerPage] = useState(10); // Número de filas por página

  // Para el modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Para exportar la información
  const [exportFormat, setExportFormat] = useState<string>("");

  // Metodo para exportar el listado de puestos
  const handleExportPuestos = async (e: React.MouseEvent<HTMLButtonElement>) => {

    e.preventDefault();

    try {
      const response = await axios.get("https://mercadolasestrellas.online/intranet/public/v1/puestos/exportar",
        {responseType: 'blob'}
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

  useEffect(() => {
    fetchPuestos();
  }, []);

  const fetchPuestos = async (page: number = 1) => {
    try {
      const response = await axios.get("https://mercadolasestrellas.online/intranet/public/v1/puestos?page=${page}"); //publico
      // const response = await axios.get("http://127.0.0.1:8000/v1/puestos?page=${page}"); //local

      const data = response.data.data.map((item: Puestos) => ({
        numero_puesto: item.numero_puesto,
        area: item.area,
        estado: item.estado,
        fecha_registro: formatDate(item.fecha_registro),
        socio: item.socio,
        gironegocio_nombre: item.gironegocio_nombre,
        block_nombre: item.block_nombre,
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
            onClick={handleOpen}
          >
            Agregar Puesto
          </Button>

          <RegistrarPuesto open={open} handleClose={handleClose} />

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
                            {column.id === "accion" ? (
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
