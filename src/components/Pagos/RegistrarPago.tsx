import { Business } from "@mui/icons-material";
import {
  Box,
  Card,
  Modal,
  Tabs,
  Tab,
  Typography,
  Button,
  Grid,
  TextField,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Autocomplete,
  LinearProgress,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import useResponsive from "../Responsive";
import { manejarError, mostrarAlerta, mostrarAlertaConfirmacion } from "../Alerts/Registrar";

interface AgregarProps {
  open: boolean;
  handleClose: () => void;
}

interface Socio {
  id_socio: number;
  nombre_completo: string;
}

interface Puesto {
  id_puesto: number;
  numero_puesto: string;
}

interface Deuda {
  id_deuda: number;
  total: string;
  anio: string;
  mes: string;
  a_cuenta: string;
  deuda: string;
}

interface Column {
  id: keyof Data | "accion";
  label: string;
  minWidth?: number;
  align?: "center";
}

interface Data {
  id_deuda: number;
  total: string;
  anio: string;
  mes: string;
  a_cuenta: string;
  deuda: string;
  pago: string;
}

const columns: readonly Column[] = [
  { id: "id_deuda", label: "#ID Cuota", minWidth: 50, align: "center" },
  { id: "anio", label: "Año", minWidth: 50, align: "center" },
  { id: "mes", label: "Mes", minWidth: 50, align: "center" },
  { id: "total", label: "Total (S/)", minWidth: 50, align: "center" },
  { id: "a_cuenta", label: "A cuenta (S/)", minWidth: 50, align: "center" },
  { id: "pago", label: "Pago (S/)", minWidth: 50, align: "center" },
  { id: "accion", label: "", minWidth: 30, align: "center" },
];

const RegistrarPago: React.FC<AgregarProps> = ({ open, handleClose }) => {

  // Variables para el diseño responsivo
  const { isLaptop, isTablet, isMobile } = useResponsive();

  // Para los select
  const [socios, setSocios] = useState<Socio[]>([]);
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [idSocioSeleccionado, setIdSocioSeleccionado] = useState("");
  const [idPuestoSeleccionado, setIdPuestoSeleccionado] = useState("");

  // Para la tabla
  const [deudas, setDeudas] = useState<Data[]>([]);
  const [filasSeleccionadas, setFilasSeleccionadas] = useState<({ [key: string]: boolean; })>({});

  // Para guardar el monto por deuda
  const [montoPagar, setMontoPagar] = useState<{ [key: number]: number }>({});

  // Para manejar los pagos
  const [totalPagar, setTotalPagar] = useState(0);
  const [totalDeuda, setTotalDeuda] = useState(0);

  // Para el modal
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false); // Estado de loading

  // Para registrar el pago
  const [formData, setFormData] = useState({
    id_socio: "",
    deudas: [{
      id_deuda: 0,
      importe: 0
    }]
  });

  // Obtener Lista Socios
  useEffect(() => {
    const fetchSocios = async () => {
      try {
        const response = await axios.get(`https://mercadolasestrellas.online/intranet/public/v1/socios?per_page=50`);
        const data = response.data.data.map((item: Socio) => ({
          id_socio: item.id_socio,
          nombre_completo: item.nombre_completo,
        }));
        setSocios(data);
      } catch (error) {
        console.error("Error al obtener los socios", error);
      }
    };
    fetchSocios();
  }, []);

  // Obtener Lista Puestos
  const fetchPuestos = async (idSocio: string) => {
    try {
      const response = await axios.get(`https://mercadolasestrellas.online/intranet/public/v1/puestos?per_page=50&id_socio=${idSocio}`);
      const data = response.data.data.map((item: Puesto) => ({
        id_puesto: item.id_puesto,
        numero_puesto: item.numero_puesto,
      }));
      setPuestos(data);
    } catch (error) {
      console.error("Error al obtener los puestos", error);
    }
  };

  // Obtener deuda cuota por puesto
  const fetchDeudaPuesto = async (idSocio: string, idPuesto: string) => {
    try {
      const response = await axios.get(`https://mercadolasestrellas.online/intranet/public/v1/cuotas/pendientes?per_page=50&id_socio=${idSocio}&id_puesto=${idPuesto}`);
      const data = response.data.data.map((item: Deuda) => ({
        id_deuda: item.id_deuda,
        total: item.total,
        anio: item.anio,
        mes: item.mes,
        a_cuenta: item.a_cuenta,
        deuda: item.deuda,
      }));
      setDeudas(data);
    } catch (error) {
      console.error("Error al obtener las deudas", error);
    }
  };

  // Calcular el total de la deuda de las filas seleccionadas
  const calcularTotalDeudaSeleccionado = () => {
    let total = 0;
    Object.keys(filasSeleccionadas).forEach((id_deuda) => {
      if (filasSeleccionadas[id_deuda]) {
        const fila = deudas.find((deuda) => deuda.id_deuda === parseInt(id_deuda));
        if (fila) {
          total += parseFloat(fila.deuda);
        }
      }
    });
    setTotalDeuda(total);
  };

  // Calcular el total a pagar de las filas seleccionadas
  const calcularTotalSeleccionado = () => {
    let total = 0;
    Object.keys(filasSeleccionadas).forEach((id_deuda) => {
      if (filasSeleccionadas[id_deuda]) {
        // Obtener el elemento del TextField que corresponde a esta deuda
        const inputElement = document.getElementById(`pago-${id_deuda}`) as HTMLInputElement;
        // Si el elemento existe, tomar su valor actual
        if (inputElement) {
          const montoActual = parseFloat(inputElement.value) || 0;
          total += montoActual;
        }
      }
    });
    setTotalPagar(total);
  };

  useEffect(() => {
    calcularTotalDeudaSeleccionado();
    calcularTotalSeleccionado();
  }, [filasSeleccionadas]);

  // Manejar las filas seleccionadas
  const handleCheckBoxChange = (seleccionado: boolean, idDeuda: number, montoPagar: number, montoInicial: number) => {

    // Manejamos las filas seleccionadas
    setFilasSeleccionadas((estadoPrevio) => ({
      ...estadoPrevio,
      [idDeuda]: seleccionado
    }));

    if (seleccionado) {

      // Para almacenar el arreglo de deudas en el formulario
      setFormData((prevFormData) => ({
        ...prevFormData,
        deudas: [
          // Evitamos que las deudas se repitan
          ...prevFormData.deudas.filter(deuda => deuda.id_deuda !== idDeuda),
          // Agregamos la nuevas deudas y su monto a pagar
          { id_deuda: idDeuda, importe: montoPagar }
        ]
      }));

    } else {

      // Al deseleccionar, eliminamos la deuda correspondiente
      setFormData((prevFormData) => ({
        ...prevFormData,
        deudas: prevFormData.deudas.filter(deuda => deuda.id_deuda !== idDeuda)
      }));

      setMontoPagar((prevMonto) => {
        const nuevoMonto = { ...prevMonto };
        delete nuevoMonto[idDeuda];
        return nuevoMonto;
      });

    }

    // Eliminamos el valor por defecto
    setFormData((prevFormData) => ({
      ...prevFormData,
      deudas: prevFormData.deudas.filter(deuda => deuda.id_deuda !== 0 && deuda.importe !== 0)
    }));

    calcularTotalSeleccionado();

  };

  // Actualizar el monto a pagar de cada cuota
  const actualizarMontoPagar = (idDeuda: number, nuevoMonto: number, montoInicial: number) => {

    // Validamos que el monto no sea mayor al inicial
    const validarMonto = Math.min(nuevoMonto, montoInicial);

    setMontoPagar((prevMonto) => ({
      ...prevMonto,
      // Actualizamos el monto para la deuda seleccionada
      [idDeuda]: validarMonto
    }));

    // Actualizamos los valores
    setFormData((prevFormData) => ({
      ...prevFormData,
      deudas: prevFormData.deudas.map(
        deuda => deuda.id_deuda === idDeuda
          ? { ...deuda, importe: validarMonto } // Actualizar el importe
          : deuda // Mantener la deuda sin cambios
      )
    }));

    calcularTotalSeleccionado();

  };

  // Limpiar modal
  const limpiarCampos = () => {

    // Reiniciamos los select
    setIdSocioSeleccionado("");
    setIdPuestoSeleccionado("");

    // Reiniciar las filas seleccionadas
    setFilasSeleccionadas({});

    // Limpiar formulario
    setFormData({
      id_socio: "",
      deudas: [{
        id_deuda: 0,
        importe: 0
      }]
    });

    // Limpiar la tabla
    setDeudas([]);

  };

  // Cerrar modal
  const handleCloseModal = () => {
    setMontoPagar({});
    handleClose();
    window.location.reload();
    limpiarCampos();
  };

  const CerrarModal = () => {
    handleClose();
    setMontoPagar({});
    limpiarCampos();
  }


  // REGISTRAR PAGO
  const registrarPago = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    const dataToSend = { ...formData };

    try {
      const response = await axios.post("https://mercadolasestrellas.online/intranet/public/v1/pagos", dataToSend);

      if (response.status === 200) {
        const mensaje = response.data || "El pago fue registrado correctamente";
        mostrarAlerta("Registro exitoso", mensaje, "success");
        handleCloseModal();
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

  // Contenido del modal
  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <>
            <Box
              component="form"
              noValidate
              autoComplete="off"
              sx={{ p: isTablet || isMobile ? "0px" : "0px 58px" }}
            >
              {/* <pre>{JSON.stringify(formData, null, 2)}</pre> */}

              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} marginTop={1}>
                  {/* Seleccionar socio */}
                  <FormControl
                    sx={{
                      width: isMobile ? "100%" : "48%",
                      mb: isMobile ? "15px" : "0px"
                    }}
                  >
                    <Autocomplete
                      options={socios}
                      getOptionLabel={(socio: Socio) => socio.nombre_completo}
                      onChange={(event, newValue) => {
                        if (newValue) {
                          const socioId = String(newValue.id_socio); // Convertimos id_socio a string
                          setIdSocioSeleccionado(socioId); // Asignamos el string
                          setFormData({ ...formData, id_socio: socioId }); // Mantenemos el string en formData
                          fetchPuestos(socioId); // Pasamos el id_socio como string
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Seleccionar Socio"
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <>
                                <Business sx={{ mr: 1, color: "gray" }} />
                                {params.InputProps.startAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                      ListboxProps={{
                        style: {
                          maxHeight: 270,
                          overflow: "auto",
                        },
                      }}
                      isOptionEqualToValue={(option, value) =>
                        option.id_socio === Number(value)
                      } // Convertimos value a número para la comparación
                    />
                  </FormControl>

                  {/* Seleccionar puesto */}
                  <FormControl
                    sx={{
                      ml: isTablet ? "1rem" : isMobile ? "0px" : "23px",
                      width: isMobile ? "100%" : "48%"
                    }}
                  >
                    <InputLabel id="seleccionar-puesto-label">
                      Seleccionar Puesto
                    </InputLabel>
                    <Select
                      labelId="seleccionar-puesto-label"
                      label="Seleccionar Puesto"
                      id="select-puesto"
                      value={idPuestoSeleccionado}
                      onChange={(e) => {
                        const value = e.target.value;
                        setIdPuestoSeleccionado(value);
                        fetchDeudaPuesto(idSocioSeleccionado, value);
                      }}
                      startAdornment={
                        <Business sx={{ mr: 1, color: "gray" }} />
                      }
                    >
                      {puestos.map((puesto: Puesto) => (
                        <MenuItem
                          key={puesto.id_puesto}
                          value={puesto.id_puesto}
                        >
                          {puesto.numero_puesto}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Tabla deudas */}
                <Grid item xs={12} sm={12}>
                  <Paper
                    sx={{
                      width: "100%",
                      overflow: "hidden",
                      boxShadow: "none",
                    }}
                  >
                    <TableContainer
                      sx={{
                        height: "250px",
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
                          {deudas.map((deuda) => {
                            // Calculamos el monto a pagar
                            const montoInicial = parseFloat(deuda.deuda)
                            const seleccionado = filasSeleccionadas[deuda.id_deuda] || false;

                            // Si el monto a pagar se a cambiado, usamos el nuevo monto; si no, usamos el monto inicial
                            const nuevoMonto =
                              montoPagar[deuda.id_deuda] !== undefined
                                ? montoPagar[deuda.id_deuda]
                                : montoInicial;

                            return (
                              <TableRow
                                hover
                                tabIndex={-1}
                                key={deuda.id_deuda}
                              >
                                {columns.map((column) => {
                                  let value =
                                    column.id === "accion"
                                      ? ""
                                      : (deuda as any)[column.id];

                                  if (column.id === "pago") {
                                    value = nuevoMonto;
                                  }

                                  return (
                                    <TableCell
                                      key={column.id}
                                      align="center"
                                      padding="checkbox"
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
                                            aria-label="select_row"
                                            sx={{ color: "#840202" }}
                                          >
                                            <Checkbox
                                              checked={seleccionado}
                                              onChange={(e) =>
                                                handleCheckBoxChange(
                                                  e.target.checked,
                                                  deuda.id_deuda,
                                                  montoInicial,
                                                  montoInicial
                                                )
                                              }
                                            />
                                          </IconButton>
                                        </Box>
                                      ) : column.id === "pago" ? (
                                        <TextField
                                          id={`pago-${deuda.id_deuda}`}
                                          type="number"
                                          name="pago"
                                          value={nuevoMonto}
                                          onChange={(e) => {
                                            const value =
                                              parseFloat(e.target.value) || 0;
                                            actualizarMontoPagar(
                                              deuda.id_deuda,
                                              value,
                                              montoInicial
                                            );
                                            calcularTotalSeleccionado();
                                          }}
                                          InputProps={{
                                            // Si no esta seleccionado no se puede editar el monto a pagar
                                            readOnly: !seleccionado,
                                          }}
                                          sx={{
                                            width: "100px",
                                          }}
                                        />
                                      ) : (
                                        value
                                      )}
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>

                {/* Monto a pagar */}
                <Box
                  sx={{
                    m: "25px 0 0 auto",
                    pl: isMobile ? "16px" : "0px",
                  }}
                >
                  <TextField
                    label="Total deuda"
                    value={totalDeuda}
                    focused
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <Typography sx={{ mr: 1 }}>S/</Typography>
                      ),
                    }}
                    sx={{
                      mr: 2,
                      mb: isMobile ? "15px" : "0px",
                      width: isMobile ? "100%" : "200px",
                    }}
                  />
                  <TextField
                    color="success"
                    label="Monto a pagar"
                    value={totalPagar}
                    focused
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <Typography sx={{ mr: 1 }}>S/</Typography>
                      ),
                    }}
                    sx={{
                      width: isMobile ? "100%" : "200px",
                    }}
                  />
                </Box>
              </Grid>
            </Box>
          </>
        );
      default:
        return "";
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
          width: isLaptop ? "60%" : isTablet ? "90%" : isMobile ? "95%" : "1000px",
          height: isLaptop || isTablet || isMobile ? "90%" : "720px",
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
            Registrar Pago
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
            <Tab label="Registrar Pago" />
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
            onClick={CerrarModal}
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
              const result = await mostrarAlertaConfirmacion(
                "¿Está seguro de registrar este pago?",
              );
              if (result.isConfirmed) {
                registrarPago(e);
              }
            }}
            disabled={loading}
          >
            {loading ? "Cargando..." : "Registrar"}

          </Button>
        </Box>
      </Card>
    </Modal>
  );
};

export default RegistrarPago;
