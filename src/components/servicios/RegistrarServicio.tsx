import {
  Bolt,
  Business,
  Event,
  Storefront,
  Straighten,
} from "@mui/icons-material";
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
  Typography,
} from "@mui/material";
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
import apiClient from "../../Utils/apliClient";
import { API_ROUTES } from "../../service/ServicioApi";
import { SocioSelect } from "../../interface/Socios";
import { AgregarProps } from "../../interface/Servicios";
import { PuestoSelect } from "../../interface/Puestos";

const RegistrarServicio: React.FC<AgregarProps> = ({
  open,
  handleClose,
  servicio,
}) => {
  const { isMobile } = useResponsive();
  const [loading, setLoading] = useState(false); 
  const [activeTab, setActiveTab] = useState(0);
  const [costoMetroCuadrado, setCostoMetroCuadrado] = useState(0);
  const [totalPuestos, setTotalPuestos] = useState(0);
  const [areaTotal, setAreaTotal] = useState(0);
  const [socios, setSocios] = useState<SocioSelect[]>([]);
  const [puestos, setPuestos] = useState<PuestoSelect[]>([]);
  const [editarMIA, setEditarMIA] = useState(true);

  // Obtener Lista Socios
  useEffect(() => {
    const fetchSocios = async () => {
      try {
        const response = await apiClient.get(API_ROUTES.socios.listar());
        setSocios(response.data.data);
      } catch (error) {
        console.error("Error al obtener los socios", error);
      }
    };
    fetchSocios();
  }, []);

  // Obtener Lista Puestos
  const fetchPuestosSocio = async (idSocio: number) => {
    try {
      const response = await apiClient.get(API_ROUTES.puestos.listarPorSocio(idSocio));
      setPuestos(response.data.data);
    } catch (error) {
      console.error("Error al obtener los puestos", error);
    }
  };

  // Obtener la cantidad total de puestos
  useEffect(() => {
    const fetchTotalPuestos = async () => {
      try {
        const response = await apiClient.get(API_ROUTES.puestos.totalPuestos());
        setTotalPuestos(response.data.data);
      } catch (error) {
        console.error("Error al obtener el area total", error);
      }
    };
    fetchTotalPuestos();
  }, []);

  // Obtener el area total de los puestos
  useEffect(() => {
    const fetchAreaTotal = async () => {
      try {
        const response = await apiClient.get(API_ROUTES.puestos.areaTotal());
        const data = response.data.data;
        setAreaTotal(data);
      } catch (error) {
        console.error("Error al obtener el area total", error);
      }
    };
    fetchAreaTotal();
  }, []);

  // Datos para registrar el servicio Por Metro Cuadrado
  const [formDataPMC, setFormDataPMC] = useState({
    id_servicio: "",
    nombre: "",
    costo_unitario: "",
    tipo_servicio: "3",
    fecha_registro: "",
  });

  // Datos para registrar el servicio
  const [formData, setFormData] = useState({
    id_servicio: "",
    nombre: "",
    costo_unitario: "",
    tipo_servicio: "",
    fecha_registro: "",
  });

  // Datos para registrar el servicio multa por inasistencia a Asamblea General
  const [formDataMIA, setFormDataMIA] = useState({
    id_socio: 0,
    id_puesto: "",
    importe: "",
  });

  // Obtener el importe de la multa por inasistencia a Asamblea General
  useEffect(() => {
    const fetchImpMIA = async () => {
      try {
        const response = await apiClient.get(API_ROUTES.multaInasistencia.importe());
        const data = response.data.data.importe;
        setFormDataMIA({
          ...formDataMIA,
          importe: data.toString()
        });
      } catch (error) {
        console.error("Error al obtener el importe de la multa", error);
      }
    }
    fetchImpMIA();
  }, [open]);

  useEffect(() => {
    const obtenerCostoPorMetroCuadrado = () => {
      if (!formDataPMC.costo_unitario) {
        setCostoMetroCuadrado(0);
        return;
      } 
      const costoTotal = parseFloat(formDataPMC.costo_unitario);
      const costoMetroCuadrado = costoTotal / areaTotal;
      setCostoMetroCuadrado(costoMetroCuadrado);
    }
    obtenerCostoPorMetroCuadrado();
  }, [formDataPMC.costo_unitario, areaTotal]);

  // Llenar campos con los datos del servicio seleccionado
  useEffect(() => {
    if (servicio) {
      if (parseInt(servicio.tipo_servicio) === 3) {
        setActiveTab(1);
        setFormDataPMC({
          id_servicio: servicio.id_servicio || "",
          nombre: servicio.nombre || "",
          costo_unitario: (parseFloat(servicio.costo_unitario) * areaTotal).toString() || "",
          tipo_servicio: servicio.tipo_servicio || "",
          fecha_registro: reFormatDate(servicio.fecha_registro) || "",
        });
      } else {
        setActiveTab(0);
        setFormData({
          id_servicio: servicio.id_servicio || "",
          nombre: servicio.nombre || "",
          costo_unitario: servicio.costo_unitario || "",
          tipo_servicio: servicio.tipo_servicio || "",
          fecha_registro: reFormatDate(servicio.fecha_registro) || "",
        });
      }
    }
  }, [servicio, areaTotal]);

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
      nombre: "",
      costo_unitario: "",
      tipo_servicio: "",
      fecha_registro: "",
    });
  };

  const limpiarRegistrarServicioPMC = () => {
    setFormDataPMC({
      id_servicio: "",
      nombre: "",
      costo_unitario: "",
      tipo_servicio: "3",
      fecha_registro: "",
    });
    setCostoMetroCuadrado(0);
  };

  const limpiarRegistrarMIA = () => {
    setFormDataMIA({
      id_socio: 0,
      id_puesto: "",
      importe: "",
    });
    setEditarMIA(true);
  } 

  // Registrar servicio
  const registrarServicio = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    const { id_servicio, ...dataToSend } = formData;

    try {
      const response = await apiClient.post(API_ROUTES.servicios.registrar(), dataToSend);
      if (response.status === 200) {
        const mensaje =response.data.messsage || "El servicio se registró correctamente";
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

  // Actualizar servicio
  const editarServicio = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    const { ...dataToSend } = formData;
  
    try {

      const response = await apiClient.put(API_ROUTES.servicios.editar(servicio?.id_servicio),dataToSend);
      if (response.status === 200) {
        mostrarAlerta(response.data.message);
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
  const registrarServicioPMC = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);

    const { id_servicio, ...dataToSend } = formDataPMC;

    try {
      const response = await apiClient.post(API_ROUTES.servicios.registrar(), dataToSend)
      if (response.status === 200) {
        const mensaje =
          response.data.messsage || "El servicio se registró";
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

  // Actualizar servicio Por Metro Cuadrado
  const editarServicioPMC = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    const { ...dataToSend } = formDataPMC;
  
    try {

      const response = await apiClient.put(API_ROUTES.servicios.editar(servicio?.id_servicio),dataToSend);
      if (response.status === 200) {
        const mensaje = `Los datos del servicio: "${dataToSend.nombre}" fueron actualizados con éxito`;
        mostrarAlerta("Actualización exitosa", mensaje, "success");
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

  // Registrar servicio multa por inasistencia a Asamblea General
  const registrarServicioMIA = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const { ...dataToSend } = formDataMIA;

    try {
      const response = await apiClient.post(API_ROUTES.multaInasistencia.registrar(), dataToSend);
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
                  name="nombre"
                  value={formData.nombre}
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

            {/* <pre>{JSON.stringify(formDataPMC, null, 2)}</pre> */}

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                {/* Separador */}
                <SeparadorBloque nombre="Detalles del servicio" />

                {/* Ingresar nombre del servicio */}
                <TxtFormulario
                  type="text"
                  label="Nombre del servicio"
                  name="nombre"
                  value={formDataPMC.nombre}
                  onChange={manejarCambioPMC}
                  icono={<Bolt sx={{ mr: 1, color: "gray" }} />}
                />

                {/* Ingresar costo total del servicio */}
                <TxtFormulario
                  type="text"
                  label="Costo total"
                  name="costo_unitario"
                  value={formDataPMC.costo_unitario}
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
                      label="Total de Puestos"
                      name="total_puestos"
                      value={totalPuestos.toString()}
                      onChange={(e) => setTotalPuestos(parseInt(e.target.value))}
                      icono={<Storefront sx={{ mr: 1, color: "gray" }} />}
                    />

                    {/* Costo por metro cuadrado */}
                    <TxtFormulario
                      type="text"
                      label="Costo por metro cuadrado"
                      name="costo_metro_cuadrado"
                      value={costoMetroCuadrado.toFixed(2).toString()}
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
                    getOptionLabel={(socio: SocioSelect) => socio.nombre_completo}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        const idSocio = newValue.id_socio; // Convertimos id_socio a string
                        setFormDataMIA({
                          ...formDataMIA,
                          id_socio: idSocio
                        }); // Mantenemos el string en formData
                        fetchPuestosSocio(idSocio); // Pasamos el id_socio como string
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
                      setFormDataMIA({
                        ...formDataMIA,
                        id_puesto: value
                      });
                    }}
                    startAdornment={<Business sx={{ mr: 1, color: "gray" }} />}
                  >
                    {puestos.map((puesto: PuestoSelect) => (
                      <MenuItem key={puesto.id_puesto} value={puesto.id_puesto}>
                        {puesto.numero_puesto}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  disabled={editarMIA}
                  name="importe"
                  label="Importe"
                  value={formDataMIA.importe}
                  onChange={(e) => {
                    setFormDataMIA({
                      ...formDataMIA,
                      importe: e.target.value
                    });
                  }}
                  InputProps={{
                    startAdornment: <Typography sx={{ ml: 0.5, mr: 1.5, fontWeight: "600", color: "gray" }}>S/</Typography>
                  }}
                  sx={{ width: "48.5%", mr: "3%" }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setEditarMIA(!editarMIA);
                  }}
                  sx={{ width: "48.5%", height: "55px" }}
                >
                  Editar importe
                </Button>
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
      activeTab={activeTab}
      handleTabChange={servicio ? (e) => handleTabChange(e, (parseInt(servicio.tipo_servicio) === 3) ? 1 : 0) : handleTabChange}
      tabs={["Registrar servicio", "Registrar servicio compartido", "Multa por inasistencia a Asamblea General"]}
      botones={
        <BotonesModal
          loading={loading}
          obj={servicio}
          action={async (e) => {
            let result;

            if (activeTab === 0) {
              result = await mostrarAlertaConfirmacion("¿Está seguro de registrar un nuevo servicio?");
              if (result.isConfirmed) {
                if (servicio) {
                  editarServicio(e);
                } else {
                  registrarServicio(e);
                }
              }
            }

            if (activeTab === 1) {
              result = await mostrarAlertaConfirmacion("¿Está seguro de registrar un nuevo servicio compartido?");
              if (result.isConfirmed) {
                if (servicio) {
                  editarServicioPMC(e);
                } else {
                  registrarServicioPMC(e);
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
