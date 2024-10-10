import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Grid,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
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
import { manejarError, mostrarAlerta, mostrarAlertaConfirmacion } from "../Alerts/Registrar";
import BotonesModal from "../Shared/BotonesModal";
import ContenedorModal from "../Shared/ContenedorModal";

interface AgregarProps {
  open: boolean;
  handleClose: () => void;
  socio: EditarSocio | null;
  // onSocioRegistrado: () => void;  // Nuevo callback para actualizar la lista
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

const Agregar: React.FC<AgregarProps> = ({ open, handleClose, socio }) => {

  // Para los select
  const [bloques, setBloques] = useState<Bloque[]>([]);
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [puestosFiltrados, setPuestosFiltrados] = useState<Puesto[]>([]);
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState<number | "">("");
  const [puestoSeleccionado, setPuestoSeleccionado] = useState<number | "">("");

  const [activeTab, setActiveTab] = useState(0)
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
      setBloqueSeleccionado(Number(socio.id_block));
      setPuestoSeleccionado(Number(socio.id_puesto));
    }
  }, [socio]);

  const limpiarCamposSocio = () => {
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
    setBloqueSeleccionado("");
    setPuestoSeleccionado("");
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
        setPuestos(response.data);
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

  // Metodo para obtener el titulo del modal
  const obtenerTituloModal = (): string => {
    if (socio !== null) {
      return "EDITAR SOCIO";
    }
    else {
      return "REGISTRAR NUEVO SOCIO";
    }
  }

  // Registrar socio
  const registrarSocio = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    const { id_socio, id_block, ...dataToSend } = formData;
    try {
      const response = await axios.post("https://mercadolasestrellas.online/intranet/public/v1/socios", dataToSend);
      if (response.status === 200) {
        const mensaje = response.data.message || "El socio se registró correctamente";
        mostrarAlerta("Registro exitoso", mensaje, "success").then(() => {
          onSocioRegistrado();
          handleCloseModal();
        });
      } else {
        mostrarAlerta(
          "error"
        );
      }
    } catch (error) {
      manejarError(error);
    } finally {
      setLoading(false);
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
        const mensaje = response.data || "El socio se actualizó correctamente";
        mostrarAlerta("Actualización exitosa", mensaje, "success");
        limpiarCamposSocio();
        onSocioRegistrado();
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

  const handleCloseModal = () => {
    limpiarCamposSocio();
    handleClose();
  };

  const onSocioRegistrado = () => {
    window.location.reload();
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
                        disabled={socio !== null}
                        options={puestosFiltrados}
                        getOptionLabel={(puesto) => puesto.numero_puesto.toString()} // Convertir numero_puesto a string para mostrarlo correctamente
                        value={
                          puestoSeleccionado
                            ? puestosFiltrados.find(puesto => puesto.id_puesto === puestoSeleccionado) || null // Buscar el puesto seleccionado en la lista de puestos filtrados
                            : null // Si no hay puesto seleccionado, mostrar null
                        }
                        onChange={(event, newValue) => {
                          if (newValue) {
                            setFormData({ ...formData, id_puesto: newValue.id_puesto.toString() });
                            setPuestoSeleccionado(Number(newValue.id_puesto));
                          } else {
                            setPuestoSeleccionado("");
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
    <ContenedorModal
      ancho="720px"
      alto="auto"
      abrir={open}
      cerrar={handleCloseModal}
      titulo={obtenerTituloModal()}
      loading={loading}
    >

      {renderTabContent()}

      <BotonesModal
        loading={loading}
        action={async (e) => {
          if (activeTab === 0) {
            const result = await mostrarAlertaConfirmacion(
              "¿Está seguro de registrar un nuevo socio?"
            );
            if (result.isConfirmed) {
              if (socio) {
                editarSocio(e);
              } else {
                registrarSocio(e);
              }
            }
          }
        }}
        close={handleCloseModal}
      />

    </ContenedorModal>
  );
};

export default Agregar;