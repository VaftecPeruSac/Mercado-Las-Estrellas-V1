import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Modal,
  Tabs,
  Tab,
  Typography,
  Grid,
  TextField,
  Table,
  TableContainer,
  Paper,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  IconButton,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { CalendarIcon } from "@mui/x-date-pickers";
import { AttachMoney, Bolt, Delete } from "@mui/icons-material";
import axios from "axios";

interface AgregarProps {
  open: boolean;
  handleClose: () => void;
}

interface Servicio {
  id_servicio: string,
  descripcion: string,
  costo_unitario: string,
  tipo_servicio: string,
  estado: string,
  fecha_registro: string
}

interface Column {
  id: keyof Data | "accion";
  label: string;
  minWidth?: number;
  align?: "center";
}

interface Data {
  desc_servicio: string;
  monto: string;
}

const columns: readonly Column[] = [
  {
    id: "desc_servicio",
    label: "Servicio",
    minWidth: 50,
    align: "center",
  },
  {
    id: "monto",
    label: "Monto",
    minWidth: 50,
    align: "center",
  },
  {
    id: "accion",
    label: "",
    minWidth: 50,
    align: "center",
  },
];

const initialRows: Data[] = [
  {
    desc_servicio: "Luz",
    monto: "40.00",
  },
  {
    desc_servicio: "Agua",
    monto: "15.00",
  },
];

