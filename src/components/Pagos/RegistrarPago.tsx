import { Business } from "@mui/icons-material";
import {
  Box,
  Typography,
  Grid,
  TextField,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Autocomplete,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import useResponsive from "../../hooks/Responsive/useResponsive";
import {
  manejarError,
  mostrarAlerta,
  mostrarAlertaConfirmacion,
} from "../Alerts/Registrar";
import jsPDF from "jspdf";
import BotonesModal from "../Shared/BotonesModal";
import ContenedorModal from "../Shared/ContenedorModal";
import { AvisoFormulario } from "../Shared/ElementosFormulario";
import { formatDate, nombreMes } from "../../Utils/dateUtils";
import { AgregarProps, Column, Data, Deuda, Puesto, Socio } from "../../interface/Pagos/RegistrarPagos";
import { Api_Global_Pagos } from "../../service/PagoApi";
import apiClient from "../../Utils/apliClient";

const columns: readonly Column[] = [
  { id: "anio", label: "Año", minWidth: 50, align: "center" },
  { id: "mes", label: "Mes", minWidth: 50, align: "center" },
  { id: "servicio_descripcion", label: "Servicio", minWidth: 50, align: "center" },
  { id: "total", label: "Total (S/)", minWidth: 50, align: "center" },
  { id: "a_cuenta", label: "A cuenta (S/)", minWidth: 50, align: "center" },
  { id: "pago", label: "Pago (S/)", minWidth: 50, align: "center" },
  { id: "accion", label: "", minWidth: 30, align: "center" },
];

const RegistrarPago: React.FC<AgregarProps> = ({ open, handleClose }) => {
  const { isMobile } = useResponsive();
  const [socios, setSocios] = useState<Socio[]>([]);
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [idSocioSeleccionado, setIdSocioSeleccionado] = useState("");
  const [idPuestoSeleccionado, setIdPuestoSeleccionado] = useState("");
  const [deudas, setDeudas] = useState<Data[]>([]);
  const [filasSeleccionadas, setFilasSeleccionadas] = useState<({ [key: string]: boolean; })>({});
  const [montoPagar, setMontoPagar] = useState<{ [key: number]: number }>({});
  const [totalPagar, setTotalPagar] = useState(0);
  const [totalDeuda, setTotalDeuda] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false); 

  // Para registrar el pago
  const [formData, setFormData] = useState({
    id_socio: "",
    nombre_socio: "",
    nombre_block: "",
    numero_puesto: "",
    deudas: [{
      id_deuda: 0,
      importe: 0,
      servicio: "",
    }]
  });

  // Obtener Lista Socios
  useEffect(() => {
    const fetchSocios = async () => {
      try {
        const response = await apiClient.get(Api_Global_Pagos.socios.listar());
        const data = response.data.data.map((item: Socio) => ({
          id_socio: item.id_socio,
          nombre_completo: item.nombre_completo,
        }));
        setSocios(data);
      } catch (error) {
      }
    };
  
    fetchSocios();
  }, []);

  // Obtener Lista Puestos
  const fetchPuestos = async (idSocio: string) => {
    try {
      const response = await apiClient.get(Api_Global_Pagos.puestos.listarPorSocio(idSocio));
      const data = response.data.data.map((item: Puesto) => ({
        id_puesto: item.id_puesto,
        numero_puesto: item.numero_puesto,
        block: {
          nombre: item.block.nombre,
        },
      }));
      setPuestos(data);
    } catch (error) {
    }
  };

  // Obtener deuda cuota por puesto
  const fetchDeudaPuesto = async (idSocio: string, idPuesto: string) => {
    try {
      const response = await apiClient.get(
        Api_Global_Pagos.cuotas.pendientesPorPuesto(idSocio, idPuesto)
      );
      const data = response.data.data.map((item: Deuda) => ({
        id_deuda: item.id_deuda,
        total: item.por_pagar, // item.total,
        servicio_descripcion: item.nombre_servicio,
        anio: item.anio,
        mes: item.mes,
        a_cuenta: item.a_cuenta,
        deuda: item.deuda,
      }));
      setDeudas(data);
    } catch (error) {
      console.error("Error al obtener las deudas", error);
    }
  };


  // Calcular el total de la deuda de las filas seleccionadas
  const calcularTotalDeudaSeleccionado = () => {
    let total = 0;
    Object.keys(filasSeleccionadas).forEach((id_deuda) => {
      if (filasSeleccionadas[id_deuda]) {
        const fila = deudas.find(
          (deuda) => deuda.id_deuda === parseInt(id_deuda)
        );
        if (fila) {
          total += parseFloat(fila.deuda);
        }
      }
    });
    setTotalDeuda(total);
  };

  // Calcular el total a pagar de las filas seleccionadas
  const calcularTotalSeleccionado = () => {
    let total = 0;
    Object.keys(filasSeleccionadas).forEach((id_deuda) => {
      if (filasSeleccionadas[id_deuda]) {
        // Obtener el elemento del TextField que corresponde a esta deuda
        const inputElement = document.getElementById(
          `pago-${id_deuda}`
        ) as HTMLInputElement;
        // Si el elemento existe, tomar su valor actual
        if (inputElement) {
          const montoActual = parseFloat(inputElement.value) || 0;
          total += montoActual;
        }
      }
    });
    setTotalPagar(total);
  };

  useEffect(() => {
    calcularTotalDeudaSeleccionado();
    calcularTotalSeleccionado();
  }, [filasSeleccionadas]);

  // Manejar las filas seleccionadas
  const handleCheckBoxChange = (
    seleccionado: boolean,
    idDeuda: number,
    servicioDescripcion: string,
    montoPagar: number,
    montoInicial: number
  ) => {
    // Manejamos las filas seleccionadas
    setFilasSeleccionadas((estadoPrevio) => ({
      ...estadoPrevio,
      [idDeuda]: seleccionado,
    }));

    if (seleccionado) {
      // Para almacenar el arreglo de deudas en el formulario
      setFormData((prevFormData) => ({
        ...prevFormData,
        deudas: [
          // Evitamos que las deudas se repitan
          ...prevFormData.deudas.filter((deuda) => deuda.id_deuda !== idDeuda),
          // Agregamos la nuevas deudas y su monto a pagar
          { id_deuda: idDeuda, importe: montoPagar, servicio: servicioDescripcion },
        ],
      }));
    } else {
      // Al deseleccionar, eliminamos la deuda correspondiente
      setFormData((prevFormData) => ({
        ...prevFormData,
        deudas: prevFormData.deudas.filter(
          (deuda) => deuda.id_deuda !== idDeuda
        ),
      }));

      setMontoPagar((prevMonto) => {
        const nuevoMonto = { ...prevMonto };
        delete nuevoMonto[idDeuda];
        return nuevoMonto;
      });
    }

    // Eliminamos el valor por defecto
    setFormData((prevFormData) => ({
      ...prevFormData,
      deudas: prevFormData.deudas.filter(
        (deuda) => deuda.id_deuda !== 0 && deuda.importe !== 0
      ),
    }));

    calcularTotalSeleccionado();
  };

  // Actualizar el monto a pagar de cada cuota
  const actualizarMontoPagar = (
    idDeuda: number,
    nuevoMonto: number,
    montoInicial: number
  ) => {
    // Validamos que el monto no sea mayor al inicial
    const validarMonto = Math.min(nuevoMonto, montoInicial);

    setMontoPagar((prevMonto) => ({
      ...prevMonto,
      // Actualizamos el monto para la deuda seleccionada
      [idDeuda]: validarMonto,
    }));

    // Actualizamos los valores
    setFormData((prevFormData) => ({
      ...prevFormData,
      deudas: prevFormData.deudas.map(
        (deuda) =>
          deuda.id_deuda === idDeuda
            ? { ...deuda, importe: validarMonto } // Actualizar el importe
            : deuda // Mantener la deuda sin cambios
      ),
    }));

    calcularTotalSeleccionado();
  };

  // Limpiar modal
  const limpiarCampos = () => {
    // Reiniciamos los select
    setIdSocioSeleccionado("");
    setIdPuestoSeleccionado("");

    // Reiniciar las filas seleccionadas
    setFilasSeleccionadas({});

    // Limpiar formulario
    setFormData({
      id_socio: "",
      nombre_socio: "",
      nombre_block: "",
      numero_puesto: "",
      deudas: [
        {
          id_deuda: 0,
          importe: 0,
          servicio: "",
        },
      ],
    });

    // Limpiar la tabla
    setDeudas([]);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setMontoPagar({});
    handleClose();
    limpiarCampos();
  };

  // REGISTRAR PAGO
  const registrarPago = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);

    // Extraemos los datos necesarios para enviar
    const { nombre_socio, nombre_block, numero_puesto, deudas, ...rest } = formData;
    const filteredDeudas = deudas.map(({ servicio, ...deudaRest }) => deudaRest); // Filtramos el servicio de las deudas
    // console.log(deudas);
    // console.log(formData);
    const dataToSend: { 
      id_socio: string;
      deudas: { id_deuda: number; importe: number; }[] // Solo enviamos el id_deuda y el importe
    } = { ...rest, deudas: filteredDeudas }; // Retornamos el id_socio y las deudas sin el servicio

    try {
      const response = await axios.post(
        "https://mercadolasestrellas.online/intranet/public/v1/pagos",
        dataToSend
      );

      if (response.status === 200) {
        const mensaje = response.data.message || "El pago fue registrado correctamente";
        generarTicketPDF(formData, response.data.data);
        mostrarAlerta("Registro exitoso", mensaje, "success").then(() => {
          handleCloseModal();
        });
      } else {
        mostrarAlerta("Error", "Ocurrió un error inesperado.", "error");
      }
    } catch (error) {
      manejarError(error);
    } finally {
      setLoading(false);
    }
  };

  const generarTicketPDF = async (data: typeof formData, pago: any) => {
    const ticket = new jsPDF();
    const pageWidth = ticket.internal.pageSize.getWidth(); // Ancho de la página

    const response = await fetch("/logoBase64.txt");
    const imagenLogo = await response.text();

    const centerText = (text: string, y: number) => {
      const textWidth = ticket.getTextWidth(text);
      const x = (pageWidth - textWidth) / 2 + 20;
      ticket.text(text, x, y);
    };

    const rightText = (text: string, y: number) => {
      const textWidth = ticket.getTextWidth(text);
      const x = pageWidth - textWidth - 20;
      ticket.text(text, x, y);
    };

    const textoMezclado = (textoNegrita: string, textoNormal: string, x: number, y: number, ticket: jsPDF) => {
      const textoNegritaWidth = ticket.getTextWidth(textoNegrita);
      ticket.setFont("helvetica", "bold");
      ticket.text(textoNegrita, x, y);
      ticket.setFont("helvetica", "normal");
      ticket.text(textoNormal, x + textoNegritaWidth, y);
    };

    ticket.setFontSize(12);
    ticket.setFont("helvetica", "bold");

    ticket.addImage(imagenLogo, "JPEG", 20, 10, 30, 30);
    centerText("Asociación comercial de Propietarios del Mercado", 18);
    centerText('"Nstra. Sra.de Las Estrellas"', 25);

    ticket.setFontSize(10);
    centerText('Fundado el 07 de Abril de 1977 Inscrito en la Sunarp Partida N°11012575.', 32);
    centerText('Calle 9 Asociación de Viv. "Hijos de Apurimac Primera Etapa - Santa Clara - Ate', 36);

    textoMezclado("N° Recibo: ", pago.numero_pago, 20, 50, ticket);
    textoMezclado("Socio:  ", data.nombre_socio, 20, 60, ticket);
    textoMezclado("Nombre de banco:  ", "", 20, 70, ticket);
    textoMezclado("Numero de operación:  ", "", 20, 80, ticket);

    const posTextoCompleto = pageWidth - ticket.getTextWidth(`Block:  ${data.nombre_block} - Puesto:  ${data.numero_puesto}`) - 20;
    const anchoPuesto = ticket.getTextWidth(`Puesto:  ${data.numero_puesto}`);
    textoMezclado('Block:  ', `${data.nombre_block} - `, posTextoCompleto, 60, ticket);
    textoMezclado('Puesto:  ', data.numero_puesto, pageWidth - anchoPuesto - 20, 60, ticket);

    const fechaHora = new Date().toLocaleString();

    const anchoFechaHora = ticket.getTextWidth(`Fecha y hora:  ${fechaHora.toString()}`);
    textoMezclado('Fecha y Hora:  ', fechaHora.toString(), pageWidth - anchoFechaHora - 20, 70, ticket);

    ticket.setFont("helvetica", "bold");

    ticket.text("DESCRIPCIÓN", 30, 100);
    rightText("IMPORTE", 100);

    let y = 110;

    data.deudas.forEach((deuda, index) => {

      ticket.text(`#${index + 1}`, 20, y);
      ticket.text(`${deuda.servicio}`, 30, y);
      rightText(`S/${deuda.importe.toFixed(2)}`, y);

      y += 5; // Espaciado entre las deudas

      // Dibujar una línea semi visible de separación
      ticket.setDrawColor(200, 200, 200); // Color gris claro
      ticket.line(20, y, pageWidth - 20, y);

      y += 8; // Espaciado adicional después de la línea

    });

    rightText(`Total a pagar: S/${totalPagar.toFixed(2)}`, y + 10);

    const date = new Date();
    const mes = date.getMonth();
    const dia = date.getDate();
    const año = date.getFullYear();

    rightText(`Lima, ${dia} de ${nombreMes(mes)} del ${año}`, y + 30);

    // Generar el PDF
    const pdfBlob = ticket.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const ticketLink = document.createElement('a');

    const fecha = formatDate(date.toString())

    ticketLink.href = pdfUrl;
    ticketLink.target = "_blank"; // Abrir en una nueva pestaña
    ticketLink.click();

    ticketLink.download = `Recibo-Pago-${data.nombre_socio}-${fecha}.pdf`; // Nombre personalizado
    ticketLink.click();

    // Limpiar la URL temporal después de abrirla
    URL.revokeObjectURL(pdfUrl);
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
              <Grid item xs={12} sm={12} marginTop={1}
                display="flex" flexDirection={isMobile ? "column" : "row"} gap={1}>
                {/* Seleccionar socio */}
                <FormControl
                  sx={{
                    width: isMobile ? "100%" : "50%",
                    mb: isMobile ? "15px" : "0px",
                  }}
                >
                  <Autocomplete
                    options={socios}
                    getOptionLabel={(socio: Socio) => socio.nombre_completo}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        const socioId = String(newValue.id_socio); // Convertimos id_socio a string
                        setIdSocioSeleccionado(socioId); // Asignamos el string
                        setFormData({
                          ...formData,
                          id_socio: socioId,
                          nombre_socio: newValue.nombre_completo,
                        }); // Mantenemos el string en formData
                        fetchPuestos(socioId); // Pasamos el id_socio como string
                        setIdPuestoSeleccionado(""); // Limpiamos el puesto seleccionado
                        setDeudas([]); // Limpiamos las deudas
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

                {/* Seleccionar puesto */}
                <FormControl
                  sx={{ width: isMobile ? "100%" : "50%" }}
                >
                  <InputLabel id="seleccionar-puesto-label">
                    Seleccionar Puesto
                  </InputLabel>
                  <Select
                    labelId="seleccionar-puesto-label"
                    label="Seleccionar Puesto"
                    id="select-puesto"
                    value={idPuestoSeleccionado}
                    onChange={(e) => {
                      const value = e.target.value;
                      setIdPuestoSeleccionado(value);
                      setFormData({
                        ...formData,
                        numero_puesto:
                          puestos.find((p) => p.id_puesto === Number(value))
                            ?.numero_puesto || "",
                        nombre_block:
                          puestos.find((p) => p.id_puesto === Number(value))
                            ?.block.nombre || "",
                      });
                      fetchDeudaPuesto(idSocioSeleccionado, value);
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

              {/* Tabla deudas */}
              <Grid item xs={12} sm={12}>
                <Paper
                  sx={{
                    width: "100%",
                    overflow: "hidden",
                    boxShadow: "none",
                  }}
                >
                  <TableContainer
                    sx={{
                      height: "250px",
                      borderRadius: "10px",
                      border: "1px solid #202123",
                    }}
                  >
                    <Table>
                      <TableHead sx={{ backgroundColor: "#202123" }}>
                        <TableRow>
                          {columns.map((column) => (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{ minWidth: column.minWidth }}
                              sx={{ color: "white" }}
                            >
                              {column.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {deudas.map((deuda) => {
                          // Calculamos el monto a pagar
                          // console.log('deuda: ', deuda);
                          // const montoInicial = parseFloat(deuda.deuda);
                          const montoInicial = parseFloat(deuda.total) - parseFloat(deuda.a_cuenta);
                          const seleccionado =
                            filasSeleccionadas[deuda.id_deuda] || false;

                          // Si el monto a pagar se a cambiado, usamos el nuevo monto; si no, usamos el monto inicial
                          const nuevoMonto =
                            montoPagar[deuda.id_deuda] !== undefined
                              ? montoPagar[deuda.id_deuda]
                              : montoInicial;

                          return (
                            <TableRow hover tabIndex={-1} key={deuda.id_deuda}>
                              {columns.map((column) => {
                                let value =
                                  column.id === "accion"
                                    ? ""
                                    : (deuda as any)[column.id];

                                if (column.id === "pago") {
                                  value = nuevoMonto;
                                }

                                return (
                                  <TableCell
                                    key={column.id}
                                    align="center"
                                    padding="checkbox"
                                  >
                                    {column.id === "accion" ? (
                                      <Box
                                        sx={{
                                          display: "flex",
                                          gap: 1,
                                          justifyContent: "center",
                                        }}
                                      >
                                        <IconButton
                                          aria-label="select_row"
                                          sx={{ color: "#840202" }}
                                        >
                                          <Checkbox
                                            checked={seleccionado}
                                            onChange={(e) =>
                                              handleCheckBoxChange(
                                                e.target.checked,
                                                deuda.id_deuda,
                                                deuda.servicio_descripcion,
                                                montoInicial,
                                                montoInicial
                                              )
                                            }
                                          />
                                        </IconButton>
                                      </Box>
                                    ) : column.id === "pago" ? (
                                      <TextField
                                        id={`pago-${deuda.id_deuda}`}
                                        type="number"
                                        name="pago"
                                        value={nuevoMonto}
                                        onChange={(e) => {
                                          const value =
                                            parseFloat(e.target.value) || 0;
                                          actualizarMontoPagar(
                                            deuda.id_deuda,
                                            value,
                                            montoInicial
                                          );
                                          calcularTotalSeleccionado();
                                        }}
                                        InputProps={{
                                          // Si no esta seleccionado no se puede editar el monto a pagar
                                          readOnly: !seleccionado,
                                        }}
                                        sx={{
                                          width: "100px",
                                        }}
                                      />
                                    ) : (
                                      value
                                    )}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>

              {/* Monto a pagar */}
              <Box
                sx={{
                  m: "25px 0 0 auto",
                  pl: isMobile ? "16px" : "0px",
                }}
              >
                <TextField
                  label="Total deuda"
                  value={totalDeuda}
                  focused
                  InputProps={{
                    readOnly: true,
                    startAdornment: <Typography sx={{ mr: 1 }}>S/</Typography>,
                  }}
                  sx={{
                    mr: 2,
                    mb: isMobile ? "15px" : "0px",
                    width: isMobile ? "100%" : "200px",
                  }}
                />
                <TextField
                  color="success"
                  label="Monto a pagar"
                  value={totalPagar}
                  focused
                  InputProps={{
                    readOnly: true,
                    startAdornment: <Typography sx={{ mr: 1 }}>S/</Typography>,
                  }}
                  sx={{
                    width: isMobile ? "100%" : "200px",
                  }}
                />
              </Box>
            </Grid>
          </>
        );
      default:
        return "";
    }
  };

  return (
    <ContenedorModal
      ancho="1000px"
      alto="auto"
      abrir={open}
      cerrar={handleCloseModal}
      loading={loading}
      titulo="Registrar Pago"
      botones={
        <BotonesModal
          loading={loading}
          action={async (e) => {
            const result = await mostrarAlertaConfirmacion(
              "¿Está seguro de registrar este pago?"
            );
            if (result.isConfirmed) {
              registrarPago(e);
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

export default RegistrarPago;
