import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Grid,
  Typography,
  Card,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Tabs,
  Tab,
  LinearProgress,
  Autocomplete,
} from "@mui/material";
import {
  AccountCircle,
  Phone,
  Email,
  Home,
  Person,
  Event,
  Badge,
  Wc,
  Business,
  Abc,
} from "@mui/icons-material";
import { SelectChangeEvent } from "@mui/material/Select";
import axios from "axios";
import useResponsive from "../Responsive";

interface AgregarProps {
  open: boolean;
  handleClose: () => void;
  socio: EditarSocio | null;
  onSocioRegistrado: () => void;  // Nuevo callback para actualizar la lista
}

interface EditarSocio {
  id_socio: string;
  nombre_completo: string;
  nombre_socio: string;
  apellido_paterno: string;
  apellido_materno: string;
  dni: string;
  sexo: string;
  direccion: string;
  telefono: string;
  correo: string;
  id_puesto: string;
  numero_puesto: string;
  id_block: string;
  block_nombre: string;
  gironegocio_nombre: string;
  nombre_inquilino: string;
  estado: string;
  fecha_registro: string;
  deuda: string;
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

const Agregar: React.FC<AgregarProps> = ({ open, handleClose, socio, onSocioRegistrado }) => {

  // Variables para el diseño responsivo
  const { isMobile, isTablet } = useResponsive();

  // Para los select
  const [bloques, setBloques] = useState<Bloque[]>([]);
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState<number | "">("");
  const [puestosFiltrados, setPuestosFiltrados] = useState<Puesto[]>([]);

  const [anio, setAnio] = useState<string>("");
  const [mes, setMes] = useState<string>("");
  const [itemsSeleccionados, setItemsSeleccionados] = useState<string[]>([]);

  // Estado para el contenido de las pestañas
  const [activeTab, setActiveTab] = useState(0);

  // Datos del formulario
  const [tipoPersona, setTipoPersona] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [dni, setDni] = useState("");
  const [direccion, setDireccion] = useState("");
  const [sexo, setSexo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [estado, setEstado] = useState("Activo");
  const [fecha, setFecha] = useState("");

  const [cuota, setCuota] = useState("");

  // Error Formulario
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [openPagar, setOpenPagar] = useState<boolean>(false);

  const [loading, setLoading] = useState(false); // Estado de loading

  const [formData, setFormData] = useState({
    id_socio: "",
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    dni: "",
    correo: "",
    telefono: "",
    direccion: "",
    sexo: "",
    estado: "",
    fecha_registro: "",
    id_block: "",
    id_puesto: "",
  });

  // Darle el formato esperado a la fecha para ser recibida en el input
  const formatDate = (fecha: string) => {
    const [dia, mes, anio] = fecha.split("/");
    return `${anio}-${mes}-${dia}`;
  };

  // Llenar campos con los datos del socio seleccionado
  useEffect(() => {
    if (socio) {
      setFormData({
        id_socio: socio.id_socio || '',
        nombre: socio.nombre_socio || '',
        apellido_paterno: socio.apellido_paterno || '',
        apellido_materno: socio.apellido_materno || '',
        dni: (socio.dni === 'No' ? '' : socio.dni) || '',
        sexo: socio.sexo || '',
        direccion: (socio.direccion === 'No' ? '' : socio.direccion) || '',
        telefono: (socio.telefono === 'No' ? '' : socio.telefono) || '',
        correo: (socio.correo === 'No' ? '' : socio.correo) || '',
        id_puesto: socio.id_puesto || '',
        id_block: socio.id_block || '',
        estado: socio.estado || '',
        fecha_registro: formatDate(socio.fecha_registro) || '',
      });
    }
  }, [socio]);

  // Validaciones del formulario
  // const validateForm = () => {
  //   const newErrors: { [key: string]: string } = {};
  //   if (!tipoPersona) newErrors.tipoPersona = "Tipo de Persona es obligatorio";
  //   if (!nombre) newErrors.nombre = "Nombre es obligatorio";
  //   if (!apellidoPaterno)
  //     newErrors.apellidoPaterno = "Apellido Paterno es obligatorio";
  //   if (!apellidoMaterno)
  //     newErrors.apellidoMaterno = "Apellido Materno es obligatorio";
  //   if (!dni || !/^\d{8}$/.test(dni))
  //     newErrors.dni = "DNI debe ser numérico y tener 8 caracteres";
  //   if (!telefono || !/^\d{9}$/.test(telefono))
  //     newErrors.telefono = "Teléfono debe ser numérico y tener 9 caracteres";
  //   if (!correo || !/^[A-Za-z0-9._%+-]+@gmail\.com$/.test(correo))
  //     newErrors.correo = "Correo debe ser un Gmail válido";
  //   if (!direccion) newErrors.direccion = "Dirección es obligatoria";

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  // const handleEstadoChange = (event: SelectChangeEvent<string>) => {
  //   setEstado(event.target.value);
  // };

  // const handleCuotaChange = (event: SelectChangeEvent<string>) => {
  //   setCuota(event.target.value);
  // };

  // const manejarDniCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const valor = e.target.value;
  //   // Permitir solo números y restringir a una longitud mínima
  //   const regex = /^\d{0,8}$/; // Solo números, hasta 8 dígitos
  //   if (regex.test(valor)) {
  //     setDni(valor);
  //   }
  // };

  // const manejarTelefonoCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const valor = e.target.value;
  //   // Permitir solo números y restringir a una longitud mínima
  //   const regex = /^[0-9]{0,9}$/; // Solo números, hasta 9 dígitos
  //   if (regex.test(valor)) {
  //     setTelefono(valor);
  //   }
  // };

  // const manejarCambioCorreo = (event: ChangeEvent<HTMLInputElement>) => {
  //   const valor = event.target.value;
  //   const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/; // Valida que sea un Gmail
  //   setCorreo(valor);

  //   if (!regex.test(valor)) {
  //     console.error("Por favor ingrese un correo válido de Gmail.");
  //   }
  // };

  // const manejarNombreCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const valor = e.target.value;
  //   // Permitir solo caracteres alfabéticos y espacios
  //   if (/^[a-zA-Z\s]*$/.test(valor)) {
  //     setNombre(valor);
  //   }
  // };

  const handleCloseModal = () => {
    limpiarCamposSocio();
    handleClose();
  };

  const limpiarCamposSocio = () => {
    setBloqueSeleccionado("");
    setFormData({
      id_socio: "",
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      dni: "",
      correo: "",
      telefono: "",
      direccion: "",
      sexo: "",
      estado: "",
      fecha_registro: "",
      id_block: "",
      id_puesto: "",
    });
  };

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

  // Para manejar los cambios
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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    // Validar el formato de fecha YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
      setFecha(valor);
    }
  };

