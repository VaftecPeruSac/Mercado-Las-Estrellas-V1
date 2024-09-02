import React, { useState, ChangeEvent, useEffect } from "react";
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
} from "@mui/material";
import {
  AccountCircle,
  Phone,
  Email,
  Home,
  Business,
  Person,
  Event,
  Badge,
  Abc,
  Wc,
} from "@mui/icons-material";
import { SelectChangeEvent } from "@mui/material/Select";
import axios from "axios";
interface AgregarProps {
  open: boolean;
  handleClose: () => void;
}

interface Puesto {
  id_puesto: number;
  id_block: number;
  numero_puesto: string;
}


const Agregar: React.FC<AgregarProps> = ({ open, handleClose }) => {
  const [pues, setPues] = useState<Puesto[]>([]);
  const [selectedBloque, setSelectedBloque] = useState<number | ''>('');
  const [filteredPuestos, setFilteredPuestos] = useState<Puesto[]>([]);
  const [selectedPuesto, setSelectedPuesto] = useState<string>('');

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

  const handleOpenPagar = () => setOpenPagar(true);
  const handleClosePagar = () => setOpenPagar(false);

  const [formData, setFormData] = useState({
    tipoPersona: '',
    telefono: '',
    nombre: '',
    correo: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    dni: '',
    sexo: '',
    bloque: '',
    numeroPuesto: '',
    estado: '',
    fechaRegistro: '',
    direccion: ''
  });

  // Validaciones del formulario
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!tipoPersona)
      newErrors.tipoPersona = "Tipo de Persona es obligatorio";
    if (!nombre)
      newErrors.nombre = "Nombre es obligatorio";
    if (!apellidoPaterno)
      newErrors.apellidoPaterno = "Apellido Paterno es obligatorio";
    if (!apellidoMaterno)
      newErrors.apellidoMaterno = "Apellido Materno es obligatorio";
    if (!dni || !/^\d{8}$/.test(dni))
      newErrors.dni = "DNI debe ser numérico y tener 8 caracteres";
    if (!telefono || !/^\d{9}$/.test(telefono))
      newErrors.telefono = "Teléfono debe ser numérico y tener 9 caracteres";
    if (!correo || !/^[A-Za-z0-9._%+-]+@gmail\.com$/.test(correo))
      newErrors.correo = "Correo debe ser un Gmail válido";
    if (!direccion) newErrors.direccion = "Dirección es obligatoria";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEstadoChange = (event: SelectChangeEvent<string>) => {
    setEstado(event.target.value);
  };

  const handleCuotaChange = (event: SelectChangeEvent<string>) => {
    setCuota(event.target.value);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Aquí iría la lógica para enviar los datos
      console.log("Formulario válido");
      limpiarCampos();
      handleClose();
    }
  };

  const manejarDniCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    // Permitir solo números y restringir a una longitud mínima
    const regex = /^\d{0,8}$/; // Solo números, hasta 8 dígitos
    if (regex.test(valor)) {
      setDni(valor);
    }
  };

  const manejarTelefonoCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    // Permitir solo números y restringir a una longitud mínima
    const regex = /^[0-9]{0,9}$/; // Solo números, hasta 9 dígitos
    if (regex.test(valor)) {
      setTelefono(valor);
    }
  };

  const manejarCambioCorreo = (event: ChangeEvent<HTMLInputElement>) => {
    const valor = event.target.value;
    const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/; // Valida que sea un Gmail
    setCorreo(valor);

    if (!regex.test(valor)) {
      console.error("Por favor ingrese un correo válido de Gmail.");
    }
  };

  const manejarNombreCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    // Permitir solo caracteres alfabéticos y espacios
    if (/^[a-zA-Z\s]*$/.test(valor)) {
      setNombre(valor);
    }
  };

  const handleCloseModal = () => {
    limpiarCampos();
    handleClose();
  };

  const limpiarCampos = () => {
    setDni("");
    setNombre("");
    setApellidoPaterno("");
    setApellidoMaterno("");
    setEstado("Activo");
    setCuota("");
    setTelefono("");
    setCorreo("");
    setDireccion("");
    setErrors({});
    setFecha("");
  };

  useEffect(() => {
    const fetchPuestos = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/v1/puestos/select');
        console.log("Puestos cargados:", response.data);
        setPues(response.data); // Almacenar los datos en el estado
      } catch (error) {
        console.error('Error al obtener los puestos', error);
      }
    };
    fetchPuestos();
  }, []);

  useEffect(() => {
    if (selectedBloque) {
      const puestosFiltrados = pues.filter(puesto => puesto.id_block === selectedBloque);
      setFilteredPuestos(puestosFiltrados);
    }
  }, [selectedBloque, pues]);

  const manejarCambio = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // const registrarSocio = async () => {
  //   try {
  //     const response = await axios.post('http://mercadolasestrellas.online/intranet/public/v1/socios', formData);
  //     console.log('Socio registrado:', response.data);
  //     // Aquí puedes manejar la respuesta, por ejemplo, mostrar un mensaje de éxito
  //   } catch (error) {
  //     console.error('Error al registrar el socio', error);
  //     // Aquí puedes manejar el error, por ejemplo, mostrar un mensaje de error
  //   }
  // };
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

  const manejarCheckCambio = (servicio: string) => {
    setItemsSeleccionados((prev) =>
      prev.includes(servicio)
        ? prev.filter((item) => item !== servicio)
        : [...prev, servicio]
    );
  };

  const manejarAnioCambio = (evento: SelectChangeEvent<string>) => {
    setAnio(evento.target.value as string);
  };

  const manejarMesCambio = (evento: SelectChangeEvent<string>) => {
    setMes(evento.target.value as string);
  };

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

            <Grid container spacing={3} sx={{ mt: -4 }}>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",

                    fontSize: "0.8rem",
                    color: "black",
                    textAlign: "center",
                    mb: 0, // Reduce el margen inferior
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "0.8rem",
                    color: "black",
                    textAlign: "center",
                    mb: 0, // Reduce el margen inferior
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
              </Grid>
            </Grid>

            <Box component="form" noValidate autoComplete="off">
              <Grid container spacing={2}>
                {" "}
                {/* Reducción del espaciado */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel id="tipo-persona-label">
                      Tipo Persona
                    </InputLabel>
                    <Select
                      labelId="tipo-persona-label"
                      label="Tipo Persona (*)"
                      error={!!errors.tipoPersona}
                      // value={tipoPersona}
                      // onChange={handleTipoPersonaChange}
                      startAdornment={<Person sx={{ mr: 1, color: "gray" }} />}
                    >
                      <MenuItem value="Natural">Natural</MenuItem>
                      <MenuItem value="Juridica">Jurídica</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nro. Telefono (*)"
                    value={telefono}
                    onChange={manejarTelefonoCambio}
                    InputProps={{
                      startAdornment: <Phone sx={{ mr: 1, color: "gray" }} />,
                    }}
                    error={!!errors.telefono}
                    helperText={errors.telefono}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nombre (*)"
                    name="nombre"
                    value={formData.nombre}
                    onChange={manejarCambio}
                    InputProps={{
                      startAdornment: (
                        <AccountCircle sx={{ mr: 1, color: "gray" }} />
                      ),
                    }}
                    error={!!errors.nombre}
                    helperText={errors.nombre}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Correo (*)"
                    sx={{ mt: 0 }}
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
              </Grid>

              <Grid container spacing={2} sx={{ mt: 0 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Apellido Paterno (*)"
                    // value={apellidoPaterno}
                    // onChange={manejarApellidoPaternoCambio}
                    InputProps={{
                      startAdornment: (
                        <AccountCircle sx={{ mr: 1, color: "gray" }} />
                      ),
                    }}
                    error={!!errors.apellidoPaterno}
                    helperText={errors.apellidoPaterno}
                  />
                </Grid>

                <Grid item xs={12} sm={6} sx={{ mt: -1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "0.8rem",
                      color: "black",
                      textAlign: "center",
                      mb: 0, // Reduce el margen inferior para acercar el campo "Bloque"
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
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Apellido Materno (*)"
                    // value={apellidoMaterno}
                    // onChange={manejarApellidoMaternoCambio}
                    InputProps={{
                      startAdornment: (
                        <AccountCircle sx={{ mr: 1, color: "gray" }} />
                      ),
                    }}
                    error={!!errors.apellidoMaterno}
                    helperText={errors.apellidoMaterno}
                  />
                </Grid>

                <Grid item xs={12} sm={6} sx={{ mt: -6 }}>
                  <FormControl fullWidth required>
                    <InputLabel id="bloque-label">Bloque</InputLabel>
                    <Select
                      labelId="bloque-label"
                      id="select-bloque"
                      value={selectedBloque}
                      onChange={(e) => {
                        const value = e.target.value as number;
                        setSelectedBloque(value);
                        setFormData({ ...formData, bloque: value.toString() });
                      }}
                      label="Bloque"
                    >
                      {pues.map((puesto: Puesto) => (
                        <MenuItem key={puesto.id_block} value={puesto.id_block}>
                          {`Bloque ${puesto.id_block}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="DNI (*)"
                    required
                    value={dni}
                    onChange={manejarDniCambio}
                    InputProps={{
                      startAdornment: <Badge sx={{ mr: 1, color: "gray" }} />,
                    }}
                    error={!!errors.dni}
                    helperText={errors.dni}
                  />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ mt: -6 }}>
                  <FormControl fullWidth required>
                    <InputLabel id="nro-puesto-label">Nro. Puesto</InputLabel>
                    <Select
                      labelId="nro-puesto-label"
                      id="select-puesto"
                      value={selectedPuesto}
                      onChange={(e) => {
                        const value = e.target.value as string;
                        setSelectedPuesto(value);
                        setFormData({ ...formData, numeroPuesto: value });
                      }}
                      label="Puesto"
                    >
                      {filteredPuestos.map((puesto: Puesto) => (
                        <MenuItem key={puesto.id_puesto} value={puesto.numero_puesto}>
                          {puesto.numero_puesto}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  {/* <TextField
                            fullWidth
                            label="DNI (*)"
                            required
                            value={dni}
                            onChange={manejarDniCambio}
                            InputProps={{
                              startAdornment: (
                                <Dns sx={{ mr: 1, color: "gray" }} />
                              ),
                            }}
                            error={!!errors.dni}
                            helperText={errors.dni}
                          /> */}
                  <TextField
                    fullWidth
                    label="Sexo"
                    InputProps={{
                      startAdornment: <Wc sx={{ mr: 1, color: "gray" }} />,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} sx={{ mt: -7 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "0.8rem",
                      color: "black",
                      textAlign: "center",
                      mb: 0, // Reduce el margen inferior para acercar el campo "Bloque"
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
                  <FormControl fullWidth required sx={{ mt: 2 }}>
                    <InputLabel id="estado-label">Estado</InputLabel>
                    <Select
                      labelId="estado-label"
                      label="Estado"
                      value={estado}
                      onChange={handleEstadoChange}
                      startAdornment={<Person sx={{ mr: 1, color: "gray" }} />}
                    >
                      <MenuItem value="Activo">Activo</MenuItem>
                      <MenuItem value="Inactivo">Inactivo</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Fecha de Registro"
                    type="date"
                    value={fecha}
                    onChange={handleDateChange}
                    sx={{ mt: 2 }}
                    InputProps={{
                      startAdornment: (
                        <Event sx={{ mr: 1, color: 'gray' }} />
                      ),
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ mt: -8.5 }}>
                  <TextField
                    fullWidth
                    label="Dirección (*)"
                    sx={{ mt: 2 }}
                    required
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    InputProps={{
                      startAdornment: <Home sx={{ mr: 1, color: "gray" }} />,
                    }}
                    error={!!errors.direccion}
                    helperText={errors.direccion}
                  />
                </Grid>
              </Grid>
            </Box>
          </>
        );
      case 1: // REGISTRAR INQUILINO
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

            <Grid container spacing={3} sx={{ mt: -4 }}>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "0.8rem",
                    color: "black",
                    textAlign: "center",
                    mb: 0, // Reduce el margen inferior
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "0.8rem",
                    color: "black",
                    textAlign: "center",
                    mb: 0, // Reduce el margen inferior
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
              </Grid>
            </Grid>
            <Box component="form" noValidate autoComplete="off">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nombre"
                    required
                    value={nombre}
                    onChange={manejarNombreCambio}
                    InputProps={{
                      startAdornment: (
                        <AccountCircle sx={{ mr: 1, color: "gray" }} />
                      ),
                    }}
                    error={!!errors.nombre}
                    helperText={errors.nombre}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nro. Telefono"
                    required
                    value={telefono}
                    onChange={manejarTelefonoCambio}
                    InputProps={{
                      startAdornment: <Phone sx={{ mr: 1, color: "gray" }} />,
                    }}
                    error={!!errors.telefono}
                    helperText={errors.telefono}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ mt: 0 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Apellido Paterno"
                    required
                    // value={apellidoPaterno}
                    // onChange={manejarApellidoPaternoCambio}
                    InputProps={{
                      startAdornment: (
                        <AccountCircle sx={{ mr: 1, color: "gray" }} />
                      ),
                    }}
                    error={!!errors.apellidoPaterno}
                    helperText={errors.apellidoPaterno}
                  />
                </Grid>

                <Grid item xs={12} sm={6} sx={{ mt: -1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "0.8rem",
                      color: "black",
                      textAlign: "center",
                      mb: 0, // Reduce el margen inferior para acercar el campo "Bloque"
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
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Apellido Materno"
                    required
                    // value={apellidoMaterno}
                    // onChange={manejarApellidoMaternoCambio}
                    InputProps={{
                      startAdornment: (
                        <AccountCircle sx={{ mr: 1, color: "gray" }} />
                      ),
                    }}
                    error={!!errors.apellidoMaterno}
                    helperText={errors.apellidoMaterno}
                  />
                </Grid>

                <Grid item xs={12} sm={6} sx={{ mt: -6 }}>
                  <FormControl fullWidth required>
                    <InputLabel id="bloque-label">Bloque</InputLabel>
                    <Select
                      labelId="bloque-label"
                      label="Bloque"
                      // value={tipoPersona}
                      // onChange={handleTipoPersonaChange}
                      startAdornment={<Person sx={{ mr: 1, color: "gray" }} />}
                    >
                      <MenuItem value="Natural">Natural</MenuItem>
                      <MenuItem value="Juridica">Jurídica</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="DNI"
                    required
                    value={dni}
                    onChange={manejarDniCambio}
                    InputProps={{
                      startAdornment: <Badge sx={{ mr: 1, color: "gray" }} />,
                    }}
                    error={!!errors.dni}
                    helperText={errors.dni}
                  />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ mt: -6 }}>
                  <FormControl fullWidth required>
                    <InputLabel id="nro-puesto-label">Nro. Puesto</InputLabel>
                    <Select
                      labelId="nro-puesto-label"
                      label="Nro Puesto"
                      // value={tipoPersona}
                      // onChange={handleTipoPersonaChange}
                      startAdornment={<Person sx={{ mr: 1, color: "gray" }} />}
                    >
                      <MenuItem value="Natural">Natural</MenuItem>
                      <MenuItem value="Juridica">Jurídica</MenuItem>
                    </Select>
                  </FormControl>
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
          p: 3,
          bgcolor: "white",
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
            sx={{ textAlign: "center", fontSize: "0.9rem" }}
          >
            REGISTRAR NUEVO SOCIO
          </Typography>
        </Box>

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
            <Tab label="REGISTRAR INQUILINO" />
          </Tabs>
        </Box>
        {renderTabContent()}

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
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
              backgroundColor: "#008001",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#388E3C",
              },
            }}
            onClick={handleSubmit}
          >
            Registrar
          </Button>
        </Box>
      </Card>
    </Modal>
  );
};

export default Agregar;
