import { AttachMoney, Bolt, Event, Storefront, Straighten } from '@mui/icons-material';
import { Box, Button, Card, FormControl, Grid, InputLabel, MenuItem, Modal, Select, SelectChangeEvent, Tab, Tabs, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import useResponsive from '../Responsive';

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
  const { isLaptop, isTablet, isMobile } = useResponsive();

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
    if(servicio){
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

  // Cerrar modal
  const handleCloseModal = () => {
    handleClose();
    limpiarRegistarServicio();
  };

  // Registrar servicio
  const registrarServicio = async (e: React.MouseEvent<HTMLButtonElement>) => {

    // Evita el comportamiente por defecto del clic
    e.preventDefault();

    // Data a enviar
    const { id_servicio, ...dataToSend } = formData;

    try {

      // Conexión al servicio
      const response = await axios.post("https://mercadolasestrellas.online/intranet/public/v1/servicios", dataToSend);
      // const response = await axios.post("http://127.0.0.1:8000/v1/servicios", dataToSend);

      // Manejar la respuesta del servidor
      if(response.status === 200) {
        alert("Servicio registrado con exito");
        // Limpiar los campos del formulario
        limpiarRegistarServicio();
        // Cerrar el formulario
        handleClose();
      } else {
        alert("No se pudo registrar el servicio. Intentelo nuevamente.")
      }

    } catch (error) {
      console.error("Error al registrar el servicio:", error);
      alert("Ocurrió un error al registrar. Inténtalo nuevamente.");
    }

  }

  // Actualizar servicio
  const editarServicio = async (e: React.MouseEvent<HTMLButtonElement>) => {

    // Evita el comportamiente por defecto del clic
    e.preventDefault();

    // Data a enviar
    const { ...dataToSend } = formData;

    try {

      // Conexión al servicio
      const response = await axios.put(`https://mercadolasestrellas.online/intranet/public/v1/servicios/${servicio?.id_servicio}`, dataToSend);
      // const response = await axios.post("http://127.0.0.1:8000/v1/servicios", dataToSend);

      // Manejar la respuesta del servidor
      if(response.status === 200) {
        alert(`Los datos del servicio: "${dataToSend.descripcion}" fueron actualizados con exito`);
        // Limpiar los campos del formulario
        limpiarRegistarServicio();
        // Cerrar el formulario
        handleClose();
      } else {
        alert("No se pudo actualizar los datos del servicio. Intentelo nuevamente.")
      }

    } catch (error) {
      console.error("Error al editar los datos del servicio:", error);
      alert("Ocurrió un error al editar los datos del servicio. Inténtalo nuevamente.");
    }

  }

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
            Registrar Servicio
          </Typography>
        </Box>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
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
              overflowX: "auto",
            }}
          >
            <Tab label="Registrar Servicio" />
            <Tab label="Registrar Servicio Compartido" />
          </Tabs>
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
              backgroundColor: "#008001",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#388E3C",
              },
            }}
            onClick={(e) => {
              if(servicio){ 
                // Si se selecciono un servicio
                editarServicio(e);
              } else {
                // Si servicio es nulo
                registrarServicio(e);
              }
            }}
          >
            Registrar
          </Button>
        </Box>
      </Card>
    </Modal>
  )

}

export default RegistrarServicio;