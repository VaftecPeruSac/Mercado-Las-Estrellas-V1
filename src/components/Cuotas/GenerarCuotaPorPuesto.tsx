import React, { useEffect, useState } from "react";
import {
  Box,
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
  Button,
} from "@mui/material";
import { CalendarIcon } from "@mui/x-date-pickers";
import { AttachMoney, Bolt, Delete } from "@mui/icons-material";
import useResponsive from "../../hooks/Responsive/useResponsive";
import { manejarError, mostrarAlerta } from "../Alerts/Registrar";
import { AvisoFormulario, TxtFormulario } from "../Shared/ElementosFormulario";
import apiClient from "../../Utils/apliClient";
import { Api_Global_Cuotas } from "../../service/CuotaApi";
import { ColumnServicios } from "../../interface/Cuota";
import { Servicio } from "../../interface/Servicios";
import ContenedorMini from "../Shared/ContenedorMini";
import { Puesto } from "../../interface/Puestos";
import { Business } from "@mui/icons-material";

const columns: readonly ColumnServicios[] = [
  { id: "nombre", label: "Servicio", minWidth: 50, align: "center" },
  { id: "costo_unitario", label: "Monto", minWidth: 50, align: "center" },
  { id: "accion", label: "", minWidth: 50, align: "center" },
];

const GenerarCuotaPorPuesto: React.FC = () => {

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
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [puestoSeleccionado, setPuestoSeleccionado] = useState<{ value: unknown } | "">("");

  const [formData, setFormData] = useState({
    fecha_emision: "",
    fecha_vencimiento: "",
    id_puesto: ""
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
        const response = await apiClient.get(Api_Global_Cuotas.servicio.listar());  
        setServicios(response.data.data);
      } catch (error) {
      }
    }
    fetchServicios();
  }, []);

  // Obtener los puestos para el SelectList
  useEffect(() => {
    const fetchPuestos = async () => {
      try {
        const response = await apiClient.get(Api_Global_Cuotas.puesto.listar());  
        setPuestos(response.data.data);
      } catch (error) {
      }
    }
    fetchPuestos();
  }, []);

  // Para manejar el cambio de seleccion y agregar puestos a la tabla
  const handlePuestoChange = (event: SelectChangeEvent<{ value: unknown } | "">) => {
    const puestoId = event.target.value as any;
    setPuestoSeleccionado(puestoId);

    setFormData({
      ...formData,
      id_puesto: puestoId,
    });
  };

  // Para manejar el cambio de seleccion y agregar servicios a la tabla
  const handleServicioChange = (event: SelectChangeEvent<{ value: unknown } | "">) => {
    const servicioId = event.target.value as string;
    setServicioSeleccionado({ value: servicioId });
    const servicio = servicios.find((s) => s.id_servicio === servicioId);
    if (servicio) {
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
      fecha_emision: "",
      fecha_vencimiento: "",
      id_puesto: ""
    });
    setFechaEmision("");
    setFechaVencimiento("");
    setPuestoSeleccionado("");
    setServiciosAgregados([]);
    setServiciosIds([]);
  }

  // Generar cuota
  const registrarCuota = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    const dataToSend = {
      ...formData,
      servicios: serviciosIds,
    };
    try {
      const response = await apiClient.post(Api_Global_Cuotas.cuotas.registrarPorPuesto(), dataToSend);
      if (response.status === 200) {
        const mensaje = response.data.message || "La cuota fue registrada con éxito";
        mostrarAlerta("Registro exitoso", mensaje, "success").then(() => {
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

  const handleCloseModal = () => {
    limpiarCuota();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <>
            <AvisoFormulario />
            {/* <pre>{JSON.stringify(formData, null, 2)}</pre> */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TxtFormulario
                  type="date"
                  label="Fecha de emisión"
                  name="fecha_registro"
                  value={formData.fecha_emision =  fechaEmision}
                  onChange={manejarFechaEmisionCambio}
                  noMargin={true}
                  icono={<CalendarIcon sx={{ mr: 1, color: "gray" }} />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TxtFormulario
                  type="date"
                  label="Fecha de vencimiento"
                  name="fecha_vencimiento"
                  value={formData.fecha_vencimiento = fechaVencimiento}
                  onChange={(e) => setFechaVencimiento(e.target.value)}
                  noMargin={true}
                  icono={<CalendarIcon sx={{ mr: 1, color: "gray" }} />}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <FormControl fullWidth required>
                  <InputLabel id="servicio-label">
                    Seleccionar Servicio
                  </InputLabel>
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
                          overflowY: "auto", 
                        },
                      },
                    }}
                  >
                    {servicios.map((servicio: Servicio) => (
                      <MenuItem
                        key={servicio.id_servicio}
                        value={servicio.id_servicio}
                      >
                        {`${servicio.nombre} - S/ ${servicio.costo_unitario}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12}>
                <FormControl fullWidth required>
                  <InputLabel id="seleccionar-puesto-label">
                    Seleccionar Puesto
                  </InputLabel>
                  <Select
                    labelId="seleccionar-puesto-label"
                    label="Seleccionar Puesto"
                    id="select-puesto"
                    name="id_puesto"
                    value={puestoSeleccionado}
                    onChange={handlePuestoChange}
                    startAdornment={<Business sx={{ mr: 1, color: "gray" }} />}
                  >
                    {puestos.map((puesto: Puesto) => (
                      <MenuItem key={puesto.id_puesto} value={puesto.id_puesto}>
                        {puesto.numero_puesto}
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
                              const value =
                                column.id === "accion"
                                  ? ""
                                  : (servicio as any)[column.id];
                              return (
                                <TableCell
                                  padding="checkbox"
                                  key={column.id}
                                  align="center"
                                >
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
                                        onClick={() =>
                                          handleServicioDelete(
                                            servicio.id_servicio
                                          )
                                        }
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
              <Grid item xs={12} sm={6} sx={{ m: "0 auto 0 auto"  }}>
                <TextField
                  fullWidth
                  required
                  label="Importe (S/)"
                  value={importeTotal.toFixed(2)}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <AttachMoney sx={{ mr: 1, color: "gray" }} />
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </>
        );
      default:
        return <Typography>Seleccione una pestaña</Typography>;
    }
  };

  return (
    <ContenedorMini>
      {renderTabContent()}
      <div style={{ textAlign:"center", marginTop: "15px" }}>
      <Button
        variant="contained"
        sx={{
          width: "140px",
          height: "45px",
          mr: 1,
          backgroundColor: "#008001",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#388E3C",
          },
        }}
        onClick={registrarCuota}
      >
        Registrar
      </Button>
      </div>
    </ContenedorMini>
  );
};

export default GenerarCuotaPorPuesto;
