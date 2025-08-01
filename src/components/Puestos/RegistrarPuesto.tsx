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
  Button,
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
import apiClient from '../../Utils/apliClient';
import { Api_Global_Puestos } from '../../service/PuestoApi';
import { Api_Global_Blocks } from '../../service/BlocksApi';
import { Api_Global_GiroNegocio } from '../../service/GiroNegocioApi';
import { Api_Global_Socios } from '../../service/SocioApi';
import { Bloque, GiroNegocio, Puesto, PuestoSelect } from '../../interface/Puestos';
import { SocioSelect } from '../../interface/Socios';

interface AgregarProps {
  open: boolean;
  handleClose: () => void;
  puesto: Puesto | null;
}

const RegistrarPuesto: React.FC<AgregarProps> = ({ open, handleClose, puesto }) => {

  const [activeTab, setActiveTab] = useState(0);

  // Para los select
  const [bloques, setBloques] = useState<Bloque[]>([]);
  const [girosNegocio, setGirosNegocio] = useState<GiroNegocio[]>([]);
  const [puestosSinSocio, setPuestosSinSocio] = useState<PuestoSelect[]>([]);
  const [puestosSinInquilino, setPuestosSinInquilino] = useState<PuestoSelect[]>([]);
  const [socios, setSocios] = useState<SocioSelect[]>([]);
  const [puestosSocio, setPuestosSocios] = useState<PuestoSelect[]>([]);

  const [bloqueSeleccionado, setBloqueSeleccionado] = useState<number | 0>(0);
  const [giroSeleccionado, setGiroSeleccionado] = useState<number | 0>(0);
  const [bloqueInqSeleccionado, setBloqueInqSeleccionado] = useState<number | "">("");
  const [puestoInqSeleccionado, setPuestoInqSeleccionado] = useState<number | "">("");

  const [loading, setLoading] = useState(false);

  // Datos para registrar el puesto
  const [formDataPuesto, setFormDataPuesto] = useState({
    id_gironegocio: 0,
    id_block: 0,
    numero_puesto: "",
    area: "",
    fecha_registro: "",
  });

  // Datos para asignar un puesto a un socio
  const [formDataAsginarPuesto, setFormDataAsignarPuesto] = useState({
    id_puesto: "",
    id_socio: "",
  });

  // Datos para asignar un inquilino a un puesto
  const [formDataInquilino, setformDataInquilino] = useState({
    id_inquilino: "",
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    dni: "",
    telefono: "",
    bloque: 0,
    id_puesto: 0,
  });

  // Datos para registrar el bloque
  const [formDataBloque, setFormDataBloque] = useState({
    nombre: "",
  });

  // Datos para registrar el giro de negocio
  const [formDataGiroNegocio, setFormDataGiroNegocio] = useState({
    nombre: "",
  });

  // Datos para la transferencia de puesto
  const [formDataTransferencia, setFormDataTransferencia] = useState({
    id_duenio_actual: "",
    id_puesto: "",
    id_nuevo_duenio: "",
  });

  // Llenar campos con los datos del puesto seleccionado
  useEffect(() => {
    if (puesto) {
      setActiveTab(0);
      setFormDataPuesto({
        id_gironegocio: puesto.giro_negocio.id_gironegocio || 0,
        id_block: puesto.block.id_block || 0,
        numero_puesto: puesto.numero_puesto || "",
        area: puesto.area || "",
        fecha_registro: reFormatDate(puesto.fecha_registro) || "",
      });
      setformDataInquilino({
        id_inquilino: puesto.inquilino.id_inquilino || "",
        nombre: puesto.inquilino.nombre || "",
        apellido_paterno: puesto.inquilino.apellido_paterno || "",
        apellido_materno: puesto.inquilino.apellido_materno || "",
        dni: puesto.inquilino.dni || "",
        telefono: puesto.inquilino.telefono || "",
        bloque: puesto.block.id_block || 0,
        id_puesto: puesto.id_puesto || 0,
      });
      setBloqueInqSeleccionado(puesto.block.id_block);
      setPuestoInqSeleccionado(puesto.id_puesto);
      setGiroSeleccionado(puesto.giro_negocio.id_gironegocio);
    }
  }, [puesto]);

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
  const fetchBloques = async () => {
    try {
      const response = await apiClient.get(Api_Global_Blocks.blocks.buscar());
      setBloques(response.data.data);
    } catch (error) {
      console.error("Error al obtener los bloques", error);
    }
  };

  // Obtener giro de negocio
  const fechGiroNegocio = async () => {
    try {
      const response = await apiClient.get(Api_Global_GiroNegocio.giroNegocios.buscar());
      setGirosNegocio(response.data.data);
    } catch (error) {
      console.error("Error al obtener los giro de negocio", error);
    }
  };

  // Obtener puestos libres (Sin socio)
  const fetchPuestosSinSocio = async (id_block: number) => {
    try {
      const response = await apiClient.get(Api_Global_Puestos.puestos.sinSocio(id_block));
      setPuestosSinSocio(response.data);
    } catch (error) {
      console.error("Error al obtener los puestos", error);
    }
  };

  // Obtener puestos libres (Sin inquilino)
  const fetchPuestosSinInquilino = async (id_block: number) => {
    try {
      const response = await apiClient.get(Api_Global_Puestos.puestos.sinInquilino(id_block));
      setPuestosSinInquilino(response.data);
    } catch (error) {
      console.error("Error al obtener los puestos", error);
    }
  };

  // Obtener socios
  const fetchSocios = async () => {
    try {
      const response = await apiClient.get(Api_Global_Socios.socios.buscar(1, 150));
      setSocios(response.data.data);
    } catch (error) {
      console.error("Error al obtener el listado de socios", error);
    }
  };

  // Obtener puestos por socio
  const fetchPuestosSocio = async (idSocio: string) => {
    try {
      const response = await apiClient.get(Api_Global_Puestos.puestos.buscar(1, 500, "", "", "", idSocio));
      setPuestosSocios(response.data.data);
    } catch (error) {
      console.error("Error al obtener los puestos", error);
    }
  };

  useEffect(() => {
    fetchBloques();
    fechGiroNegocio();
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

    if (puesto && (newValue === 1 || newValue === 3 || newValue === 4 || newValue === 5)) {
      return; // No permitir cambiar a las pestañas 1, 3, 4, 5 si el puesto existe
    }

    setActiveTab(newValue);

    if (puesto) {
      limpiarAsignarPuesto();
      limpiarNuevoBloque();
      limpiarGiroNegocio();
    } else {
      limpiarRegistrarPuesto();
      limpiarAsignarPuesto();
      limpiarAsignarInquilino();
      limpiarNuevoBloque();
      limpiarGiroNegocio();
    }

  }

  // Metodo para obtener el titulo del modal
  const obtenerTituloModal = (): string => {
    switch (activeTab) {
      case 0:
        return puesto ? "EDITAR PUESTO" : "REGISTRAR PUESTO";
      case 1:
        return "ASIGNAR SOCIO";
      case 2:
        return puesto ? "EDITAR INQUILINO" : "ASIGNAR INQUILINO";
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
      id_gironegocio: 0,
      id_block: 0,
      numero_puesto: "",
      area: "",
      fecha_registro: "",
    });
    setGiroSeleccionado(0);
  };

  const limpiarAsignarPuesto = () => {
    setFormDataAsignarPuesto({
      id_puesto: "",
      id_socio: "",
    });
    setBloqueSeleccionado(0);
  };

  const limpiarAsignarInquilino = () => {
    setformDataInquilino({
      id_inquilino: "",
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      dni: "",
      telefono: "",
      bloque: 0,
      id_puesto: 0,
    });
    setBloqueInqSeleccionado("");
    setPuestoInqSeleccionado("");
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

  // Registrar Puesto
  const registrarPuesto = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    const { ...dataToSend } = formDataPuesto;
    try {
      const response = await apiClient.post(Api_Global_Puestos.puestos.registrar(), dataToSend);
      if (response.status === 200) {
        const mensaje = response.data.message || "Puestoss registrado con éxito";
        mostrarAlerta("Registro exitoso", mensaje, "success").then(() => {
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

  // Editar Puesto
  const editarPuesto = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    const { ...dataToSend } = formDataPuesto;
    try {
      const response = await apiClient.put(Api_Global_Puestos.puestos.editar(puesto?.id_puesto), dataToSend);
      if (response.status === 200) {
        const mensaje = response.data.message ||`Los datos del puesto:¿ fueron actualizados con éxito`;
        mostrarAlerta("Actualización exitosa", mensaje, "success").then(() => {
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

  // Asignar Puesto
  const asignarPuestoSocio = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    const dataToSend = formDataAsginarPuesto;
    try {
      const response = await apiClient.post(Api_Global_Puestos.puestos.asignarPuesto(), dataToSend);
      if (response.status === 200) {
        const mensaje = response.data.message || "Puesto registrado con éxito";
        mostrarAlerta("Registro exitoso", mensaje, "success").then(() => {
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

  // Registar inquilino
  const asignarInquilino = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    const { id_inquilino, bloque, ...dataToSend } = formDataInquilino;
    try {
      const response = await apiClient.post(Api_Global_Puestos.inquilinos.registrar(), dataToSend); 
      if (response.status === 200) {
        const mensaje = response.data.message || "El inquilino se registró correctamente";
        mostrarAlerta("Registro exitoso", mensaje, "success").then(() => {
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

  // Actualizar inquilino
  const editarInquilino = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    const { bloque, ...dataToSend } = formDataInquilino;
    try {
      const response = await apiClient.put(Api_Global_Puestos.inquilinos.editar((puesto?.inquilino?.id_inquilino)), dataToSend); 
      if (response.status === 200) {
        const mensaje = response.data.message || "Los datos del inqulino se fueron actualizados correctamente";
        mostrarAlerta("Registro exitoso", mensaje, "success").then(() => {
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

  const eliminarInquilino = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiClient.delete(Api_Global_Puestos.inquilinos.eliminar((Number(puesto?.inquilino?.id_inquilino))));
      if (response.status === 200) {
        const mensaje = response.data.message || "El inquilino se eliminó correctamente";
        mostrarAlerta("Eliminación exitosa", mensaje, "success").then(() => {
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
  }

  const registrarBloque = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    const dataToSend = { ...formDataBloque };
    try {
      const response = await apiClient.post(Api_Global_Puestos.bloques.registrar(), dataToSend);
      if (response.status === 200) {
        const mensaje = response.data.message;
        mostrarAlerta("Registro exitoso", mensaje, "success").then(() => {
          fetchBloques();
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
      const response = await apiClient.post(Api_Global_Puestos.girosNegocio.registrar(), dataToSend);
      if (response.status === 200) {
        const mensaje = response.data.message;
        mostrarAlerta("Registro exitoso", mensaje, "success").then(() => {
          fechGiroNegocio();
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

  const transferirPuesto = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    const dataToSend = formDataTransferencia;
    try {
      const response = await apiClient.post(Api_Global_Puestos.puestos.transferir(), dataToSend);
      if (response.status === 200) {
        const mensaje = response.data.message;
        mostrarAlerta("Transferencia exitosa", mensaje, "success").then(() => {
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
  }

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
                      setFormDataPuesto({ ...formDataPuesto, id_block: Number(value) });
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
                          id_gironegocio: newValue.id_gironegocio
                        });
                        setGiroSeleccionado(newValue.id_gironegocio);
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
                      fetchPuestosSinSocio(value);
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
                    options={puestosSinSocio}
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
                    getOptionLabel={(socio) => socio.nombre_completo.toString()} // Mostrar el nombre completo del socio
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
      case 2: // ASIGNAR INQUILINO
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

                  {!puesto && (
                    <>
                      <SeparadorBloque nombre="Seleccionar puesto" />
                      <FormControl fullWidth required>
                        <InputLabel id="bloque-label">Bloque</InputLabel>
                        <Select
                          disabled={puesto !== null}
                          labelId="bloque-label"
                          id="select-bloque"
                          label="Bloque"
                          value={bloqueInqSeleccionado}
                          onChange={(e) => {
                            const value = e.target.value as number;
                            setBloqueInqSeleccionado(value);
                            fetchPuestosSinInquilino(value);
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

                      <FormControl fullWidth required sx={{ mb: 2 }}>
                        <Autocomplete
                          disabled={puesto !== null}
                          options={puestosSinInquilino}
                          getOptionLabel={(puestoSelect) =>
                            puestoSelect.numero_puesto.toString()
                          } // Convertir numero_puesto a string para mostrarlo correctamente
                          value={
                            puestoInqSeleccionado 
                              ? puestosSinInquilino.find((puesto) => puesto.id_puesto === puestoInqSeleccionado
                              ) || null : null
                          }
                          onChange={(event, newValue) => {
                            if (newValue) {
                              setformDataInquilino({
                                ...formDataInquilino,
                                id_puesto: newValue.id_puesto
                              });
                              setPuestoInqSeleccionado(Number(newValue.id_puesto));
                            } else {
                              setPuestoInqSeleccionado("");
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
                    </>
                  )}

                  {puesto && puesto.inquilino.id_inquilino && (
                    <Button
                      fullWidth
                      variant="contained"
                      color="error"
                      onClick={eliminarInquilino}
                    >
                      Remover inquilino
                    </Button>
                  )}
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
      case 5: // PAGO TRANSFERENCIA PUESTO
        return(
          <>
            <AvisoFormulario/>
            {/* <pre>{JSON.stringify(formDataTransferencia, null, 2)}</pre> */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                {/* Seleccionar dueño actual */}
                <SeparadorBloque nombre="Dueño actual" />

                <FormControl fullWidth required sx={{ mb: 2 }}>
                  <Autocomplete
                    options={socios}
                    getOptionLabel={(socio) => socio.nombre_completo} // Mostrar el nombre completo del socio
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setFormDataTransferencia({
                          ...formDataTransferencia,
                          id_duenio_actual: newValue.id_socio.toString(),
                        });
                        fetchPuestosSocio(newValue.id_socio.toString());
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Seleccionar socio"
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

                <SeparadorBloque nombre="Seleccionar puesto" />

                {/* Seleccionar Puesto */}
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel id="seleccionar-puesto-label">
                    Seleccionar Puesto
                  </InputLabel>
                  <Select
                    labelId="seleccionar-puesto-label"
                    label="Seleccionar Puesto"
                    id="select-puesto"
                    onChange={(e) => {
                      const value = String(e.target.value);
                      setFormDataTransferencia({
                        ...formDataTransferencia,
                        id_puesto: value,
                      });
                    }}
                    startAdornment={<Business sx={{ mr: 1, color: "gray" }} />}
                  >
                    {puestosSocio.map((puesto: PuestoSelect) => (
                      <MenuItem key={puesto.id_puesto} value={puesto.id_puesto}>
                        {puesto.numero_puesto}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <SeparadorBloque nombre="Nuevo dueño" />

                <FormControl fullWidth required>
                  <Autocomplete
                    options={socios}
                    getOptionLabel={(socio) => socio.nombre_completo} // Mostrar el nombre completo del socio
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setFormDataTransferencia({
                          ...formDataTransferencia,
                          id_nuevo_duenio: newValue.id_socio.toString(),
                        });
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Seleccionar socio"
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
      activeTab={activeTab}
      handleTabChange={handleTabChange}
      tabs={[
        puesto ? "Editar Puesto" : "Registrar Puesto", 
        "Asignar Puesto", 
        puesto ? "Editar Inquilino" : "Asignar Inquilino", 
        "Registrar Bloque", 
        "Registrar Giro de Negocio", 
        "Pagos transferencia de puestos"
      ]}
      botones={(
        <BotonesModal
          loading={loading}
          obj={puesto}
          action={async (e) => {
            let result; 
            if (activeTab === 0) {
              const mensaje = puesto? "¿Está seguro de editar este Puesto?" : "¿Está seguro de registrar un nuevo Puesto?";
              const result = await mostrarAlertaConfirmacion(mensaje); 
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
              const mensaje = puesto ? "¿Está seguro de editar este inquilino?" : "¿Está seguro de asignar un inquilino?";
              const result = await mostrarAlertaConfirmacion(mensaje);
              if (result.isConfirmed) {
                if (puesto) {
                  editarInquilino(e);
                } else {
                  asignarInquilino(e);
                }
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

            if (activeTab === 5) {
              result = await mostrarAlertaConfirmacion( // Mostrar alerta de confirmación para registrar giro de negocio
                "¿Está seguro de realizar la transferencia de dueño?",
              );
              if (result.isConfirmed) {
                transferirPuesto(e); // Transferir puesto
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
