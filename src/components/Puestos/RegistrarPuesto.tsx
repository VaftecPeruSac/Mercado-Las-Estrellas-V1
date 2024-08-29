import { Abc, 
  AddBusiness, 
  Business, 
  Event, 
  Straighten 
} from '@mui/icons-material';
import { 
  Box, 
  Button, 
  Card, 
  FormControl, 
  Grid, 
  InputLabel, 
  MenuItem, 
  Modal, 
  Select, 
  Tab, 
  Tabs, 
  TextField, 
  Typography 
} from '@mui/material';
import React, { useState } from 'react'

interface AgregarProps {
  open: boolean;
  handleClose: () => void;
}

const RegistrarPuesto: React.FC<AgregarProps> = ({ open, handleClose }) => {

  const [activeTab, setActiveTab] = useState(0);

  // Cerrar modal
  const handleCloseModal = () => {
    handleClose();
  };

  // Cambiar entre pestañas
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) =>
    setActiveTab(newValue);

  // Contenido del modal
  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // REGISTRAR PUESTO
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
                    INFORMACION DEL PUESTO
                  </Typography>
                  {/* Seleccionar Bloque */}
                  <FormControl fullWidth required>
                    <InputLabel id="bloque-label">Bloque</InputLabel>
                    <Select
                      labelId="bloque-label"
                      label="Bloque (*)"
                      // value={tipoPersona}
                      // onChange={handleTipoPersonaChange}
                      startAdornment={<Business sx={{ mr: 1, color: "gray" }} />}
                    >
                      <MenuItem value="1">1er Piso</MenuItem>
                      <MenuItem value="2">2do Piso</MenuItem>
                    </Select>
                  </FormControl>
                  {/* Seleccionar Puesto */}
                  <FormControl fullWidth required sx={{ mt: 2 }}>
                    <InputLabel id="nro-puesto-label">Nro. Puesto</InputLabel>
                    <Select
                      labelId="nro-puesto-label"
                      label="Nro Puesto (*)"
                      // value={nroPuesto}
                      // onChange={handleNroPuesto}
                      startAdornment={<Abc sx={{ mr: 1, color: "gray" }} />}
                    >
                      <MenuItem value="1">A-1</MenuItem>
                      <MenuItem value="2">A-2</MenuItem>
                    </Select>
                  </FormControl>
                  {/* Ingresar el area */}
                  <TextField
                    sx={{ mt: 2 }}
                    fullWidth
                    label="Área"
                    required
                    // value={area}
                    // onChange={manejarArea}
                    InputProps={{
                      startAdornment: (
                        <Straighten sx={{ mr: 1, color: "gray" }} />
                      ),
                    }}
                    // error={!!errors.area}
                    // helperText={errors.area}
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
                    GIRO DE NEGOCIO
                  </Typography>
                  {/* Ingresar giro de negocio */}
                  <TextField
                    fullWidth
                    label="Giro de negocio"
                    required
                    // value={giroNegocio}
                    // onChange={manejarGiroNegocio}
                    InputProps={{
                      startAdornment: (
                        <AddBusiness sx={{ mr: 1, color: "gray" }} />
                      ),
                    }}
                    // error={!!errors.giroNegocio}
                    // helperText={errors.giroNegocio}
                  />
                  {/* Separador */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "0.8rem",
                      color: "black",
                      textAlign: "center",
                      mt: 2,
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
                  <TextField
                    fullWidth
                    label="Fecha de Registro"
                    required
                    // value={fechaRegistro}
                    // onChange={manejarFechaRegistro}
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
      case 1: // ASIGNAR PUESTO
        return (
          <>
            <Box
              component="form"
              noValidate
              autoComplete="off"
              sx={{ mt: 2 ,p: "0px 58px" }}
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
                    SELECCIONAR PUESTO
                  </Typography>
                  {/* Seleccionar Bloque */}
                  <FormControl fullWidth required>
                    <InputLabel id="bloque-label">Bloque</InputLabel>
                    <Select
                      labelId="bloque-label"
                      label="Bloque (*)"
                      // value={tipoPersona}
                      // onChange={handleTipoPersonaChange}
                      startAdornment={<Business sx={{ mr: 1, color: "gray" }} />}
                    >
                      <MenuItem value="1">1er Piso</MenuItem>
                      <MenuItem value="2">2do Piso</MenuItem>
                    </Select>
                  </FormControl>
                  {/* Seleccionar Puesto */}
                  <FormControl fullWidth required sx={{ mt: 2 }}>
                    <InputLabel id="nro-puesto-label">Nro. Puesto</InputLabel>
                    <Select
                      labelId="nro-puesto-label"
                      label="Nro Puesto (*)"
                      // value={nroPuesto}
                      // onChange={handleNroPuesto}
                      startAdornment={<Abc sx={{ mr: 1, color: "gray" }} />}
                    >
                      <MenuItem value="1">A-1</MenuItem>
                      <MenuItem value="2">A-2</MenuItem>
                    </Select>
                  </FormControl>
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
                    SELECCIONAR SOCIO
                  </Typography>
                  {/* Seleccionar Socio */}
                  <FormControl fullWidth required>
                    <InputLabel id="socio-label">Socio</InputLabel>
                    <Select
                      labelId="socio-label"
                      label="Socio"
                      // value={nroPuesto}
                      // onChange={handleNroPuesto}
                      startAdornment={<Abc sx={{ mr: 1, color: "gray" }} />}
                    >
                      <MenuItem value="1">Juan</MenuItem>
                      <MenuItem value="2">Pepito</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </>
        );
      case 2: // REGISTRAR BLOQUE
        return (
          <>
            <Box
              component="form"
              noValidate
              autoComplete="off"
              sx={{ mt: 2 ,p: "0px 58px" }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
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
                    DESCRIPCION DEL BLOQUE
                  </Typography>
                  {/* Ingresar nombre del bloque */}
                  <TextField
                    fullWidth
                    label="Nombre del bloque"
                    required
                    // value={bloque}
                    // onChange={manejarBloque}
                    InputProps={{
                      startAdornment: (
                        <AddBusiness sx={{ mr: 1, color: "gray" }} />
                      ),
                    }}
                    // error={!!errors.bloque}
                    // helperText={errors.bloque}
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
            Registrar Puesto
          </Typography>
        </Box>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
            <Tab label="Registrar Puesto" />
            <Tab label="Asignar Puesto" />
            <Tab label="Nuevo Bloque" />
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
  )

}

export default RegistrarPuesto;