import {
  FileDownload,
  InsertDriveFile,
  Print,
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

interface Pagos {
id_pago: string,
puesto: string,
socio: string,
dni: string,
telefono: string,
correo: string,
total_pago: string,
total_deuda: string,
fecha_registro: string
}

interface Column {
id: keyof Data | "accion";
label: string;
minWidth?: number;
align?: "center";
}

interface Data {
id_pago: string,
puesto: string,
socio: string,
dni: string,
telefono: string,
correo: string,
total_pago: string,
total_deuda: string,
fecha_registro: string
}

const columns: readonly Column[] = [
{ id: "id_pago", label: "#ID", minWidth: 50, align: "center" },
{ id: "puesto", label: "N° Puesto", minWidth: 50, align: "center" },
{ id: "socio", label: "Socio", minWidth: 50, align: "center" },
{ id: "telefono", label: "DNI", minWidth: 50, align: "center" },
{ id: "correo", label: "Fecha", minWidth: 50, align: "center" },
{ id: "telefono", label: "Teléfono", minWidth: 50, align: "center" },
{ id: "correo", label: "Correo", minWidth: 50, align: "center" },
{ id: "total_pago", label: "A Cuenta", minWidth: 50, align: "center" },
{ id: "total_deuda", label: "Monto Actual", minWidth: 50, align: "center" },
{ id: "accion", label: "Acciones", minWidth: 50, align: "center" },
];

const TablaPago: React.FC = () => {

const [pagos, setPagos] = useState<Data[]>([]);
const [page, setPage] = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(5);

const [exportFormat, setExportFormat] = useState<string>("");

const [open, setOpen] = useState(false);

const [itemsSeleccionados, setItemsSeleccionados] = useState<string[]>([]);

const handleOpen = () => setOpen(true);
const handleClose = () => setOpen(false);

const manejarCheckCambio = (servicio: string) => {
  setItemsSeleccionados((prev) =>
    prev.includes(servicio)
      ? prev.filter((item) => item !== servicio)
      : [...prev, servicio]
  );
};

const handleExport = () => {
  console.log(`Exporting as ${exportFormat}`);
};

useEffect(() => {
  fetchData();
}, []);

const fetchData = async () => {
  try {
    const response = await axios.get("https://mercadolasestrellas.online/intranet/public/v1/pagos");
    // const response = await axios.get("http://127.0.0.1:8000/v1/pagos");

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
    console.log("La data es:", response.data);
  } catch (error) {
    console.error("Error al traer los datos", error);
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
            width: "230px",
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

      {/* Buscar Pagos X Socio */}
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
        <TextField sx={{ width: "400px" }} label="Nombre del socio" />

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
          // onClick={handleExport}
        >
          Buscar
        </Button>
      </Box>

      {/* Tabla Deudas */}
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
              {pagos
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id_pago}
                  >
                    {columns.map((column) => {
                      const value =
                        column.id === "accion" ? "" : (row as any)[column.id];
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
                              {/* Boton Ver deuda */}
                              <IconButton
                                aria-label="file"
                                sx={{ color: "#000" }}
                              >
                                <InsertDriveFile />
                              </IconButton>

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

        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}>
          <Pagination count={10} color="primary" />
        </Box>
      </Paper>
    </Card>
  </Box>
);
};

export default TablaPago;  