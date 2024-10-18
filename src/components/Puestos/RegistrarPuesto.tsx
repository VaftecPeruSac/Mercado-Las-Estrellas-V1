import {
  Abc,
  AccountCircle,
  AddBusiness,
  Badge,
  Business,
  Event,
  Phone,
  Straighten
} from '@mui/icons-material';
import {
  Autocomplete,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { manejarError, mostrarAlerta, mostrarAlertaConfirmacion } from '../Alerts/Registrar';
import BotonesModal from '../Shared/BotonesModal';
import ContenedorModal from '../Shared/ContenedorModal';
import { AvisoFormulario, SeparadorBloque, TxtFormulario } from '../Shared/ElementosFormulario';
import { reFormatDate } from '../../Utils/dateUtils';

interface AgregarProps {
  open: boolean;
  handleClose: () => void;
  puesto: EditarPuesto | null;
}

interface EditarPuesto {
  id_puesto: string;
  numero_puesto: string;
  area: string;
  estado: string;
  fecha_registro: string;
  socio: string;
  giro_negocio: {
    id_gironegocio: string;
    nombre: string;
  };
  block: {
    id_block: string;
    nombre: string;
  };
  inquilino: string;
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
  nombre_completo: string;
}

const RegistrarPuesto: React.FC<AgregarProps> = ({ open, handleClose, puesto }) => {

  const [activeTab, setActiveTab] = useState(0);

  // Para los select
  const [bloques, setBloques] = useState<Bloque[]>([]);
  const [girosNegocio, setGirosNegocio] = useState<GiroNegocio[]>([]);
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState<number | "">("");
  const [giroSeleccionado, setGiroSeleccionado] = useState<number | "">("");
  const [puestosFiltrados, setPuestosFiltrados] = useState<Puesto[]>([]);
  const [socios, setSocios] = useState<Socio[]>([]);
  const [loading, setLoading] = useState(false);

  // Datos para registrar el puesto
  const [formDataPuesto, setFormDataPuesto] = useState({
    id_puesto: "",
    id_gironegocio: "",
    id_block: "",
    numero_puesto: "",
    area: "",
    fecha_registro: "",
  });

  // Llenar campos con los datos del puesto seleccionado
  useEffect(() => {
    if (puesto) {
      console.log("Puesto obtenido:", puesto);
      setFormDataPuesto({
        id_puesto: puesto.id_puesto || "",
        id_gironegocio: puesto.giro_negocio.id_gironegocio || "",
        id_block: puesto.block.id_block || "",
        numero_puesto: puesto.numero_puesto || "",
        area: puesto.area || "",
        fecha_registro: reFormatDate(puesto.fecha_registro) || "",
      });
      setGiroSeleccionado(Number(puesto.giro_negocio.id_gironegocio));
    }
  }, [puesto]);

  // Datos para asignar un puesto a un socio
  const [formDataAsginarPuesto, setFormDataAsignarPuesto] = useState({
    id_puesto: "",
    id_socio: "",
  });

  // Datos para asignar un inquilino a un puesto
  const [formDataInquilino, setformDataInquilino] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    dni: "",
    telefono: "",
    bloque: "",
    id_puesto: "",
  });

  // Datos para registrar el bloque
  const [formDataBloque, setFormDataBloque] = useState({
    nombre: "",
  });

  // Datos para registrar el giro de negocio
  const [formDataGiroNegocio, setFormDataGiroNegocio] = useState({
    nombre: "",
  });

  const manejarCambioInquilino = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setformDataInquilino({
      ...formDataInquilino,
      [name]: value,
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

  // Obtener giro de negocio
  useEffect(() => {
    const fechGiroNegocio = async () => {
      try {
        const response = await axios.get("https://mercadolasestrellas.online/intranet/public/v1/giro-negocios");
        setGirosNegocio(response.data.data);
      } catch (error) {
        console.error("Error al obtener los giro de negocio", error);
      }
    };
    fechGiroNegocio();
  }, []);

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


  // Obtener puestos libres
  const fetchPuestosLibres = async (id_block: number) => {
    try {
      const response = await axios.get(`https://mercadolasestrellas.online/intranet/public/v1/puestos/libre?id_block=${id_block}`); // publico
      setPuestos(response.data.data); // Almacenar los datos en el estado
    } catch (error) {
      console.error("Error al obtener los puestos", error);
    }
  };

  // Obtener socios
  useEffect(() => {
    const fetchSocios = async () => {
      try {
        const response = await axios.get("https://mercadolasestrellas.online/intranet/public/v1/socios?per_page=150"); // publico
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
    setFormDataGiroNegocio({
      ...formDataGiroNegocio,
      [name]: value,
    });
  };

  // Cambiar entre pestañas
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    limpiarRegistrarPuesto();
    limpiarAsignarPuesto();
    limpiarAsignarInquilino();
    limpiarNuevoBloque();
    limpiarGiroNegocio();
  }

  // Metodo para obtener el titulo del modal
  const obtenerTituloModal = (): string => {
    switch (activeTab) {
      case 0:
        if (puesto) {
          return "EDITAR PUESTO";
        } else {
          return "REGISTRAR PUESTO";
        }
      case 1:
        return "ASIGNAR SOCIO";
      case 2:
        return "ASIGNAR INQUILINO";
      case 3:
        return "REGISTRAR BLOQUE";
      case 4:
        return "REGISTRAR GIRO DE NEGOCIO";
      case 5:
        return "PAGOS TRANSFERENCIA PUESTO";
      default:
        return "";
    }
  }

  const limpiarRegistrarPuesto = () => {
    setFormDataPuesto({
      id_puesto: "",
      id_gironegocio: "",
      id_block: "",
      numero_puesto: "",
      area: "",
      fecha_registro: "",
    });
    setGiroSeleccionado("");
  };

  const limpiarAsignarPuesto = () => {
    setBloqueSeleccionado("");
    setFormDataAsignarPuesto({
      id_puesto: "",
      id_socio: "",
    });
  };

  const limpiarAsignarInquilino = () => {
    setformDataInquilino({
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      dni: "",
      telefono: "",
      bloque: "",
      id_puesto: "",
    });
  }

  const limpiarNuevoBloque = () => {
    setFormDataBloque({
      nombre: ""
    });
  };
  const limpiarGiroNegocio = () => {
    setFormDataGiroNegocio({
      nombre: ""
    });
  };

  // Cerrar modal
  const handleCloseModal = () => {
    handleClose();
    limpiarRegistrarPuesto();
    limpiarAsignarPuesto();
    limpiarNuevoBloque();
    limpiarGiroNegocio();
    limpiarAsignarInquilino();
  };

  const onRegistrar = () => {
    window.location.reload();
  };

  // Registrar Puesto
  const registrarPuesto = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    const { id_puesto, ...dataToSend } = formDataPuesto;


    try {
      const response = await axios.post("https://mercadolasestrellas.online/intranet/public/v1/puestos", dataToSend);
      if (response.status === 200) {
        const mensaje = response.data.message || "Puestoss registrado con éxito";
        mostrarAlerta("Registro exitoso", mensaje, "success").then(() => {
          onRegistrar();
          handleCloseModal();
        });
      } else {
        mostrarAlerta("Error",);
      }
    } catch (error) {
      manejarError(error);
    } finally {
      setLoading(false);
    }
  };

  // Editar Puesto
  const editarPuesto = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // Evita el comportamiento por defecto del clic
    e.preventDefault();
    setLoading(true);

    // Data a enviar
    const { ...dataToSend } = formDataPuesto;

    try {
      // Conexión al servicio
      const response = await axios.put(`https://mercadolasestrellas.online/intranet/public/v1/puestos/${puesto?.id_puesto}`, dataToSend);
      if (response.status === 200) {
        const mensaje = `Los datos del puesto: "${dataToSend.numero_puesto}" fueron actualizados con éxito`;
        mostrarAlerta("Actualización exitosa", mensaje, "success");
        onRegistrar();
        handleCloseModal();
      } else {
        mostrarAlerta("Errror");
      }
    } catch (error) {
      manejarError(error);
    } finally {
      setLoading(false);
    }
  };

  // Asignar Puesto
  const asignarPuestoSocio = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    const dataToSend = formDataAsginarPuesto;

    //De momento se usara estas validaciones hasta que implementen las validaciones a nivel de backend
    if (!dataToSend.id_puesto || !dataToSend.id_socio) {
      mostrarAlerta("Error", "Por favor, completa todos los campos requeridos.", "error");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("https://mercadolasestrellas.online/intranet/public/v1/puestos/asignar", dataToSend);
      if (response.status === 200) {
        const mensaje = response.data.message || "Puesto registrado con éxito";
        mostrarAlerta("Registro exitoso", mensaje, "success").then(() => {
          handleCloseModal();
          onRegistrar();
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

  // Registar inquilino
  const asignarInquilino = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);

    const { bloque, ...dataToSend } = formDataInquilino;
    if (!formDataInquilino.id_puesto) {
      mostrarAlerta("Error", "Por favor, ingrese el numero de puesto.", "error");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post("https://mercadolasestrellas.online/intranet/public/v1/inquilinos", dataToSend); // Publico

      if (response.status === 200) {
        const mensaje = response.data.message || "E l inquilino se registró correctamente";
        mostrarAlerta("Registro exitoso", mensaje, "success").then(() => {
          onRegistrar();
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


  // Registrar Bloque
  const registrarBloque = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    const dataToSend = { ...formDataBloque };

    try {
      const response = await axios.post("https://mercadolasestrellas.online/intranet/public/v1/blocks", dataToSend);
      if (response.status === 200) {
        const mensaje = response.data.message || "El bloque se registró correctamente";
        mostrarAlerta("Registro exitoso", mensaje, "success").then(() => {
          onRegistrar();
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

  // Registrar Giro de negocio
  const registrarGiroNegocio = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    const dataToSend = { ...formDataGiroNegocio };
    try {
      const response = await axios.post("https://mercadolasestrellas.online/intranet/public/v1/giro-negocios", dataToSend);
      if (response.status === 200) {
        const mensaje = response.data.message || "El giro de negocio se registró correctamente";
        mostrarAlerta("Registro exitoso", mensaje, "success").then(() => {
          onRegistrar();
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
  // Contenido del modal
  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // REGISTRAR PUESTO
        return (
          <>
            <AvisoFormulario />

            {/* <pre>{JSON.stringify(formDataPuesto, null, 2)}</pre> */}

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <SeparadorBloque nombre="Información del puesto" />

                {/* Seleccionar Bloque */}
                <FormControl fullWidth required sx={{ mb: 2 }}>
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
                <TxtFormulario
                  label="Nro. Puesto"
                  name="numero_puesto"
                  value={formDataPuesto.numero_puesto}
                  onChange={manejarCambioPuesto}
                  icono={<Abc sx={{ mr: 1, color: "gray" }} />}
                />

                {/* Ingresar el area */}
                <TxtFormulario
                  label="Área"
                  name="area"
                  value={formDataPuesto.area}
                  onChange={manejarCambioPuesto}
                  icono={<Straighten sx={{ mr: 1, color: "gray" }} />}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <SeparadorBloque nombre="Giro de negocio" />

                {/* Seleccionar giro de negocio */}
                <FormControl fullWidth required sx={{ mb: 2 }}>
                  <Autocomplete
                    options={girosNegocio}
                    getOptionLabel={(giroNegocio) => giroNegocio.nombre} // Mostrar el nombre del giro de negocio
                    value={
                      giroSeleccionado ? girosNegocio.find((giro) => giro.id_gironegocio === giroSeleccionado) || null : null
                    }
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setFormDataPuesto({
                          ...formDataPuesto,
                          id_gironegocio: newValue.id_gironegocio.toString(), // Convertir id_gironegocio a string
                        });
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Giro de negocio"
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <>
                              <AddBusiness sx={{ mr: 1, color: "gray" }} />
                              {params.InputProps.startAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                    ListboxProps={{
                      style: {
                        maxHeight: 225,
                        overflow: "auto",
                      },
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.id_gironegocio === Number(value)
                    } // Convertir value a número para la comparación
                  />
                </FormControl>

                {/* Separador */}
                <SeparadorBloque nombre="Información de registro" />

                {/* Ingresar fecha de registro */}
                <TxtFormulario
                  label="Fecha de Registro"
                  name="fecha_registro"
                  type="date"
                  value={formDataPuesto.fecha_registro}
                  onChange={manejarCambioPuesto}
                  icono={<Event sx={{ mr: 1, color: "gray" }} />}
                />
              </Grid>
            </Grid>
          </>
        );
      case 1: // ASIGNAR SOCIO
        return (
          <>
            <AvisoFormulario />

            {/* <pre>{JSON.stringify(formDataAsginarPuesto, null, 2)}</pre> */}

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <SeparadorBloque nombre="Seleccionar puesto" />

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
                      fetchPuestosLibres(value);
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
                  <Autocomplete
                    options={puestos}
                    getOptionLabel={(puesto) => puesto.numero_puesto}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setFormDataAsignarPuesto({
                          ...formDataAsginarPuesto,
                          id_puesto: newValue.id_puesto.toString(),
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
                        overflow: "auto",
                      },
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.id_puesto === Number(value)
                    }
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <SeparadorBloque nombre="Seleccionar socio" />

                <FormControl fullWidth required>
                  <Autocomplete
                    options={socios}
                    getOptionLabel={(socio) => socio.nombre_completo} // Mostrar el nombre completo del socio
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setFormDataAsignarPuesto({
                          ...formDataAsginarPuesto,
                          id_socio: newValue.id_socio.toString(),
                        });
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Socio"
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
                        maxHeight: 270,
                        overflow: "auto",
                      },
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.id_socio === Number(value)
                    } // Compara convirtiendo el value a número
                  />
                </FormControl>
              </Grid>
            </Grid>
          </>
        );
      case 2:
        return (
          <>
            <AvisoFormulario />
            {/* <pre>{JSON.stringify(formDataInquilino, null, 2)}</pre> */}
            {/* DATOS PERSONALES */}
            <Grid container spacing={3} sx={{ mt: -4 }}>
              <Grid item xs={12} sm={6}>
                <SeparadorBloque nombre="Datos personales" />

                {/* Nombre */}
                <TxtFormulario
                  label="Nombre"
                  name="nombre"
                  value={formDataInquilino.nombre}
                  onChange={manejarCambioInquilino}
                  icono={<AccountCircle sx={{ mr: 1, color: "gray" }} />}
                />

                {/* Apellido Paterno */}
                <TxtFormulario
                  label="Apellido Paterno"
                  name="apellido_paterno"
                  value={formDataInquilino.apellido_paterno}
                  onChange={manejarCambioInquilino}
                  icono={<AccountCircle sx={{ mr: 1, color: "gray" }} />}
                />

                {/* Apellido Materno */}
                <TxtFormulario
                  label="Apellido Materno"
                  name="apellido_materno"
                  value={formDataInquilino.apellido_materno}
                  onChange={manejarCambioInquilino}
                  icono={<AccountCircle sx={{ mr: 1, color: "gray" }} />}
                />

                {/* DNI */}
                <TxtFormulario
                  label="DNI"
                  name="dni"
                  value={formDataInquilino.dni}
                  onChange={manejarCambioInquilino}
                  icono={<Badge sx={{ mr: 1, color: "gray" }} />}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                {/* CONTACTO */}
                <Grid item xs={12} sm={12}>
                  <SeparadorBloque nombre="Contacto" />

                  {/* Nro. Telefono */}
                  <TxtFormulario
                    label="Nro. Telefono"
                    name="telefono"
                    value={formDataInquilino.telefono}
                    onChange={manejarCambioInquilino}
                    icono={<Phone sx={{ mr: 1, color: "gray" }} />}
                  />
                </Grid>

                {/* ASIGNAR PUESTO */}
                <Grid item xs={12} sm={12}>
                  <SeparadorBloque nombre="Seleccionar puesto" />

                  {/* Seleccionar bloque */}
                  <FormControl fullWidth required>
                    <InputLabel id="bloque-label">Bloque</InputLabel>
                    <Select
                      labelId="bloque-label"
                      id="select-bloque"
                      label="Bloque"
                      value={bloqueSeleccionado}
                      onChange={(e) => {
                        const value = e.target.value as number;
                        setBloqueSeleccionado(value);
                        // setFormData({ ...formData, bloque: value.toString() });
                      }}
                      startAdornment={
                        <Business sx={{ mr: 1, color: "gray" }} />
                      }
                      sx={{ mb: 2 }}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 150, // Limitar el alto del desplegable
                            overflowY: "auto", // Habilitar scroll vertical
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
                      getOptionLabel={(puesto) =>
                        puesto.numero_puesto.toString()
                      } // Convertir numero_puesto a string para mostrarlo correctamente
                      onChange={(event, newValue) => {
                        if (newValue) {
                          setformDataInquilino({
                            ...formDataInquilino,
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
                          maxHeight: 180,
                          overflow: "auto",
                        },
                      }}
                      isOptionEqualToValue={(option, value) =>
                        option.id_puesto === Number(value)
                      } // Convierte value a número para la comparación
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </>
        );
      case 3: // REGISTRAR BLOQUE
        return (
          <>
            <AvisoFormulario />

            {/* <pre>{JSON.stringify(formDataBloque, null, 2)}</pre> */}

            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <SeparadorBloque nombre="Información del bloque" />

                {/* Ingresar nombre del bloque */}
                <TxtFormulario
                  label="Nombre del bloque"
                  name="nombre"
                  value={formDataBloque.nombre}
                  onChange={manejarCambioBloque}
                  icono={<Business sx={{ mr: 1, color: "gray" }} />}
                />
              </Grid>
            </Grid>
          </>
        );
      case 4: // REGISTRAR GIRO NEGOCIO
        return (
          <>
            <AvisoFormulario />

            {/* <pre>{JSON.stringify(formDataGiroNegocio, null, 2)}</pre> */}

            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <SeparadorBloque nombre="Información del giro de negocio" />

                {/* Ingresar nombre del bloque */}
                <TxtFormulario
                  label="Nombre del giro"
                  name="nombre"
                  value={formDataGiroNegocio.nombre}
                  onChange={manejarCambioGiroNegocio}
                  icono={<Business sx={{ mr: 1, color: "gray" }} />}
                />
              </Grid>
            </Grid>
          </>
        );
        case 5:
          return(
            <>
            <AvisoFormulario/>
            {/* <pre>{JSON.stringify(formDataGiroNegocio, null, 2)}</pre> */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <SeparadorBloque nombre="Seleccionar puesto" />

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
                      fetchPuestosLibres(value);
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
                  <Autocomplete
                    options={puestos}
                    getOptionLabel={(puesto) => puesto.numero_puesto}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setFormDataAsignarPuesto({
                          ...formDataAsginarPuesto,
                          id_puesto: newValue.id_puesto.toString(),
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
                        overflow: "auto",
                      },
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.id_puesto === Number(value)
                    }
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <SeparadorBloque nombre="Seleccionar socio" />

                <FormControl fullWidth required>
                  <Autocomplete
                    options={socios}
                    getOptionLabel={(socio) => socio.nombre_completo} // Mostrar el nombre completo del socio
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setFormDataAsignarPuesto({
                          ...formDataAsginarPuesto,
                          id_socio: newValue.id_socio.toString(),
                        });
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Socio"
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
                        maxHeight: 270,
                        overflow: "auto",
                      },
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.id_socio === Number(value)
                    } // Compara convirtiendo el value a número
                  />
                </FormControl>
              </Grid>
            </Grid>
            </>
          );
      default:
        return <Typography>Seleccione una pestaña</Typography>;
    }
  }

  return (
    <ContenedorModal
      ancho="740px"
      alto="670px"
      abrir={open}
      cerrar={handleCloseModal}
      loading={loading}
      titulo={obtenerTituloModal()}
      activeTab={puesto ? 0 : activeTab}
      handleTabChange={puesto ? (e) => handleTabChange(e, 0) : handleTabChange}
      tabs={["Registrar Puesto", "Asignar Puesto", "Asignar Inquilino", "Registrar Bloque", "Registrar Giro de Negocio", "PAGOS TRANSFERENCIA DE PUESTOS"]}
      botones={(
        <BotonesModal
          loading={loading}
          action={async (e) => {
            let result; // Variable para almacenar el resultado de la alerta de confirmación
            // Cambiar a función asíncrona
            if (activeTab === 0) {
              result = await mostrarAlertaConfirmacion( // Mostrar alerta de confirmación
                "¿Está seguro de registrar un nuevo Puesto?",
              );
              if (result.isConfirmed) {
                if (puesto) {
                  editarPuesto(e);
                } else {
                  registrarPuesto(e);
                }
              }

            }
            if (activeTab === 1) {
              result = await mostrarAlertaConfirmacion( // Mostrar alerta de confirmación para asignar puesto
                "¿Está seguro de asignar un puesto a un socio?",
              );
              if (result.isConfirmed) {
                asignarPuestoSocio(e); // Asignar puesto
              }
            }
            if (activeTab === 2) {
              result = await mostrarAlertaConfirmacion( // Mostrar alerta de confirmación para asignar inquilino
                "¿Está seguro de asignar un inquilino?",
              );
              if (result.isConfirmed) {
                asignarInquilino(e); // Asignar inquilino
              }
            }

            if (activeTab === 3) {
              result = await mostrarAlertaConfirmacion( // Mostrar alerta de confirmación para registrar bloque
                "¿Está seguro de registrar un bloque?",
              );
              if (result.isConfirmed) {
                registrarBloque(e); // Registrar bloque
              }
            }

            if (activeTab === 4) {
              result = await mostrarAlertaConfirmacion( // Mostrar alerta de confirmación para registrar giro de negocio
                "¿Está seguro de registrar un giro de negocio?",
              );
              if (result.isConfirmed) {
                registrarGiroNegocio(e); // Registrar giro de negocio
              }
            }
          }}
          close={handleCloseModal}
        />
      )}
    >

      {renderTabContent()}

    </ContenedorModal>
  )

}

export default RegistrarPuesto;
