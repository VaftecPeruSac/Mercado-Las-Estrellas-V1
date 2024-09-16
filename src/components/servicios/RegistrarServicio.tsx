import { AttachMoney, Bolt, Event } from '@mui/icons-material';
import { Box, Button, Card, FormControl, Grid, InputLabel, MenuItem, Modal, Select, SelectChangeEvent, Tab, Tabs, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react'

interface AgregarProps {
  open: boolean;
  handleClose: () => void;
}

const RegistrarServicio: React.FC<AgregarProps> = ({ open, handleClose }) => {
  
  const [activeTab, setActiveTab] = useState(0);

  // Datos para registrar el servicio
  const [formData, setFormData] = useState({
    descripcion: "",
    costo_unitario: "",
    tipo_servicio: "",
    estado: "1",
    fecha_registro: "",
  });

  // Cerrar modal
  const handleCloseModal = () => {
    handleClose();
  };

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

  // Registrar servicio
  const registrarServicio = async (e: React.MouseEvent<HTMLButtonElement>) => {

    // Evita el comportamiente por defecto del clic
    e.preventDefault();

    // Data a enviar
    const { ...dataToSend } = formData;

    try {

      // Conexión al servicio
      const response = await axios.post("https://mercadolasestrellas.online/intranet/public/v1/servicios", dataToSend);
      // const response = await axios.post("http://127.0.0.1:8000/v1/servicios", dataToSend);

      // Manejar la respuesta del servidor
      if(response.status === 200) {
        alert("Servicio registrado con exito");
        // Limpiar los campos del formulario
        setFormData({
          descripcion: "",
          costo_unitario: "",
          tipo_servicio: "",
          estado: "1",
          fecha_registro: "",
        });
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
              sx={{ p: "0px 58px" }}
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
                    label="Fecha de Registro"
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
          width: "720px",
          height: "670px",
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
            Registrar Servicio
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
            <Tab label="Registrar Servicio" />
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
            onClick={registrarServicio}
          >
            Registrar
          </Button>
        </Box>
      </Card>
    </Modal>
  )

}

export default RegistrarServicio;