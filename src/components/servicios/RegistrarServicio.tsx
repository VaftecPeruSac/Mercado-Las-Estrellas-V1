import { AttachMoney, Bolt, Event, Storefront, Straighten } from '@mui/icons-material';
import { Box, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import useResponsive from '../Responsive';
import { manejarError, mostrarAlerta, mostrarAlertaConfirmacion } from '../Alerts/Registrar';
import BotonesModal from '../Shared/BotonesModal';
import ContenedorModal from '../Shared/ContenedorModal';

interface AgregarProps {
  open: boolean;
  handleClose: () => void;
  servicio: Editarservicio | null;
}

interface Editarservicio {
  id_servicio: string;
  descripcion: string;
  costo_unitario: string;
  tipo_servicio: string;
  fecha_registro: string;
}

const RegistrarServicio: React.FC<AgregarProps> = ({ open, handleClose, servicio }) => {

  // Variables para el diseño responsivo
  const { isTablet, isMobile } = useResponsive();
  const [loading, setLoading] = useState(false); // Estado de loading

  const [activeTab, setActiveTab] = useState(0);

  const [costoTotal, setCostoTotal] = useState("");
  const [costoMetroCuadrado, setCostoMetroCuadrado] = useState(0);
  const [puestosActivos, setPuestosActivos] = useState(0);
  const [areaTotal, setAreaTotal] = useState(0);

  // Datos para registrar el servicio
  const [formData, setFormData] = useState({
    id_servicio: "",
    descripcion: "",
    costo_unitario: "",
    tipo_servicio: "",
    estado: "Activo",
    fecha_registro: "",
  });

  const formatDate = (fecha: string) => {
    const [dia, mes, anio] = fecha.split("/");
    return `${anio}-${mes}-${dia}`;
  };

  // Llenar campos con los datos del servicio seleccionado
  useEffect(() => {
    if (servicio) {
      console.log("Servicio obtenido:", servicio);
      setFormData({
        id_servicio: servicio.id_servicio || "",
        descripcion: servicio.descripcion || "",
        costo_unitario: servicio.costo_unitario || "",
        tipo_servicio: servicio.tipo_servicio || "",
        estado: "Activo",
        fecha_registro: formatDate(servicio.fecha_registro) || "",
      });
    }
  }, [servicio]);

  // Cambiar entre pestañas
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) =>
    setActiveTab(newValue);

  // Manejar los cambios del formulario
  const manejarCambio = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const limpiarRegistarServicio = () => {
    setFormData({
      id_servicio: "",
      descripcion: "",
      costo_unitario: "",
      tipo_servicio: "",
      estado: "Activo",
      fecha_registro: "",
    });
  };

  // Registrar servicio
  const registrarServicio = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    const { id_servicio, ...dataToSend } = formData;

    try {
      const response = await axios.post("https://mercadolasestrellas.online/intranet/public/v1/servicios", dataToSend);
      if (response.status === 200) {
        const mensaje = response.data || "El servicio se registró correctamente";
        mostrarAlerta("Registro exitoso", mensaje, "success").then(() => {
          onServicioRegistrado();
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



  // Actualizar servicio
  const editarServicio = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    const { ...dataToSend } = formData;
    try {
      const response = await axios.put(`https://mercadolasestrellas.online/intranet/public/v1/servicios/${servicio?.id_servicio}`, dataToSend);
      if (response.status === 200) {
        const mensaje = `Los datos del servicio: "${dataToSend.descripcion}" fueron actualizados con éxito`;
        mostrarAlerta("Actualización exitosa", mensaje, "success");
        limpiarRegistarServicio();
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
  // Cerrar modal
  const handleCloseModal = () => {
    limpiarRegistarServicio();
    handleClose();
  };

  const onServicioRegistrado = () => {
    window.location.reload();
  };

  // Contenido del modal
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
              Leer detenidamente los campos obligatorios antes de escribir. (*)
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
                  {/* Separador */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "0.8rem",
                      color: "black",
                      textAlign: "center",
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      "&::before": {
                        content: '""',
                        flexGrow: 1,
                        borderBottom: "1px solid #333",
                        marginRight: "8px",
                      },
                      "&::after": {
                        content: '""',
                        flexGrow: 1,
                        borderBottom: "1px solid #333",
                        marginLeft: "8px",
                      },
                    }}
                  >
                    DETALLES DEL SERVICIO
                  </Typography>
                  {/* Ingresar nombre del servicio */}
                  <TextField
                    fullWidth
                    required
                    label="Nombre del servicio"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={manejarCambio}
                    InputProps={{
                      startAdornment: <Bolt sx={{ mr: 1, color: "gray" }} />,
                    }}
                  // error={!!errors.fechaRegistro}
                  // helperText={errors.fechaRegistro}
                  />
                  {/* Seleccionar tipo de servicio */}
                  <FormControl fullWidth required sx={{ mt: 2 }}>
                    <InputLabel id="tipo-servicio-label">Tipo de servicio</InputLabel>
                    <Select
                      labelId="tipo-servicio-label"
                      label="Tipo de servicio"
                      value={formData.tipo_servicio}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData({ ...formData, tipo_servicio: value })
                      }}
                      startAdornment={<Bolt sx={{ mr: 1, color: "gray" }} />}
                    >
                      <MenuItem value="1">Ordinario (Pagos Fijos)</MenuItem>
                      <MenuItem value="2">Extraordinario (Pagos Extras)</MenuItem>
                    </Select>
                  </FormControl>
                  {/* Ingresar costo unitario */}
                  <TextField
                    fullWidth
                    required
                    type="number"
                    label="Costo unitario"
                    name="costo_unitario"
                    value={formData.costo_unitario}
                    onChange={manejarCambio}
                    InputProps={{
                      startAdornment: <AttachMoney sx={{ mr: 1, color: "gray" }} />,
                    }}
                    sx={{ mt: 2 }}
                  // error={!!errors.costoUnitario}
                  // helperText={errors.costoUnitario}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  {/* Separador */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "0.8rem",
                      color: "black",
                      textAlign: "center",
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      "&::before": {
                        content: '""',
                        flexGrow: 1,
                        borderBottom: "1px solid #333",
                        marginRight: "8px",
                      },
                      "&::after": {
                        content: '""',
                        flexGrow: 1,
                        borderBottom: "1px solid #333",
                        marginLeft: "8px",
                      },
                    }}
                  >
                    INFORMACION DE REGISTRO
                  </Typography>
                  {/* Ingresar fecha de registro */}
                  <TextField
                    fullWidth
                    required
                    type="date"
                    label="Fecha de registro"
                    name="fecha_registro"
                    value={formData.fecha_registro}
                    onChange={manejarCambio}
                    InputProps={{
                      startAdornment: <Event sx={{ mr: 1, color: "gray" }} />,
                    }}
                  // error={!!errors.fechaRegistro}
                  // helperText={errors.fechaRegistro}
                  />
                </Grid>
              </Grid>
            </Box>
          </>
        );
      case 1:
        return (
          <>
            <Typography
              sx={{
                mt: 1,
                color: "#333",
                textAlign: "center",
                fontSize: "12px",
                p: isMobile ? "0px" : "0px 58px"
              }}
            >
              El monto total ingresado en este servicio sera repartido entre
              el área total de todos los puestos que se encuentren activos. (*)
            </Typography>

            <Box
              component="form"
              noValidate
              autoComplete="off"
              sx={{ p: isTablet || isMobile ? "0px" : "0px 58px" }}
            >

              <Grid container spacing={2}>

                <Grid item xs={12} sm={6}>

                  {/* Separador */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "0.8rem",
                      color: "black",
                      textAlign: "center",
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      "&::before": {
                        content: '""',
                        flexGrow: 1,
                        borderBottom: "1px solid #333",
                        marginRight: "8px",
                      },
                      "&::after": {
                        content: '""',
                        flexGrow: 1,
                        borderBottom: "1px solid #333",
                        marginLeft: "8px",
                      },
                    }}
                  >
                    DETALLES DEL SERVICIO
                  </Typography>

                  {/* Ingresar nombre del servicio */}
                  <TextField
                    fullWidth
                    required
                    label="Nombre del servicio"
                    name="descripcion"
                    // value={formData.descripcion}
                    // onChange={manejarCambio}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: <Bolt sx={{ mr: 1, color: "gray" }} />,
                    }}
                  // error={!!errors.fechaRegistro}
                  // helperText={errors.fechaRegistro}
                  />

                  {/* Ingresar costo total del servicio */}
                  <TextField
                    fullWidth
                    required
                    label="Costo total"
                    value={costoTotal}
                    onChange={(e) => setCostoTotal(e.target.value)}
                    InputProps={{
                      startAdornment: <AttachMoney sx={{ mr: 1, color: "gray" }} />,
                    }}
                  // error={!!errors.fechaRegistro}
                  // helperText={errors.fechaRegistro}
                  />

                </Grid>

                <Grid item xs={12} sm={6}>

                  {/* Separador */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "0.8rem",
                      color: "black",
                      textAlign: "center",
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      "&::before": {
                        content: '""',
                        flexGrow: 1,
                        borderBottom: "1px solid #333",
                        marginRight: "8px",
                      },
                      "&::after": {
                        content: '""',
                        flexGrow: 1,
                        borderBottom: "1px solid #333",
                        marginLeft: "8px",
                      },
                    }}
                  >
                    INFORMACION DE REGISTRO
                  </Typography>

                  {/* Ingresar fecha de registro */}
                  <TextField
                    fullWidth
                    required
                    type="date"
                    label="Fecha de registro"
                    // value={formData.fecha_registro}
                    // onChange={manejarCambio}
                    InputProps={{
                      startAdornment: <Event sx={{ mr: 1, color: "gray" }} />,
                    }}
                  // error={!!errors.fechaRegistro}
                  // helperText={errors.fechaRegistro}
                  />

                </Grid>

                <Grid item xs={12}>

                  {/* Separador */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "0.8rem",
                      color: "black",
                      textAlign: "center",
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      "&::before": {
                        content: '""',
                        flexGrow: 1,
                        borderBottom: "1px solid #333",
                        marginRight: "8px",
                      },
                      "&::after": {
                        content: '""',
                        flexGrow: 1,
                        borderBottom: "1px solid #333",
                        marginLeft: "8px",
                      },
                    }}
                  >
                    INFORMACION DE LOS PUESTOS
                  </Typography>

                  <Grid container direction="row" spacing={2}>

                    <Grid item xs={12} sm={6}>

                      {/* Nro. Puestos activos */}
                      <TextField
                        fullWidth
                        label="Puestos activos"
                        value={puestosActivos}
                        onChange={(e) => setPuestosActivos(parseInt(e.target.value))}
                        sx={{ mb: 2 }}
                        InputProps={{
                          readOnly: true,
                          startAdornment: <Storefront sx={{ mr: 1, color: "gray" }} />
                        }}
                      // error={!!errors.fechaRegistro}
                      // helperText={errors.fechaRegistro}
                      />

                      {/* Costo por metro cuadrado */}
                      <TextField
                        fullWidth
                        label="Costo por metro cuadrado"
                        value={costoMetroCuadrado}
                        onChange={(e) => setCostoMetroCuadrado(parseFloat(e.target.value))}
                        InputProps={{
                          readOnly: true,
                          startAdornment: <AttachMoney sx={{ mr: 1, color: "gray" }} />,
                        }}
                      // error={!!errors.fechaRegistro}
                      // helperText={errors.fechaRegistro}
                      />

                    </Grid>

                    <Grid item xs={12} sm={6}>

                      {/* Area total */}
                      <TextField
                        fullWidth
                        label="Área total"
                        value={areaTotal}
                        onChange={(e) => setAreaTotal(parseFloat(e.target.value))}
                        InputProps={{
                          readOnly: true,
                          startAdornment: <Straighten sx={{ mr: 1, color: "gray" }} />,
                          endAdornment: <> m2 </>,
                        }}
                      // error={!!errors.fechaRegistro}
                      // helperText={errors.fechaRegistro}
                      />

                    </Grid>

                  </Grid>

                </Grid>

              </Grid>

            </Box>
          </>
        );
      default:
        return <Typography>Seleccione una pestaña</Typography>;
    }
  }

  return (
    <ContenedorModal
      ancho="720px"
      alto="720px"
      abrir={open}
      cerrar={handleCloseModal}
      loading={loading}
      titulo={servicio ? "Editar servicio" : "Registrar servicio"}
      activeTab={activeTab}
      handleTabChange={handleTabChange}
      tabs={["Registrar servicio", "Registrar servicio compartido"]}
    >

        {renderTabContent()}

        <BotonesModal
          loading={loading}
          action={async (e) => {
            let result;

            // Caso cuando activeTab es 0
            if (activeTab === 0) {
              result = await mostrarAlertaConfirmacion(
                "¿Está seguro de registrar un nuevo servicio?",
              );
              if (result.isConfirmed) {
                if (servicio) {
                  editarServicio(e);
                } else {
                  registrarServicio(e);
                }
              }
            }

            // Caso cuando activeTab es 1
            if (activeTab === 1) {
              result = await mostrarAlertaConfirmacion(
                "¿Está seguro de realizar otra acción para el servicio?",
              );
              if (result.isConfirmed) {
                // registrarServicioCompartido(e); }
              }
            }
          }}
          close={handleCloseModal}
        />

    </ContenedorModal>
  )

}

export default RegistrarServicio;