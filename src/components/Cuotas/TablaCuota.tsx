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
  useTheme,
  InputLabel,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import {
  Edit,
  Download,
  SaveAs,
  Delete,
  DeleteForever,
  MonetizationOn,
  Print,
  Search,
  Plagiarism,
  WhatsApp,
} from "@mui/icons-material";
import { GridAddIcon } from "@mui/x-data-grid";
import axios from "axios";
import GenerarCuota from "./GenerarCuota";

interface Cuotas {
  id_cuota: string; // Nombre del socio
  fecha_registro: string;
  fecha_vencimiento: string;
  importe: string;
}

interface Column {
  id: keyof Data | "accion";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: any) => string;
}

interface Data {
  id_cuota: string;
  fecha_registro: string;
  fecha_vencimiento: string;
  importe: string;
}

const columns: readonly Column[] = [
  { id: "id_cuota", label: "# ID", minWidth: 50 }, // Nombre del socio
  { id: "fecha_registro", label: "Fecha Emisión", minWidth: 50 }, // DNI
  { id: "fecha_vencimiento", label: "fecha_vencimiento", minWidth: 50 }, // Nombre del bloque
  { id: "importe", label: "Importe", minWidth: 50 }, // Número del puesto
  { id: "accion", label: "Acción", minWidth: 20 },
  // Acción
];

const TablaCuota: React.FC = () => {
  // Para la tabla
  // const [rows, setRows] = useState<Data[]>(initialRows);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [itemsSeleccionados, setItemsSeleccionados] = useState<string[]>([]);

  // Para exportar
  const [exportFormat, setExportFormat] = useState<string>("");

  // Para la buscar por fecha
  const [anio, setAnio] = useState<string>("");
  const [mes, setMes] = useState<string>("");

  // Para el modal
  const [open, setOpen] = useState(false);
  const [openPagar, setOpenPagar] = useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Para manejar los cambios
  const manejarCheckCambio = (servicio: string) => {
    setItemsSeleccionados((prev) =>
      prev.includes(servicio)
        ? prev.filter((item) => item !== servicio)
        : [...prev, servicio]
    );
  };

  const manejarAnioCambio = (evento: SelectChangeEvent<string>) => {
    setAnio(evento.target.value as string);
  };

  const manejarMesCambio = (evento: SelectChangeEvent<string>) => {
    setMes(evento.target.value as string);
  };

  const handleExport = () => {
    console.log(`Exporting as ${exportFormat}`);
  };

  const [cuotas, setCuotas] = useState<Data[]>([]);

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
    return `${formattedDay} / ${formattedMonth} / ${year}`;
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("https://mercadolasestrellas.online/intranet/public/v1/cuotas"); //publico
      // const response = await axios.get("http://127.0.0.1:8000/v1/cuotas"); //local

      const data = response.data.data.map((item: Cuotas) => ({
        id_cuota: item.id_cuota,
        fecha_registro: formatDate(item.fecha_registro),
        fecha_vencimiento: formatDate(item.fecha_vencimiento),
        importe: item.importe,
      }));
      setCuotas(data);
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
              onClick={handleExport}
            >
              Imprimir
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
              {[
                "Enero",
                "Febrero",
                "Marzo",
                "Abril",
                "Mayo",
                "Junio",
                "Julio",
                "Agosto",
                "Septiembre",
                "Octubre",
                "Noviembre",
                "Diciembre",
              ].map((mesNombre) => (
                <MenuItem key={mesNombre} value={mesNombre}>
                  {mesNombre}
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
            onClick={handleExport}
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
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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

          <Box sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}>
            <Pagination count={10} color="primary" />
          </Box>
        </Paper>
      </Card>
    </Box>
  );
};

export default TablaCuota;