const GenerarCuota: React.FC<AgregarProps> = ({ open, handleClose }) => {

  // Para seleccionar servicios
  const [servicios, setServicios] = useState<Servicio[]>([]);

  // Tabla servicios
  const [rows, setRows] = useState<Data[]>(initialRows);
  const [page, setPage] = useState(0);
  const [rowsPage, setRowsPage] = useState(5);

  const [itemsSeleccionados, setItemsSeleccionados] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  // Datos del formulario
  const [fechaEmision, setFechaEmision] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");

  // Cerrar modal
  const handleCloseModal = () => {
    handleClose();
  };

  // Obtener los servicios para el SelectList
  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await axios.get("https://mercadolasestrellas.online/intranet/public/v1/servicios");
        console.log("Servicios obtenidos:", response.data.data);
        setServicios(response.data.data);
      } catch (error) {
        console.error("Error al obtener los servicios", error);
      }
    }
    fetchServicios();
  }, []);

  // Para calcular la fecha de vencimiento de la cuota (La cuota vence en 30 dias)
  const manejarFechaEmisionCambio = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nuevaFechaEmision = event.target.value;
    setFechaEmision(nuevaFechaEmision);

    const fecha = new Date(nuevaFechaEmision);
    fecha.setDate(fecha.getDate() + 30);
    const fechaVencimientoFormateada = fecha.toISOString().split('T')[0];
    setFechaVencimiento(fechaVencimientoFormateada);
  };

  // Cambiar entre pestañas
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) =>
    setActiveTab(newValue);

  const manejarCheckCambio = (servicio: string) => {
    setItemsSeleccionados((prev) =>
      prev.includes(servicio)
        ? prev.filter((item) => item !== servicio)
        : [...prev, servicio]
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <>
            <Typography
              sx={{
                mt: 1,
                mb: 2,
                color: "#333",
                textAlign: "center",
                fontSize: "12px",
              }}
            >
              Leer detenidamente los campos antes de registrar. (*)
            </Typography>

            <Box
              component="form"
              noValidate
              autoComplete="off"
              sx={{ p: "0px 58px" }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    type="date"
                    label="Fecha de emisión"
                    value={fechaEmision}
                    onChange={manejarFechaEmisionCambio}
                    InputProps={{
                      startAdornment: (
                        <CalendarIcon sx={{ mr: 1, color: "gray" }} />
                      ),
                    }}
                    // error={!!errors.fechaEmision}
                    // helperText={errors.fechaEmision}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Fecha de vencimiento"
                    value={fechaVencimiento}
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <CalendarIcon sx={{ mr: 1, color: "gray" }} />
                      ),
                    }}
                    // error={!!errors.fechaVencimiento}
                    // helperText={errors.fechaVencimiento}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormControl fullWidth required>
                    <InputLabel id="servicio-label">Seleccionar Servicio</InputLabel>
                    <Select
                      labelId="servicio-label"
                      label="Seleccionar servicio"
                      // value={servicio}
                      // onChange={handleServicio}
                      startAdornment={<Bolt sx={{ mr: 1, color: "gray" }} />}
                    >
                      {servicios.map((servicio: Servicio) => (
                        <MenuItem key={servicio.id_servicio} value={servicio.id_servicio}>
                          {`${servicio.descripcion} - S/ ${servicio.costo_unitario}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {/* Tabla servicios */}
                <Grid item xs={12} sm={12}>
                  <Paper
                    sx={{
                      width: "524px",
                      overflow: "hidden",
                      boxShadow: "none",
                    }}
                  >
                    <TableContainer
                      sx={{
                        height: "220px",
                        mb: "5px",
                        borderRadius: "10px",
                        border: "1px solid #202123",
                      }}
                    >
                      <Table>
                        <TableHead sx={{ backgroundColor: "#202123" }}>
                          <TableRow>
                            {columns.map((column) => (
                              <TableCell
                                key={column.id}
                                align={column.align}
                                style={{ minWidth: column.minWidth }}
                                sx={{ color: "white" }}
                              >
                                {column.label}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows
                            .slice(page * rowsPage, page * rowsPage + rowsPage)
                            .map((row) => (
                              <TableRow hover role="checkbox" tabIndex={-1}>
                                {columns.map((column) => {
                                  const value =
                                    column.id === "accion"
                                      ? ""
                                      : (row as any)[column.id];
                                  return (
                                    <TableCell padding="checkbox" key={column.id} align="center">
                                      {column.id === "accion" ? (
                                        <Box
                                          sx={{
                                            display: "flex",
                                            gap: 1,
                                            justifyContent: "center",
                                          }}
                                        >
                                          <IconButton
                                            aria-label="delete"
                                            sx={{ color: "#840202" }}
                                          >
                                            <Delete />
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
                  </Paper>
                </Grid>
                {/* Importe */}
                <Grid item xs={12} sm={6} sx={{m: "auto auto 0 auto"}}>
                  <TextField
                    fullWidth
                    label="Importe (S/)"
                    required
                    // value={importe}
                    // onChange={manejarImporte}
                    InputProps={{
                      startAdornment: <AttachMoney sx={{ mr: 1, color: "gray" }} />,
                      readOnly: true
                    }}
                    // error={!!errors.importe}
                    // helperText={errors.importe}
                  />
                </Grid>
              </Grid>
            </Box>
          </>
        );
      default:
        return <Typography>Seleccione una pestaña</Typography>;
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleCloseModal}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Card
        sx={{
          width: "720px",
          height: "800px",
          p: "40px",
          bgcolor: "#f0f0f0",
          boxShadow: 24,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box
          sx={{
            backgroundColor: "#008001",
            p: 2,
            color: "#fff",
            borderRadius: 1,
          }}
        >
          <Typography
            id="modal-title"
            variant="h6"
            component="h2"
            sx={{ textAlign: "center", textTransform: "uppercase" }}
          >
            Nueva Cuota
          </Typography>
        </Box>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            sx={{ 
              "& .MuiTabs-flexContainer": {
                minHeight: "36px",
              },
              "& .MuiTab-root": {
                fontSize: "0.8rem",
                fontWeight: "normal",
                color: "gray",
                textTransform: "uppercase",
                minWidth: "auto",
                px: 2,
              },
              "& .MuiTab-root.Mui-selected": {
                fontWeight: "bold",
                color: "black !important",
              },
              "& .MuiTabs-indicator": {
                display: "none",
              },
              mb: -1,
            }}
          >
            <Tab label="Registrar Cuota" />
          </Tabs>
        </Box>

        {renderTabContent()}

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: "auto",
            p: "20px 58px 0 58px",
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <Button
            variant="contained"
            sx={{
              width: "140px",
              height: "45px",
              backgroundColor: "#202123",
              color: "#fff",
              mr: 1,
              "&:hover": {
                backgroundColor: "#3F4145",
              },
            }}
            onClick={handleCloseModal}
          >
            Cerrar
          </Button>
          <Button
            variant="contained"
            sx={{
              width: "140px",
              height: "45px",
              backgroundColor: "#008001",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#388E3C",
              },
            }}
            // onClick={}
          >
            Registrar
          </Button>
        </Box>
      </Card>
    </Modal>
  );
};

export default GenerarCuota;
