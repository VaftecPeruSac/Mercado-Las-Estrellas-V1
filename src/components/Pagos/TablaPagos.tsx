import {
  Download,
  FileDownload,
  Search,
  WhatsApp,
} from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import RegistrarPagoTabs from "./RegistrarPagoTabs";
import useResponsive from "../../hooks/Responsive/useResponsive";
import LoadingSpinner from "../PogressBar/ProgressBarV1";
import * as XLSX from 'xlsx';
import Contenedor from "../Shared/Contenedor";
import ContenedorBotones from "../Shared/ContenedorBotones";
import BotonExportar from "../Shared/BotonExportar";
import BotonAgregar from "../Shared/BotonAgregar";
import { formatDate } from "../../Utils/dateUtils";
import { Pagos, Data } from "../../interface/Pagos/Pagos";
import { columns } from "../../Columns/Pagos";
import apiClient from "../../Utils/apliClient";
import { Api_Global_Pagos } from "../../service/PagoApi";
import { handleExport } from "../../Utils/exportUtils";

const TablaPago: React.FC = () => {
  const { isTablet, isMobile, isSmallMobile } = useResponsive();
  const [mostrarDetalles, setMostrarDetalles] = useState<string | null>(null);
  const [pagos, setPagos] = useState<Data[]>([]);
  const [totalPages, setTotalPages] = useState(1); 
  const [paginaActual, setPaginaActual] = useState(1); 
  const [exportFormat, setExportFormat] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    listarPagos(paginaActual);
  }

  const handleExportPagos = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const exportUrl = Api_Global_Pagos.pagos.exportar();
    const fileNamePrefix = "lista-pagos";
    await handleExport(exportUrl, exportFormat, fileNamePrefix, setExportFormat);
  };

  const handleAccionesPago = async (accion: number, telefono: string, pago: Pagos) => {

    const data = [
      ["ID", pago.id_pago],
      ["Serie número", pago.serie_numero],
      ["Puesto", pago.puesto],
      ["Socio", pago.socio],
      ["DNI", pago.dni],
      ["Fecha", pago.fecha_registro],
      ["Teléfono", pago.telefono],
      ["Correo", pago.correo],
      ["A Cuenta", pago.total_pago],
      ["Monto Actual", pago.total_deuda]
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pagos");

    ws['A1'].s = { font: { bold: true } };
    ws['B2'].s = { alignment: { horizontal: 'left' } };
    ws['!cols'] = [{ wch: 18 }, { wch: 30 }];

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Pago-${pago.socio}-${formatDate(pago.fecha_registro)}.xlsx`);
    document.body.appendChild(link);

    // Accion 1: Descargar
    if (accion === 1) {
      link.click();
      link.parentNode?.removeChild(link);
    } else {
      // Accion 2: Enviar por WhatsApp
      const mensaje = `¡Hola ${pago.socio}! \n Copia el siguiente enlace en tu navegador para descargar el detalle de tu pago. \n ${url}`;
      const urlWhatsApp = `https://api.whatsapp.com/send?phone=${telefono}&text=${encodeURIComponent(mensaje)}`;
      window.open(urlWhatsApp, '_blank');
    }

  }

  // Metodo para buscar pagos por socio
  const handleSearchPagos = async (e: React.MouseEvent<HTMLButtonElement>) => {

    e.preventDefault();

    listarPagos(1);

  }

  const listarPagos = async (page: number = 1) => {
    setIsLoading(true)
    try {
      const response = await apiClient.get(Api_Global_Pagos.pagos.listar(page));
      const data = response.data.data.map((item: Pagos) => ({
        id_pago: item.id_pago,
        puesto: item.puesto,
        socio: item.socio,
        dni: item.dni,
        telefono: item.telefono,
        correo: item.correo,
        total_pago: item.total_pago,
        total_deuda: item.total_deuda,
        fecha_registro: item.fecha_registro,
        serie_numero: item.serie_numero,
      }));
      setPagos(data);
      setTotalPages(response.data.meta.last_page); 
      setPaginaActual(response.data.meta.current_page); 
    } catch (error) {
      console.error("Error al traer datos", error);
    } finally {
      setIsLoading(false);
    }
  };

  const CambioDePagina = (event: React.ChangeEvent<unknown>, value: number) => {
    setPaginaActual(value);
    listarPagos(value); 
  };

  useEffect(() => {
    listarPagos(paginaActual);
  }, []);

  return (
    <Contenedor>
      <ContenedorBotones>

        <BotonAgregar
          handleAction={handleOpen}
          texto="Registrar Pago"
        />

        <RegistrarPagoTabs open={open} handleClose={handleClose} />

        <BotonExportar
          exportFormat={exportFormat}
          setExportFormat={setExportFormat}
          handleExport={handleExportPagos}
        />

      </ContenedorBotones>

      {/* Buscar Pagos X Socio */}
      <Box
        sx={{
          padding: isTablet || isMobile ? "15px 0px" : "15px 35px",
          borderTop: "1px solid rgba(0, 0, 0, 0.25)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.25)",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            display: isTablet || isMobile ? "none" : "inline-block",
            fontWeight: "bold",
            mr: 2
          }}
        >
          Buscar por:
        </Typography>

        {/* Input Nombre Socio */}
        <TextField
          sx={{ width: isTablet || isMobile ? "60%" : "30%" }}
          label="Nombre del socio"
          type="text"
        />

        {/* Boton Buscar */}
        <Button
          variant="contained"
          startIcon={<Search />}
          sx={{
            backgroundColor: "#008001",
            "&:hover": {
              backgroundColor: "#2c6d33",
            },
            height: "50px",
            width: isTablet || isMobile ? "40%" : "170px",
            marginLeft: isMobile ? "10px" : "1rem",
            borderRadius: "30px",
            fontSize: isSmallMobile ? "0.8rem" : "auto"
          }}
          onClick={handleSearchPagos}
        >
          Buscar
        </Button>
      </Box>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Tabla Deudas */}
          <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: "none" }}>
            <TableContainer
              sx={{ maxHeight: "100%", borderRadius: "5px", border: "none" }}
            >
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {isTablet || isMobile
                      ? <Typography
                        sx={{
                          mt: 2,
                          mb: 1,
                          fontSize: "1.5rem",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          textAlign: "center",
                        }}
                      >
                        Lista de pagos
                      </Typography>
                      : columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                          sx={{
                            fontWeight: "bold",
                          }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pagos.map((pago) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      {isTablet || isMobile
                        ? <TableCell padding="checkbox" colSpan={columns.length}>
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Typography
                              sx={{
                                p: 2,
                                // Seleccionar el pago y cambiar el color de fondo
                                bgcolor: mostrarDetalles === pago.id_pago ? "#f0f0f0" : "inherit",
                                "&:hover": {
                                  cursor: "pointer",
                                  bgcolor: "#f0f0f0",
                                }
                              }}
                              onClick={() => setMostrarDetalles(
                                // Si el pago seleccionado es igual al pago actual, ocultar detalles
                                mostrarDetalles === pago.id_pago ? null : pago.id_pago
                              )}
                            >
                              {pago.fecha_registro} - {pago.socio} - {pago.total_pago}
                            </Typography>
                            {mostrarDetalles === pago.id_pago && (
                              <Box
                                sx={{
                                  p: 2,
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 1
                                }}
                              >
                                {columns.map((column) => {
                                  const value = column.id === "accion" ? "" : (pago as any)[column.id];
                                  return (
                                    <Box>
                                      {/* Mostrar titulo del campo */}
                                      <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                                        {column.label}
                                      </Typography>
                                      {/* Mostrar los detalles del pago */}
                                      <Typography>
                                        {column.id === "accion" ? (
                                          <Box
                                            sx={{
                                              width: "100%",
                                              display: "flex",
                                              flexDirection: "column",
                                              justifyContent: "center"
                                            }}
                                          >
                                            {/* <Button 
                                              variant="contained"
                                              sx={{
                                                padding: "0.5rem 1.5rem",
                                                backgroundColor: "#0478E3", 
                                                color: "white" 
                                              }}
                                              // onClick={() => handleOpen(pago)}
                                            >
                                              <InsertDriveFile sx={{ mr: 1 }} />
                                              Ver detalles
                                            </Button> */}
                                            <Button
                                              variant="contained"
                                              sx={{
                                                mt: 1,
                                                mb: 1,
                                                padding: "0.5rem 1.5rem",
                                                backgroundColor: "black",
                                                color: "white"
                                              }}
                                              onClick={() => handleAccionesPago(1, "", pago)}
                                            >
                                              <Download sx={{ mr: 1 }} />
                                              Descargar
                                            </Button>
                                            <Button
                                              variant="contained"
                                              sx={{
                                                padding: "0.5rem 1.5rem",
                                                backgroundColor: "green",
                                                color: "white"
                                              }}
                                              onClick={() => handleAccionesPago(2, pago.telefono, pago)}
                                            >
                                              <WhatsApp sx={{ mr: 1 }} />
                                              Enviar
                                            </Button>
                                          </Box>
                                        ) : (
                                          value
                                        )}
                                      </Typography>
                                    </Box>
                                  )
                                })}
                              </Box>
                            )}
                          </Box>
                        </TableCell>
                        : columns.map((column) => {
                          const value =
                            column.id === "accion" ? "" : (pago as any)[column.id];
                          return (
                            <TableCell key={column.id} align="center">
                              {column.id === "accion" ? (
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: 1,
                                    justifyContent: "center",
                                  }}
                                >
                                  {/* Boton Descargar */}
                                  <IconButton
                                    aria-label="download"
                                    sx={{ color: "#002B7E" }}
                                    onClick={() => handleAccionesPago(1, "", pago)}
                                  >
                                    <FileDownload />
                                  </IconButton>

                                  {/* Boton Whatsapp */}
                                  <IconButton
                                    aria-label="share"
                                    sx={{ color: "#008001" }}
                                    onClick={() => handleAccionesPago(2, pago.telefono, pago)}
                                  >
                                    <WhatsApp />
                                  </IconButton>
                                </Box>
                              ) : (
                                value
                              )}
                            </TableCell>
                          );
                        })}

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box
              sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}
            >
              <Pagination
                count={totalPages}
                page={paginaActual}
                onChange={CambioDePagina}
                color="primary"
              />
            </Box>
          </Paper>
        </>
      )}
    </Contenedor>
  );
};

export default TablaPago;
