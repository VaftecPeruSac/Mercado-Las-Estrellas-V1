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
  SelectChangeEvent,
  LinearProgress,
} from "@mui/material";
import { CalendarIcon } from "@mui/x-date-pickers";
import { AttachMoney, Bolt, Delete } from "@mui/icons-material";
import axios from "axios";
import useResponsive from "../Responsive";
import { manejarError, mostrarAlerta, mostrarAlertaConfirmacion, validarCamposCuotas } from "../Alerts/Registrar";

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
  descripcion: string;
  costo_unitario: string;
}

const columns: readonly Column[] = [
  { id: "descripcion", label: "Servicio", minWidth: 50, align: "center" },
  { id: "costo_unitario", label: "Monto", minWidth: 50, align: "center" },
  { id: "accion", label: "", minWidth: 50, align: "center" },
];

const GenerarCuota: React.FC<AgregarProps> = ({ open, handleClose }) => {

  // Variables para el diseño responsivo
  const { isLaptop, isTablet, isMobile } = useResponsive();

  // Para seleccionar servicios
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [servicioSeleccionado, setServicioSeleccionado] = useState<{ value: unknown } | "">("");
  const [serviciosAgregados, setServiciosAgregados] = useState<Servicio[]>([]);
  const [serviciosIds, setServiciosIds] = useState<string[]>([]);

  // Para el importe total
  const [importeTotal, setImporteTotal] = useState<number>(0);

  // Para el modal
  const [activeTab, setActiveTab] = useState(0);

  // Datos del formulario
  const [fechaEmision, setFechaEmision] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [loading, setLoading] = useState(false);


  const [formData, setFormData] = useState({
    id_servicio: "",
    importe: "",
    fecha_registro: "",
    fecha_vencimiento: ""
  });

  // Para calcular la fecha de vencimiento de la cuota (La cuota vence en 30 dias)
  const manejarFechaEmisionCambio = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nuevaFechaEmision = event.target.value;
    setFechaEmision(nuevaFechaEmision);

    const fecha = new Date(nuevaFechaEmision);
    fecha.setDate(fecha.getDate() + 30);
    const fechaVencimientoFormateada = fecha.toISOString().split('T')[0];
    setFechaVencimiento(fechaVencimientoFormateada);
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

  // Para manejar el cambio de seleccion y agregar servicios a la tabla
  const handleServicioChange = (event: SelectChangeEvent<{ value: unknown } | "">) => {
    const servicioId = event.target.value as string;
    setServicioSeleccionado({ value: servicioId });

    // Encontramos el servicio seleccionado en la lista de servicios
    const servicio = servicios.find((s) => s.id_servicio === servicioId);

    // Si el servicio existe
    if (servicio) {
      // Verificamos si ya esta agregado y si no lo esta agregamos el servicio a la tabla
      if (!serviciosAgregados.some((s) => s.id_servicio === servicio.id_servicio)) {
        setServiciosAgregados([...serviciosAgregados, servicio]);
        setServiciosIds((prevIds) => [...prevIds, servicio.id_servicio]);
      }
    }
  };

  // Para eliminar un servicio de la lista
  const handleServicioDelete = (id: string) => {
    setServiciosAgregados(serviciosAgregados.filter((s) => s.id_servicio !== id));
    setServiciosIds((prevIds) => prevIds.filter((servicioId) => servicioId !== id));
  };

  // Para calcular el importe total
  useEffect(() => {
    const total = serviciosAgregados.reduce((sum, servicio) => sum + parseFloat(servicio.costo_unitario), 0);
    setImporteTotal(total);
  }, [serviciosAgregados]);

  const limpiarCuota = () => {
    setFormData({
      id_servicio: "",
      importe: "",
      fecha_registro: "",
      fecha_vencimiento: ""
    });
  }
  // Generar cuota
  const registrarCuota = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    const isValid = validarCamposCuotas(formData, ['fecha_registro', 'fecha_vencimiento']) && servicioSeleccionado;
    if (!isValid) {
      setLoading(false);
      return;
    }

    const dataToSend = {
      ...formData,
      servicios: serviciosIds,
      importe: importeTotal,
    };

    try {
      const response = await axios.post("https://mercadolasestrellas.online/intranet/public/v1/cuotas", dataToSend);
      // const response = await axios.post("http://127.0.0.1:8000/v1/cuotas", dataToSend);

      if (response.status === 200) {
        const mensaje = response.data.message || "La cuota fue registrada con éxito";
        mostrarAlerta("Registro exitoso", mensaje, "success").then(() => {
          setServiciosAgregados([]);
          setServiciosIds([]);
          setImporteTotal(0);
          onRegistrar();
          handleCloseModal();
        });
      } else {
        mostrarAlerta("Error");
      }
    } catch (error) {
      manejarError(error);
    } finally {
      setLoading(false);
    }
  };


  // Cambiar entre pestañas
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) =>
    setActiveTab(newValue);

  // Cerrar modal
  const handleCloseModal = () => {
    limpiarCuota();
    handleClose();
  };

  const onRegistrar = () => {
    window.location.reload();
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

            {/* <pre>{JSON.stringify(formData, null, 2)}</pre> */}

            <Box
              component="form"
              noValidate
              autoComplete="off"
              sx={{ p: isTablet || isMobile ? "0px" : "0px 58px" }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    type="date"
                    label="Fecha de emisión"
                    value={formData.fecha_registro = fechaEmision}
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
                    value={formData.fecha_vencimiento = fechaVencimiento}
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
                      value={servicioSeleccionado}
                      onChange={handleServicioChange}
                      startAdornment={<Bolt sx={{ mr: 1, color: "gray" }} />}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                            overflowY: 'auto', // Habilita el desplazamiento
                          },
                        },
                      }}
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
                      width: isLaptop || isTablet || isMobile ? "100%" : "524px",
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
                          {serviciosAgregados.map((servicio) => (
                            <TableRow hover role="checkbox" tabIndex={-1}>
                              {columns.map((column) => {
                                const value = column.id === "accion" ? "" : (servicio as any)[column.id];
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
                                          onClick={() => handleServicioDelete(servicio.id_servicio)}
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
                <Grid item xs={12} sm={6} sx={{ m: "auto auto 0 auto" }}>
                  <TextField
                    fullWidth
                    required
                    label="Importe (S/)"
                    value={importeTotal.toFixed(2)}
                    InputProps={{
                      readOnly: true,
                      startAdornment: <AttachMoney sx={{ mr: 1, color: "gray" }} />
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
          width: isTablet ? "90%" : isMobile ? "95%" : "720px",
          height: isLaptop || isTablet || isMobile ? "90%" : "800px",
          p: isMobile ? 3 : "40px",
          bgcolor: "#f0f0f0",
          boxShadow: 24,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          overflowY: "auto",
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
        {loading && (
          <div style={{ textAlign: "center", marginBottom: "5px" }}>
            <LinearProgress aria-description="dd" color="primary" />
            {/* <p>Cargando...</p> */}
          </div>
        )}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          {/* <Tabs
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
          </Tabs> */}
        </Box>

        {renderTabContent()}

        <Box
          sx={{
            display: "flex",
            justifyContent: isTablet || isMobile ? "center" : "flex-end",
            mt: "auto",
            p: isTablet || isMobile ? "20px 0px 0px 0px" : "20px 58px 0 58px",
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
              backgroundColor: loading ? "#aaa" : "#008001",
              color: "#fff",
              "&:hover": {
                backgroundColor: loading ? "#aaa" : "#388E3C",
              },
            }}
            onClick={async (e) => {
              // Cambiar a función asíncrona
              const result = await mostrarAlertaConfirmacion(
                "¿Está seguro de registrar un nuevo socio?"
              );

              if (result.isConfirmed) {
                registrarCuota(e); // Llamar a la función para registrar la cuota
              }
            }}
            disabled={loading} // Deshabilita el botón cuando está en loading
          >
            {loading ? "Cargando..." : "Registrar"}
          </Button>
        </Box>
      </Card>
    </Modal>
  );
};

export default GenerarCuota;
