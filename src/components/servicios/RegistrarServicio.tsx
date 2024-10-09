import {
  AttachMoney,
  Bolt,
  Event,
  Storefront,
  Straighten,
} from "@mui/icons-material";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
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

interface AgregarProps {
  open: boolean;
  handleClose: () => void;
  servicio: Editarservicio | null;
}

interface Editarservicio {
  id_servicio: string;
  descripcion: string;
  costo_unitario: string;
  tipo_servicio: string;
  fecha_registro: string;
}

const RegistrarServicio: React.FC<AgregarProps> = ({
  open,
  handleClose,
  servicio,
}) => {
  // Variables para el diseño responsivo
  const { isMobile } = useResponsive();
  const [loading, setLoading] = useState(false); // Estado de loading

  const [activeTab, setActiveTab] = useState(0);

  const [costoTotal, setCostoTotal] = useState("");
  const [costoMetroCuadrado, setCostoMetroCuadrado] = useState(0);
  const [puestosActivos, setPuestosActivos] = useState(0);
  const [areaTotal, setAreaTotal] = useState(0);

  // Datos para registrar el servicio
  const [formData, setFormData] = useState({
    id_servicio: "",
    descripcion: "",
    costo_unitario: "",
    tipo_servicio: "",
    estado: "Activo",
    fecha_registro: "",
  });

  const formatDate = (fecha: string) => {
    const [dia, mes, anio] = fecha.split("/");
    return `${anio}-${mes}-${dia}`;
  };

  // Llenar campos con los datos del servicio seleccionado
  useEffect(() => {
    if (servicio) {
      console.log("Servicio obtenido:", servicio);
      setFormData({
        id_servicio: servicio.id_servicio || "",
        descripcion: servicio.descripcion || "",
        costo_unitario: servicio.costo_unitario || "",
        tipo_servicio: servicio.tipo_servicio || "",
        estado: "Activo",
        fecha_registro: formatDate(servicio.fecha_registro) || "",
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

  const limpiarRegistarServicio = () => {
    setFormData({
      id_servicio: "",
      descripcion: "",
      costo_unitario: "",
      tipo_servicio: "",
      estado: "Activo",
      fecha_registro: "",
    });
  };

  // Registrar servicio
  const registrarServicio = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    const { id_servicio, ...dataToSend } = formData;

    try {
      const response = await axios.post(
        "https://mercadolasestrellas.online/intranet/public/v1/servicios",
        dataToSend
      );
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
    try {
      const response = await axios.put(
        `https://mercadolasestrellas.online/intranet/public/v1/servicios/${servicio?.id_servicio}`,
        dataToSend
      );
      if (response.status === 200) {
        const mensaje = `Los datos del servicio: "${dataToSend.descripcion}" fueron actualizados con éxito`;
        mostrarAlerta("Actualización exitosa", mensaje, "success");
        limpiarRegistarServicio();
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
  // Cerrar modal
  const handleCloseModal = () => {
    limpiarRegistarServicio();
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
                  icono={<AttachMoney sx={{ mr: 1, color: "gray" }} />}
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
                  value={formData.descripcion}
                  onChange={manejarCambio}
                  icono={<Bolt sx={{ mr: 1, color: "gray" }} />}
                />

                {/* Ingresar costo total del servicio */}
                <TxtFormulario
                  type="text"
                  label="Costo total"
                  name="costo_total"
                  value={costoTotal}
                  onChange={(e) => setCostoTotal(e.target.value)}
                  noMargin={true}
                  icono={<AttachMoney sx={{ mr: 1, color: "gray" }} />}
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
                      icono={<AttachMoney sx={{ mr: 1, color: "gray" }} />}
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
      handleTabChange={handleTabChange}
      tabs={["Registrar servicio", "Registrar servicio compartido"]}
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