  // Cambiar entre pestañas
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) =>
    setActiveTab(newValue);

  // Metodo para obtener el titulo del modal
  const obtenerTituloModal = (): string => {
    switch (activeTab) {
      case 0:
        return "REGISTRAR NUEVO SOCIO";
      default:
        return "";
    }
  }

  // Registrar socio
  const registrarSocio = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true); // Activa el loading

    const { id_socio, id_block, ...dataToSend } = formData;

    try {
      // const response = await axios.post("http://127.0.0.1:8000/v1/socios", dataToSend); // Local
      const response = await axios.post("https://mercadolasestrellas.online/intranet/public/v1/socios", dataToSend); //publico
      if (response.status === 200) {
        alert("Se registró correctamente");
        setLoading(false); // Desactiva el loading
        limpiarCamposSocio();
        onSocioRegistrado();
        handleClose() // Actualiza la lista de socios en Tabla.tsx
      } else {
        alert("No se pudo registrar el socio. Inténtalo nuevamente.");
        setLoading(false); // Desactiva el loading
      }
      console.log(response)

    } catch (error) {
      console.error("Error al registrar el socio:", error);
      alert("Ocurrió un error al registrar. Inténtalo nuevamente.");
      setLoading(false); // Desactiva el loading
    }
  };

  // Editar socio
  const editarSocio = async (e: React.MouseEvent<HTMLButtonElement>) => {

    e.preventDefault();
    setLoading(true);

    const { id_puesto, id_block, ...dataToSend } = formData;

    try {
      const response = await axios.put("https://mercadolasestrellas.online/intranet/public/v1/socios", dataToSend);
      if (response.status === 200) {
        alert("Se registró correctamente");
        setLoading(false);
        limpiarCamposSocio();
        onSocioRegistrado();
        handleClose()
      } else {
        alert("No se pudo actualizar los datos del socio. Inténtalo nuevamente.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error al editar los datos del socio:", error);
      alert("Ocurrió un error al actualizar los datos del puesto. Inténtalo nuevamente.");
      setLoading(false);
    }

  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // REGISTRAR SOCIO
        return (
          <>
            <Typography
              sx={{
                mb: 1,
                color: "#333",
                textAlign: "center",
                fontSize: "0.8rem",
              }}
            >
              Recuerde leer los campos obligatorios antes de escribir. (*)
            </Typography>

            {/* <pre>{JSON.stringify(formData, null, 2)}</pre> */}

            <Box component="form" noValidate autoComplete="off">

              <Grid container spacing={2}> {" "}

                <Grid item xs={12} sm={6}>

                  {/* Nombre bloque */}
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
                    DATOS PERSONALES
                  </Typography>

                  {/* Nombre */}
                  <TextField
                    fullWidth
                    label="Nombre (*)"
                    name="nombre"
                    value={formData.nombre}
                    onChange={manejarCambio}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <AccountCircle sx={{ mr: 1, color: "gray" }} />
                      ),
                    }}
                    error={!!errors.nombre}
                    helperText={errors.nombre}
                  />

                  {/* Apellido Paterno */}
                  <TextField
                    fullWidth
                    label="Apellido Paterno (*)"
                    name="apellido_paterno"
                    value={formData.apellido_paterno}
                    onChange={manejarCambio}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <AccountCircle sx={{ mr: 1, color: "gray" }} />
                      ),
                    }}
                    error={!!errors.apellidoPaterno}
                    helperText={errors.apellidoPaterno}
                  />

                  {/* Apellido Materno */}
                  <TextField
                    fullWidth
                    label="Apellido Materno (*)"
                    name="apellido_materno"
                    value={formData.apellido_materno}
                    onChange={manejarCambio}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <AccountCircle sx={{ mr: 1, color: "gray" }} />
                      ),
                    }}
                    error={!!errors.apellidoMaterno}
                    helperText={errors.apellidoMaterno}
                  />

                  {/* Sexo */}
                  <FormControl fullWidth required>
                    <InputLabel id="sexo-label">Sexo</InputLabel>
                    <Select
                      labelId="sexo-label"
                      fullWidth
                      label="Sexo (*)"
                      name="sexo"
                      value={formData.sexo}
                      onChange={manejarCambio}
                      sx={{ mb: 2 }}
                      startAdornment={<Wc sx={{ mr: 1, color: "gray" }} />}
                    >
                      <MenuItem value="Masculino">Masculino</MenuItem>
                      <MenuItem value="Femenino">Femenino</MenuItem>
                    </Select>
                  </FormControl>

                  {/* DNI */}
                  <TextField
                    fullWidth
                    label="DNI (*)"
                    required
                    name="dni"
                    value={formData.dni}
                    onChange={manejarCambio}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: <Badge sx={{ mr: 1, color: "gray" }} />,
                    }}
                    error={!!errors.dni}
                    helperText={errors.dni}
                  />

                  {/* Dirección */}
                  <TextField
                    fullWidth
                    label="Dirección (*)"
                    required
                    name="direccion"
                    value={formData.direccion}
                    onChange={manejarCambio}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: <Home sx={{ mr: 1, color: "gray" }} />,
                    }}
                    error={!!errors.direccion}
                    helperText={errors.direccion}
                  />

                </Grid>

                <Grid item xs={12} sm={6}>

                  {/* CONTACTO */}
                  <Grid item xs={12} sm={12} sx={{ mb: 2 }}>

                    {/* Nombre bloque */}
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
                      CONTACTO
                    </Typography>

                    {/* Numero de Telefono */}
                    <TextField
                      fullWidth
                      label="Nro. Telefono (*)"
                      name="telefono"
                      value={formData.telefono}
                      onChange={manejarCambio}
                      InputProps={{
                        startAdornment: <Phone sx={{ mr: 1, color: "gray" }} />,
                      }}
                      error={!!errors.telefono}
                      helperText={errors.telefono}
                    />

                    {/* Correo  */}
                    <TextField
                      fullWidth
                      label="Correo (*)"
                      sx={{ mt: 2 }}
                      name="correo"
                      value={formData.correo}
                      onChange={manejarCambio}
                      InputProps={{
                        startAdornment: <Email sx={{ mr: 1, color: "gray" }} />,
                      }}
                      error={!!errors.correo}
                      helperText={errors.correo}
                    />
                  </Grid>

                  {/* ASIGNAR PUESTO */}
                  <Grid item xs={12} sm={12} sx={{ mb: 2 }}>

                    {/* Nombre bloque */}
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
                      ASIGNAR PUESTO
                    </Typography>

                    {/* Seleccionar bloque */}
                    <FormControl fullWidth required>
                      <InputLabel id="bloque-label">Bloque</InputLabel>
                      <Select
                        labelId="bloque-label"
                        id="select-bloque"
                        label="Bloque"
                        value={bloqueSeleccionado}
                        disabled={socio !== null}
                        onChange={(e) => {
                          const value = e.target.value as number;
                          setBloqueSeleccionado(value);
                          setFormData({ ...formData, id_block: value.toString() });
                        }}
                        startAdornment={<Business sx={{ mr: 1, color: "gray" }} />}
                        sx={{ mb: 2 }}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200,
                              overflowY: 'auto',
                            },
                          },
                        }}
                      >
                        {bloques.map((bloque: Bloque) => (
                          <MenuItem key={bloque.id_block} value={bloque.id_block}>
                            {bloque.nombre}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>


                    {/* Nro. Puesto */}
                    <FormControl fullWidth required>
                      <Autocomplete
                        options={puestosFiltrados}
                        getOptionLabel={(puesto) => puesto.numero_puesto.toString()} // Convertir numero_puesto a string para mostrarlo correctamente
                        onChange={(event, newValue) => {
                          if (newValue) {
                            setFormData({
                              ...formData,
                              id_puesto: newValue.id_puesto.toString(), // Convertir id_puesto a string
                            });
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Nro. Puesto"
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <>
                                  <Abc sx={{ mr: 1, color: "gray" }} />
                                  {params.InputProps.startAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                        ListboxProps={{
                          style: {
                            maxHeight: 200,
                            overflow: 'auto',
                          },
                        }}
                        isOptionEqualToValue={(option, value) => option.id_puesto === Number(value)} // Comparación de valores
                      />
                    </FormControl>
                  </Grid>

                  {/* Informacion de registro */}
                  <Grid item xs={12} sm={12} sx={{ mb: 2 }}>

                    {/* Nombre Bloque */}
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

                    {/* Seleccionar estado */}
                    <FormControl fullWidth required>
                      <InputLabel id="estado-label">Estado</InputLabel>
                      <Select
                        labelId="estado-label"
                        label="Estado"
                        name="estado"
                        value={formData.estado}
                        onChange={manejarCambio}
                        startAdornment={<Person sx={{ mr: 1, color: "gray" }} />}
                      >
                        <MenuItem value="Activo">Activo</MenuItem>
                        <MenuItem value="Inactivo">Inactivo</MenuItem>
                      </Select>
                    </FormControl>

                    {/* Fecha de registro */}
                    <TextField
                      fullWidth
                      label="Fecha de Registro"
                      type="date"
                      name="fecha_registro"
                      value={formData.fecha_registro}
                      onChange={manejarCambio}
                      sx={{ mt: 2 }}
                      InputProps={{
                        startAdornment: <Event sx={{ mr: 1, color: "gray" }} />,
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />

                  </Grid>

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
          height: isTablet || isMobile ? "90%" : "auto",
          p: 3,
          bgcolor: "white",
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
            sx={{ textAlign: "center", fontSize: "0.9rem" }}
          >
            {obtenerTituloModal()}
          </Typography>
        </Box>
        {loading && (
          <div style={{ textAlign: "center", marginBottom: "5px" }}>
            <LinearProgress aria-description="dd" color="primary" />
            {/* <p>Cargando...</p> */}
          </div>
        )}

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 0 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              "& .MuiTabs-flexContainer": {
                minHeight: "36px", // Reduce la altura del contenedor de tabs
              },
              "& .MuiTab-root": {
                fontSize: "0.8rem", // Tamaño de fuente más pequeño
                fontWeight: "normal", // Peso de fuente normal
                color: "gray", // Color gris para tabs no seleccionados
                textTransform: "none", // Mantener el texto tal cual
                minWidth: "auto", // Quitar el ancho mínimo
                px: 2, // Padding horizontal
              },
              "& .MuiTab-root.Mui-selected": {
                fontWeight: "bold", // Negrita para el tab seleccionado
                color: "black !important", // Color negro para el tab seleccionado con !important
              },
              "& .MuiTabs-indicator": {
                display: "none", // Ocultar el indicador de línea predeterminado
              },
              mb: -1, // Reduce el margen inferior para acercar el divider a los tabs
            }}
          >
            <Tab label="REGISTRAR SOCIO" />
          </Tabs>
        </Box>
        {renderTabContent()}
        {/* <Agregar onSocioRegistrado={handleSocioRegistrado} />
        <Tabla socios={socios} /> */}

        <Box 
          sx={{ 
            display: "flex", 
            justifyContent: isTablet || isMobile ? "center" : "flex-end",
            mt: 3 
          }}
        >
          <Button
            variant="outlined"
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
            onClick={(e) => {
              if (activeTab === 0) {
                if (socio) {
                  // Si se selecciono un socio
                  editarSocio(e);
                } else {
                  // Si no se selecciono un socio
                  registrarSocio(e);
                }
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

export default Agregar;