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
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import {
  Download,
  Search,
  Plagiarism,
  WhatsApp,
} from "@mui/icons-material";
import { GridAddIcon } from "@mui/x-data-grid";
import axios from "axios";
import GenerarCuota from "./GenerarCuota";

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
  { id: "fecha_vencimiento", label: "fecha_vencimiento", minWidth: 50 }, // Nombre del bloque
  { id: "importe", label: "Importe", minWidth: 50 }, // Número del puesto
  { id: "accion", label: "Acción", minWidth: 20 },
  // Acción
];

// const options = [
//   { value: 'chocolate', label: 'Chocolate' },
//   { value: 'strawberry', label: 'Strawberry' },
//   { value: 'vanilla', label: 'Vanilla' },
// ];
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

  const manejarAnioCambio = (evento: SelectChangeEvent<string>) => {
    setAnio(evento.target.value as string);
  };

  const manejarMesCambio = (evento: SelectChangeEvent<string>) => {
    setMes(evento.target.value as string);
  };

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
  const handleSearchCuota = async (e: React.MouseEvent<HTMLButtonElement>) => {

    e.preventDefault();

    // try {
    //   alert("En proceso de actualización.");
    // } catch {
    //   alert("Error al buscar la cuota. Intentelo nuevamente más tarde.")
    // }
    fetchCuotas(1);

  }

  useEffect(() => {
    fetchCuotas();
  }, []);

  const formatDate = (fecha: string): string => {
    const date = new Date(fecha);
    const day = date.getDate();
    const month = date.getMonth() + 1; 
    const year = date.getFullYear();
    const formattedDay = day.toString().padStart(2, "0");
    const formattedMonth = month.toString().padStart(2, "0");
    return `${formattedDay} / ${formattedMonth} / ${year}`;
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
  // setIMeses([]);

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
      />

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
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
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
              width: "230px",
              borderRadius: "30px",
            }}
            onClick={handleOpen}
          >
            Generar Cuota
          </Button>

          <GenerarCuota open={open} handleClose={handleClose} />

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
                onChange={(e) => setExportFormat(e.target.value as string)}
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
                width: "200px",
                borderRadius: "30px",
              }}
              disabled={ exportFormat === "" }
              onClick={handleExportCuotas}
            >
              Descargar
            </Button>
          </Box>
        </Box>

        {/* Buscar cuotas */}
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

          {/* Seleccionar año */}
          <FormControl sx={{ minWidth: 250, mr: 1 }}>
            <InputLabel id="cuota-anio-label">Año</InputLabel>
            <Select value={anio} onChange={manejarAnioCambio} label="Año">
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
          <FormControl sx={{ minWidth: 250, mr: 1 }}>
            <InputLabel id="cuota-mes-label">Mes</InputLabel>
            <Select value={mes} onChange={manejarMesCambio} label="Mes">
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
              width: "170px",
              marginLeft: "25px",
              borderRadius: "30px",
            }}
            onClick={handleSearchCuota}
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
                {cuotas
                  // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      {columns.map((column) => {
                        const value =
                          column.id === "accion" ? "" : (row as any)[column.id];
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
                                {" "}
                                {/* Alinea los íconos a la derecha */}
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
      </Card>
    </Box>
  );
};

export default TablaCuota;
