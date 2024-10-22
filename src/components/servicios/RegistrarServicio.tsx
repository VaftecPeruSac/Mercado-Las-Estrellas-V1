import {
  Bolt,
  Business,
  Event,
  Storefront,
  Straighten,
} from "@mui/icons-material";
import {
  Autocomplete,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import useResponsive from "../../hooks/Responsive/useResponsive";
import {
  manejarError,
  mostrarAlerta,
  mostrarAlertaConfirmacion,
} from "../Alerts/Registrar";
import BotonesModal from "../Shared/BotonesModal";
import ContenedorModal from "../Shared/ContenedorModal";
import {
  AvisoFormulario,
  SeparadorBloque,
  TxtFormulario,
} from "../Shared/ElementosFormulario";
import { reFormatDate } from "../../Utils/dateUtils";
import { AgregarProps, Puesto, Socio } from "../../interface/Servicios/RegistrarServicio";
import apiClient from "../../Utils/apliClient";
import { API_ROUTES } from "../../service/ServicioApi";


const RegistrarServicio: React.FC<AgregarProps> = ({
  open,
  handleClose,
  servicio,
}) => {
  const { isMobile } = useResponsive();
  const [loading, setLoading] = useState(false); 
  const [activeTab, setActiveTab] = useState(0);
  const [costoMetroCuadrado, setCostoMetroCuadrado] = useState(0);
  const [puestosActivos, setPuestosActivos] = useState(0);
  const [areaTotal, setAreaTotal] = useState(0);
  const [socios, setSocios] = useState([]);
  const [puestos, setPuestos] = useState([]);

  // Obtener Lista Socios
  useEffect(() => {
    const fetchSocios = async () => {
      try {
        const response = await apiClient.get(API_ROUTES.socios.listar());
        const data = response.data.data.map((item: Socio) => ({
          id_socio: item.id_socio,
          nombre_completo: item.nombre_completo,
        }));
        setSocios(data);
      } catch (error) {
        console.error("Error al obtener los socios", error);
      }
    };
    fetchSocios();
  }, []);

  // Obtener Lista Puestos
  const fetchPuestos = async (idSocio: string) => {
    try {
      const response = await apiClient.get(API_ROUTES.puestos.listarPorSocio(idSocio));
      const data = response.data.data.map((item: Puesto) => ({
        id_puesto: item.id_puesto,
        numero_puesto: item.numero_puesto,
        block: {
          nombre: item.block.nombre,
        },
      }));
      setPuestos(data);
    } catch (error) {
      console.error("Error al obtener los puestos", error);
    }
  };

  // Datos para registrar el servicio Por Metro Cuadrado
  const [formDataPMC, setFormDataPMC] = useState({
    id_servicio: "",
    descripcion: "",
    costo_unitario: "",
    tipo_servicio: "3",
    estado: "1", // "Activo",
    fecha_registro: "",
  });

  // Datos para registrar el servicio
  const [formData, setFormData] = useState({
    id_servicio: "",
    descripcion: "",
    costo_unitario: "",
    tipo_servicio: "",
    estado: "1", // "Activo",
    fecha_registro: "",
  });

  // Datos para registrar el servicio multa por inasistencia a Asamblea General
  const [formDataMIA, setFormDataMIA] = useState({
    id_socio: "",
    id_puesto: "",
  });

  // Llenar campos con los datos del servicio seleccionado
  useEffect(() => {
    if (servicio) {
      console.log("Servicio obtenido:", servicio);
      setFormData({
        id_servicio: servicio.id_servicio || "",
        descripcion: servicio.descripcion || "",
        costo_unitario: servicio.costo_unitario || "",
        tipo_servicio: servicio.tipo_servicio || "",
        estado: "1", // "Activo",
        fecha_registro: reFormatDate(servicio.fecha_registro) || "",
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

  // Manejar los cambios del formulario
  const manejarCambioPMC = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setFormDataPMC({
      ...formDataPMC,
      [name]: value,
    });
  };

  const limpiarRegistarServicio = () => {
    setFormData({
      id_servicio: "",
      descripcion: "",
      costo_unitario: "",
      tipo_servicio: "",
      estado: "1", // "Activo",
      fecha_registro: "",
    });
  };

  const limpiarRegistrarServicioPMC = () => {
    setFormDataPMC({
      id_servicio: "",
      descripcion: "",
      costo_unitario: "",
      tipo_servicio: "3",
      estado: "1", // "Activo",
      fecha_registro: "",
    });
  };

  const limpiarRegistrarMIA = () => {
    setFormDataMIA({
      id_socio: "",
      id_puesto: "",
    });
  } 

  // Registrar servicio
  const registrarServicio = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    const { id_servicio, ...dataToSend } = formData;

    try {
      const response = await apiClient.post(API_ROUTES.servicios.registrar(), dataToSend);
      if (response.status === 200) {
        const mensaje =
          response.data.messsage || "El servicio se registró correctamente";
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
    // const idServicio = servicio?.id_servicio as string;
    try {

      const response = await apiClient.put(API_ROUTES.servicios.editar(servicio?.id_servicio),dataToSend);
      if (response.status === 200) {
        const mensaje = `Los datos del servicio: "${dataToSend.descripcion}" fueron actualizados con éxito`;
        mostrarAlerta("Actualización exitosa", mensaje, "success");
        onServicioRegistrado();
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

  // Registrar servicio Por Metro Cuadrado
  const registrarServicioPorMetroCua = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);

    const { id_servicio, ...dataToSend } = formDataPMC;

    try {
      const response = await axios.post(
        "https://mercadolasestrellas.online/intranet/public/v1/servicios",
        dataToSend
      );
      if (response.status === 200) {
        const mensaje =
          response.data.messsage || "El servicio se registró";
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

  // Actualizar servicio Por Metro Cuadrado
  const editarServicioPorMetroCua = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // setLoading(true);
    // formData.tipo_servicio = '3';
    // const { ...dataToSend } = formDataPMC;
    // try {
    //   const response = await axios.put(
    //     `https://mercadolasestrellas.online/intranet/public/v1/servicios/${servicio?.id_servicio}`,
    //     dataToSend
    //   );
    //   if (response.status === 200) {
    //     const mensaje = `Los datos del servicio: "${dataToSend.descripcion}" fueron actualizados con éxito`;
    //     mostrarAlerta("Actualización exitosa", mensaje, "success");
    //     limpiarRegistarServicio();
    //     handleCloseModal();
    //   } else {
    //     mostrarAlerta("Error");
    //   }
    // } catch (error) {
    //   manejarError(error);
    // } finally {
    //   setLoading(false);
    // }
  };

  // Registrar servicio multa por inasistencia a Asamblea General
  const registrarServicioMIA = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const { ...dataToSend } = formDataMIA;

    try {
      const response = await axios.post("https://mercadolasestrellas.online/intranet/public/v1/servicios/multa-por-inasistencia", dataToSend);
      if (response.status === 200) {
        const mensaje = response.data.message || "La multa se registró correctamente";
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

  // Cerrar modal
  const handleCloseModal = () => {
    limpiarRegistrarMIA();
    limpiarRegistarServicio();
    limpiarRegistrarServicioPMC();
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
            <AvisoFormulario />

            {/* <pre>{JSON.stringify(formData, null, 2)}</pre> */}

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <SeparadorBloque nombre="Detalles del servicio" />

                <TxtFormulario
                  type="text"
                  label="Nombre del servicio"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={manejarCambio}
                  icono={<Bolt sx={{ mr: 1, color: "gray" }} />}
                />

                {/* Seleccionar tipo de servicio */}
                <FormControl fullWidth required sx={{ mb: 2 }}>
                  <InputLabel id="tipo-servicio-label">
                    Tipo de servicio
                  </InputLabel>
                  <Select
                    labelId="tipo-servicio-label"
                    label="Tipo de servicio"
                    value={formData.tipo_servicio}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({ ...formData, tipo_servicio: value });
                    }}
                    startAdornment={<Bolt sx={{ mr: 1, color: "gray" }} />}
                  >
                    <MenuItem value="1">Ordinario (Pagos Fijos)</MenuItem>
                    <MenuItem value="2">Extraordinario (Pagos Extras)</MenuItem>
                  </Select>
                </FormControl>

                {/* Ingresar costo unitario */}
                <TxtFormulario
                  type="text"
                  label="Costo unitario"
                  name="costo_unitario"
                  value={formData.costo_unitario}
                  onChange={manejarCambio}
                  icono={<Typography sx={{ ml: 0.5, mr: 1.5, fontWeight: "600", color: "gray" }}>S/</Typography>}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <SeparadorBloque nombre="Información de registro" />

                {/* Ingresar fecha de registro */}
                <TxtFormulario
                  type="date"
                  label="Fecha de registro"
                  name="fecha_registro"
                  value={formData.fecha_registro}
                  onChange={manejarCambio}
                  icono={<Event sx={{ mr: 1, color: "gray" }} />}
                />
              </Grid>
            </Grid>
          </>
        );
      case 1:
        return (
          <>
            <Typography
              sx={{
                mt: 1,
                mb: 2,
                color: "#333",
                textAlign: "center",
                fontSize: "12px",
                p: isMobile ? "0px" : "0px 58px",
              }}
            >
              El monto total ingresado en este servicio sera repartido entre el
              área total de todos los puestos que se encuentren activos. (*)
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                {/* Separador */}
                <SeparadorBloque nombre="Detalles del servicio" />

                {/* Ingresar nombre del servicio */}
                <TxtFormulario
                  type="text"
                  label="Nombre del servicio"
                  name="descripcion"
                  value={formDataPMC.descripcion}
                  onChange={manejarCambioPMC}
                  icono={<Bolt sx={{ mr: 1, color: "gray" }} />}
                />

                {/* Ingresar costo total del servicio */}
                <TxtFormulario
                  type="text"
                  label="Costo total"
                  // name="costo_total"
                  name="costo_unitario"
                  // value={costoTotal}
                  value={formDataPMC.costo_unitario}
                  // onChange={(e) => setCostoTotal(e.target.value)}
                  onChange={manejarCambioPMC}
                  noMargin={true}
                  icono={<Typography sx={{ ml: 0.5, mr: 1.5, fontWeight: "600", color: "gray" }}>S/</Typography>}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <SeparadorBloque nombre="Información de registro" />

                {/* Ingresar fecha de registro */}
                <TxtFormulario
                  type="date"
                  label="Fecha de registro"
                  name="fecha_registro"
                  value={formDataPMC.fecha_registro}
                  onChange={manejarCambioPMC}
                  icono={<Event sx={{ mr: 1, color: "gray" }} />}
                />
              </Grid>

              <Grid item xs={12}>

                <SeparadorBloque nombre="Información de los puestos" />

                <Grid container direction="row" spacing={2}>
                  <Grid item xs={12} sm={6}>

                    {/* Nro. Puestos activos */}
                    <TxtFormulario
                      type="text"
                      label="Puestos activos"
                      name="puestos_activos"
                      value={puestosActivos.toString()}
                      onChange={(e) => setPuestosActivos(parseInt(e.target.value))}
                      icono={<Storefront sx={{ mr: 1, color: "gray" }} />}
                    />

                    {/* Costo por metro cuadrado */}
                    <TxtFormulario
                      type="text"
                      label="Costo por metro cuadrado"
                      name="costo_metro_cuadrado"
                      value={costoMetroCuadrado.toString()}
                      onChange={(e) => setCostoMetroCuadrado(parseFloat(e.target.value))}
                      icono={<Typography sx={{ ml: 0.5, mr: 1.5, fontWeight: "600", color: "gray" }}>S/</Typography>}
                    />

                  </Grid>

                  <Grid item xs={12} sm={6}>
                    {/* Area total */}
                    <TxtFormulario
                      type="text"
                      label="Área total"
                      name="area_total"
                      value={areaTotal.toString()}
                      onChange={(e) => setAreaTotal(parseFloat(e.target.value))}
                      icono={<Straighten sx={{ mr: 1, color: "gray" }} />}
                    />

                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </>
        );
      case 2:
        return (
          <>
            <AvisoFormulario />
            {/* <pre>{JSON.stringify(formDataMIA, null, 2)}</pre> */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <SeparadorBloque nombre="Seleccionar socio"/>
                <FormControl sx={{ width: "100%" }}>
                  <Autocomplete
                    options={socios}
                    getOptionLabel={(socio: Socio) => socio.nombre_completo}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        const socioId = String(newValue.id_socio); // Convertimos id_socio a string
                        // setIdSocioSeleccionado(socioId); // Asignamos el string
                        setFormDataMIA({
                          ...formDataMIA,
                          id_socio: socioId
                        }); // Mantenemos el string en formData
                        fetchPuestos(socioId); // Pasamos el id_socio como string
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Seleccionar Socio"
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <>
                              <Business sx={{ mr: 1, color: "gray" }} />
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
                    } // Convertimos value a número para la comparación
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <SeparadorBloque nombre="Seleccionar puesto"/>
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
                      // setIdPuestoSeleccionado(value);
                      setFormDataMIA({
                        ...formDataMIA,
                        id_puesto: value
                      });
                    }}
                    startAdornment={<Business sx={{ mr: 1, color: "gray" }} />}
                  >
                    {puestos.map((puesto: Puesto) => (
                      <MenuItem key={puesto.id_puesto} value={puesto.id_puesto}>
                        {puesto.numero_puesto}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </>
        );
      default:
        return <Typography>Seleccione una pestaña</Typography>;
    }
  };

  return (
    <ContenedorModal
      ancho="720px"
      alto="720px"
      abrir={open}
      cerrar={handleCloseModal}
      loading={loading}
      titulo={servicio ? "Editar servicio" : "Registrar servicio"}
      activeTab={servicio ? 0 : activeTab}
      handleTabChange={servicio ? (e) => handleTabChange(e, 0) : handleTabChange}
      tabs={["Registrar servicio", "Registrar servicio compartido", "Multa por inasistencia a Asamblea General"]}
      botones={
        <BotonesModal
          loading={loading}
          action={async (e) => {
            let result;

            // Caso cuando activeTab es 0
            if (activeTab === 0) {
              result = await mostrarAlertaConfirmacion(
                "¿Está seguro de registrar un nuevo servicio?"
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
                "¿Está seguro de realizar otra acción para el servicio?"
              );
              if (result.isConfirmed) {
                // registrarServicioCompartido(e); }
                if (servicio) {
                  editarServicioPorMetroCua(e);
                } else {
                  registrarServicioPorMetroCua(e);
                }
              }
            }

            if (activeTab === 2) {
              result = await mostrarAlertaConfirmacion(
                "¿Está seguro de registrar una multa por inasistencia a Asamblea General?"
              );
              if (result.isConfirmed) {
                registrarServicioMIA(e);
              }
            }

          }}
          close={handleCloseModal}
        />
      }
    >
      {renderTabContent()}
    </ContenedorModal>
  );
};

export default RegistrarServicio;
