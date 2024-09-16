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
  SelectChangeEvent, 
  Tab, 
  Tabs, 
  TextField, 
  Typography 
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

interface AgregarProps {
  open: boolean;
  handleClose: () => void;
}

interface GiroNegocio {
  id_gironegocio: number;
  nombre: string;
}

interface Bloque {
  id_block: number;
  nombre: string;
}

interface Puesto {
  id_puesto: number;
  id_block: number;
  numero_puesto: string;
}

interface Socio {
  id_socio: number;
  socio: string;
}

const RegistrarPuesto: React.FC<AgregarProps> = ({ open, handleClose }) => {

  const [activeTab, setActiveTab] = useState(0);

  // Para los select
  const [bloques, setBloques] = useState<Bloque[]>([]);
  const [girosNegocio, setGirosNegocio] = useState<GiroNegocio[]>([]);
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState<number | "">("");
  const [puestosFiltrados, setPuestosFiltrados] = useState<Puesto[]>([]);
  const [socios, setSocios] = useState<Socio[]>([]);

  // Datos para registrar el puesto
  const [formDataPuesto, setFormDataPuesto] = useState({
    id_gironegocio: "",
    id_block: "",
    numero_puesto: "",
    area: "",
    fecha_registro: "",
  });

  // Datos para asigna un puesto
  const [formDataAsginarPuesto, setFormDataAsignarPuesto] = useState({
    id_puesto: "",
    id_socio: "",
  });


  // Datos para registrar el bloque
  const [formDataBloque, setFormDataBloque] = useState({
    nombre: "",
  });

  // Datos para registrar el giro de negocio
  const [formDataGiroNegocio, setFormDataGiroNegocio] = useState({
    nombre: "",
  });

  // Obtener bloques
  useEffect(() => {
    const fetchBloques = async () => {
      try {
        const response = await axios.get("https://mercadolasestrellas.online/intranet/public/v1/blocks");
        console.log("Bloques obtenidos:", response.data.data);
        setBloques(response.data.data);
      } catch (error) {
        console.error("Error al obtener los bloques", error);
      }
    };
    fetchBloques();
  }, []);

  // Obtener giro de negocio
  useEffect(() => {
    const fechGiroNegocio = async () => {
      try {
        const response = await axios.get("https://mercadolasestrellas.online/intranet/public/v1/giro-negocios");
        console.log("Giros de negocio obtenidos:", response.data.data);
        setGirosNegocio(response.data.data);
      } catch (error) {
        console.error("Error al obtener los giro de negocio", error);
      }
    };
    fechGiroNegocio();
  }, []);

  // Obtener puestos
  useEffect(() => {
    const fetchPuestos = async () => {
      try {
        const response = await axios.get("https://mercadolasestrellas.online/intranet/public/v1/puestos/select"); // publico
        console.log("Puestos cargados:", response.data);
        setPuestos(response.data); // Almacenar los datos en el estado
      } catch (error) {
        console.error("Error al obtener los puestos", error);
      }
    };
    fetchPuestos();
  }, []);

  // Filtrar puestos por bloque
  useEffect(() => {
    if (bloqueSeleccionado) {
      const puestosFiltrados = puestos.filter((puesto) => puesto.id_block === bloqueSeleccionado);
      setPuestosFiltrados(puestosFiltrados);
    } else {
      setPuestosFiltrados([]);
    }
  }, [bloqueSeleccionado, puestos]);

  // Obtener socios
  useEffect(() => {
    const fetchSocios = async () => {
      try {
        const response = await axios.get("https://mercadolasestrellas.online/intranet/public/v1/socios"); // publico
        console.log("Socios cargados:", response.data.data);
        setSocios(response.data.data);
      } catch (error) {
        console.error("Error al obtener el listado de socios", error);
      }
    };
    fetchSocios();
  }, []);

  // Manejar los cambios del formulario Registrar Puesto
  const manejarCambioPuesto = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setFormDataPuesto({
      ...formDataPuesto,
      [name]: value,
    });
  };

  // Manejar los cambios del formulario Registrar Bloque
  const manejarCambioBloque = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setFormDataBloque({
      ...formDataBloque,
      [name]: value,
    });
  };
  
  // Manejar los cambios del formulario Registrar Giro de Negocio
  const manejarCambioGiroNegocio = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setFormDataBloque({
      ...formDataGiroNegocio,
      [name]: value,
    });
  };

  // Cambiar entre pestañas
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) =>
    setActiveTab(newValue);

  // Metodo para obtener el titulo del modal
  const obtenerTituloModal = (): string => {
    switch (activeTab) {
      case 0:
        return "REGISTRAR PUESTO";
      case 1:
        return "ASIGNAR PUESTO";
      case 2:
        return "REGISTRAR BLOQUE";
      case 3:
        return "REGISTRAR GIRO DE NEGOCIO";
      default:
        return "";
    }
  }

  // Cerrar modal
  const handleCloseModal = () => {
    handleClose();
  };

  // Registrar Puesto
  const registrarPuesto = async (e: React.MouseEvent<HTMLButtonElement>) => {

    // Evita el comportamiente por defecto del clic
    e.preventDefault();

    // Data a enviar
    const { ...dataToSend } = formDataPuesto;

    try {

      // Conexión al servicio
      const response = await axios.post("https://mercadolasestrellas.online/intranet/public/v1/puestos", dataToSend);
      // const response = await axios.post("http://127.0.0.1:8000/v1/puestos", dataToSend);

      // Manejar la respuesta del servidor
      if(response.status === 200) {
        alert("Puesto registrado con exito");
        // Limpiar los campos del formulario
        setFormDataPuesto({
          id_gironegocio: "",
          id_block: "",
          numero_puesto: "",
          area: "",
          fecha_registro: "",
        });
        // Cerrar el formulario
        handleClose();
      } else {
        alert("No se pudo registrar el puesto. Intentelo nuevamente.")
      }

    } catch (error) {
      console.error("Error al registrar el puesto:", error);
      alert("Ocurrió un error al registrar. Inténtalo nuevamente.");
    }

  }

  // Asignar Puesto
  const asignarPuesto = async (e: React.MouseEvent<HTMLButtonElement>) => {

    // Evita el comportamiente por defecto del clic
    e.preventDefault();

    // Data a enviar
    const { ...dataToSend } = formDataAsginarPuesto;

    try {

      // Conexión al servicio
      const response = await axios.post("https://mercadolasestrellas.online/intranet/public/v1/puestos/asignar", dataToSend);
      // const response = await axios.post("http://127.0.0.1:8000/v1/puestos", dataToSend);

      // Manejar la respuesta del servidor
      if(response.status === 200) {
        alert("Puesto asignado con exito");
        // Limpiar los campos del formulario
        setFormDataAsignarPuesto({
          id_puesto: "",
          id_socio: "",
        });
        // Cerrar el formulario
        handleClose();
      } else {
        alert("No se pudo asignar el puesto. Intentelo nuevamente.")
      }

    } catch (error) {
      console.error("Error al registrar el puesto:", error);
      alert("En proceso de actualización...");
    }

  }

  // Registrar Bloque
  const registrarBloque = async (e: React.MouseEvent<HTMLButtonElement>) => {

    // Evita el comportamiente por defecto del clic
    e.preventDefault();

    // Data a enviar
    const { ...dataToSend } = formDataBloque;

    try {

      // Conexión al servicio
      const response = await axios.post("https://mercadolasestrellas.online/intranet/public/v1/blocks", dataToSend);
      // const response = await axios.post("http://127.0.0.1:8000/v1/blocks", dataToSend);

      // Manejar la respuesta del servidor
      if(response.status === 200) {
        alert("Bloque registrado con exito");
        // Limpiar los datos del formulario
        setFormDataBloque({
          nombre: ""
        });
        handleClose();
      } else {
        alert("No se pudo registrar el bloque. Intentelo nuevamente.")
      }

    } catch (error) {
      console.error("Error al registrar el bloque:", error);
      alert("Ocurrió un error al registrar. Inténtalo nuevamente.");
    }

  }

  // Registrar Giro de negocio
  const registrarGiroNegocio = async (e: React.MouseEvent<HTMLButtonElement>) => {

    // Evita el comportamiente por defecto del clic
    e.preventDefault();

    // Data a enviar
    const { ...dataToSend } = formDataGiroNegocio;

    try {

      // Conexión al servicio
      const response = await axios.post("https://mercadolasestrellas.online/intranet/public/v1/giro-negocios", dataToSend);
      // const response = await axios.post("http://127.0.0.1:8000/v1/giro-negocios", dataToSend);

      // Manejar la respuesta del servidor
      if(response.status === 200) {
        alert("Giro de negocio registrado con exito");
        // Limpiar los datos del formulario
        setFormDataGiroNegocio({
          nombre: ""
        });
        handleClose();
      } else {
        alert("No se pudo registrar el giro de negocio. Intentelo nuevamente.")
      }

    } catch (error) {
      console.error("Error al registrar el giro de negocio:", error);
      alert("Ocurrió un error al registrar. Inténtalo nuevamente.");
    }

  }

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
                    INFORMACION DEL PUESTO
                  </Typography>
                  {/* Seleccionar Bloque */}
                  <FormControl fullWidth required>
                    <InputLabel id="bloque-label">Bloque</InputLabel>
                    <Select
                      labelId="bloque-label"
                      label="Bloque"
                      id="select-bloque"
                      value={formDataPuesto.id_block}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormDataPuesto({ ...formDataPuesto, id_block: value });
                      }}
                      startAdornment={<Business sx={{ mr: 1, color: "gray" }} />}
                    >
                      {bloques.map((bloque: Bloque) => (
                        <MenuItem key={bloque.id_block} value={bloque.id_block}>
                          {bloque.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {/* Nro. Puesto */}
                  <TextField
                    fullWidth
                    required
                    label="Nro. Puesto"
                    name="numero_puesto"
                    value={formDataPuesto.numero_puesto}
                    onChange={manejarCambioPuesto}
                    sx={{ mt: 2 }}
                    InputProps={{
                      startAdornment: (
                        <Abc sx={{ mr: 1, color: "gray" }} />
                      ),
                    }}
                    // error={!!errors.area}
                    // helperText={errors.area}
                  />

                  {/* Ingresar el area */}
                  <TextField
                    fullWidth
                    required
                    label="Área"
                    name="area"
                    value={formDataPuesto.area}
                    onChange={manejarCambioPuesto}
                    sx={{ mt: 2 }}
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

                  {/* Seleccionar giro de negocio */}
                  <FormControl fullWidth required>
                    <InputLabel id="giro-label">Giro de negocio</InputLabel>
                    <Select
                      labelId="giro-label"
                      label="Giro de negocio"
                      id="select-giro-negocio"
                      value={formDataPuesto.id_gironegocio}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormDataPuesto({ ...formDataPuesto, id_gironegocio: value });
                      }}
                      startAdornment={<AddBusiness sx={{ mr: 1, color: "gray" }} />}
                    >
                      {girosNegocio.map((giroNegocio: GiroNegocio) => (
                        <MenuItem key={giroNegocio.id_gironegocio} value={giroNegocio.id_gironegocio}>
                          {giroNegocio.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

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

                  {/* Ingresar fecha de registro */}
                  <TextField
                    fullWidth
                    label="Fecha de Registro"
                    name="fecha_registro"
                    type="date"
                    required
                    value={formDataPuesto.fecha_registro}
                    onChange={manejarCambioPuesto}
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
                      label="Bloque"
                      id="select-bloque"
                      value={bloqueSeleccionado}
                      onChange={(e) => {
                        const value = e.target.value as number;
                        setBloqueSeleccionado(value);
                      }}
                      startAdornment={<Business sx={{ mr: 1, color: "gray" }} />}
                    >
                      {bloques.map((bloque: Bloque) => (
                        <MenuItem key={bloque.id_block} value={bloque.id_block}>
                          {bloque.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Seleccionar Puesto */}
                  <FormControl fullWidth required sx={{ mt: 2 }}>
                      <InputLabel id="nro-puesto-label">Nro. Puesto</InputLabel>
                      <Select
                        labelId="nro-puesto-label"
                        id="select-puesto"
                        label="Nro. Puesto"
                        value={formDataAsginarPuesto.id_puesto}
                        onChange={(e) => {
                          const value = e.target.value as string;
                          setFormDataAsignarPuesto({ ...formDataAsginarPuesto, id_puesto: value });
                        }}
                        startAdornment={<Abc sx={{ mr: 1, color: "gray" }} />}
                      >
                        {puestosFiltrados.map((puesto: Puesto) => (
                          <MenuItem key={puesto.id_puesto} value={puesto.id_puesto}>
                            {puesto.numero_puesto}
                          </MenuItem>
                        ))}
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
                      value={formDataAsginarPuesto.id_socio}
                      onChange={(e) => {
                        const value = e.target.value as string;
                        setFormDataAsignarPuesto({ ...formDataAsginarPuesto, id_socio: value });
                      }}
                      startAdornment={<Abc sx={{ mr: 1, color: "gray" }} />}
                    >
                      {socios.map((socio: Socio) => (
                        <MenuItem key={socio.id_socio} value={socio.id_socio}>
                          {socio.socio}
                        </MenuItem>
                      ))}
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
                    required
                    label="Nombre del bloque"
                    name="nombre"
                    value={formDataBloque.nombre}
                    onChange={manejarCambioBloque}
                    InputProps={{
                      startAdornment: (
                        <Business sx={{ mr: 1, color: "gray" }} />
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
      case 3: // REGISTRAR GIRO NEGOCIO
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
                    GIRO DE NEGOCIO
                  </Typography>
                  {/* Ingresar nombre del bloque */}
                  <TextField
                    fullWidth
                    required
                    label="Nombre del giro"
                    name="nombre"
                    value={formDataGiroNegocio.nombre}
                    onChange={manejarCambioGiroNegocio}
                    InputProps={{
                      startAdornment: (
                        <Business sx={{ mr: 1, color: "gray" }} />
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
            {obtenerTituloModal()}
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
            <Tab label="Registrar Puesto" />
            <Tab label="Asignar Puesto" />
            <Tab label="Nuevo Bloque" />
            <Tab label="Nuevo Giro de Negocio" />
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
            onClick={(e) => {
              if(activeTab === 0){
                registrarPuesto(e);
              }
              if(activeTab === 1){
                asignarPuesto(e);
              }
              if(activeTab === 2){
                registrarBloque(e);
              }
              if(activeTab === 3){
                registrarGiroNegocio(e);
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

export default RegistrarPuesto;