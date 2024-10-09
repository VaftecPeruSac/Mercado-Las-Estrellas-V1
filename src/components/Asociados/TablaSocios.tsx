import * as React from "react";
import { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Box,
  Pagination,
  Typography,
  TextField,
} from "@mui/material";
import {
  Download,
  WhatsApp,
  Payments,
  SaveAs,
  Search,
} from "@mui/icons-material";
import axios from "axios";
import Agregar from "./RegistrarSocio";
import LoadingSpinner from "../PogressBar/ProgressBarV1";
import Contenedor from "../Shared/Contenedor";
import ContenedorBotones from "../Shared/ContenedorBotones";
import BotonExportar from "../Shared/BotonExportar";
import BotonAgregar from "../Shared/BotonAgregar";
import { formatDate } from "../../Utils/dateUtils";
import { Data, Socio } from "../../interface/Socios";
import { columns } from "../../Columns/Socios";
import { handleExport } from "../../Utils/exportUtils";
import { Api_Global_Socios } from "../../service/SocioApi";
import useSocios from "../../hooks/Socios/useSocios";
import { handleAccionesSocio } from "../../Utils/downloadDataSocio";

const TablaAsociados: React.FC = () => {
  const {
    isTablet,
    isMobile,
    isSmallMobile,
    mostrarDetalles,
    setMostrarDetalles,
    nombreIngresado,
    setNombreIngresado,
    socioSeleccionado,
    setSocioSeleccionado,
    open,
    setOpen,
    exportFormat,
    setExportFormat,
    isLoading,
    socios,
    totalPages,
    paginaActual,
    setPaginaActual,
    navigate,
    fetchSocios,
  } = useSocios();

  const handleVerReportePagos = (id_socio: string) => {
    navigate(`/home/reporte-pagos?socio=${id_socio}`);
  };

  const handleVerReporteDeudas = (id_puesto: string) => {
    navigate(`/home/reporte-deudas?puesto=${id_puesto}`);
  };

  const handleOpen = (socio?: Socio) => {
    setSocioSeleccionado(socio || null);
    setOpen(true);
  }

  const handleClose = () => {
    setSocioSeleccionado(null);
    setOpen(false);
  }

  // Metodo para exportar el listado de socios
  const handleExportSocios = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const exportUrl = Api_Global_Socios.socios.exportar(); // URL específica para exportar socios
    const fileNamePrefix = "lista-socios"; // Prefijo del nombre del archivo
    await handleExport(exportUrl, exportFormat, fileNamePrefix, setExportFormat);
  };

  const downloadDataSocios = (accion: number, telefono: string, socio: Socio) => {
    handleAccionesSocio(accion, telefono, socio);
  };

  const buscarSocios = () => {
    fetchSocios();
  }
  // const handleSocioRegistrado = () => {
  //   fetchSocios();
  // };

  const CambioDePagina = (event: React.ChangeEvent<unknown>, value: number) => {
    setPaginaActual(value);
    fetchSocios(value);
  };

  return (
    <Contenedor>
      <ContenedorBotones>

        <BotonAgregar
          handleAction={() => handleOpen()}
          texto="Agregar Socio"
        />

        <Agregar
          open={open}
          handleClose={handleClose}
          socio={socioSeleccionado}
        // onSocioRegistrado={handleSocioRegistrado}
        />

        <BotonExportar
          exportFormat={exportFormat}
          setExportFormat={setExportFormat}
          handleExport={handleExportSocios}
        />

      </ContenedorBotones>

      {/* Buscar socio */}
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
            mr: 2,
          }}>
          Buscar por:
        </Typography>

        {/* Input Nombre Socio */}
        <TextField
          sx={{
            width: isTablet || isMobile ? "60%" : "30%",
            "& .MuiInputLabel-root": {
              fontSize: isSmallMobile ? "0.9rem" : "auto",
            },
            "& .MuiInputBase-input": {
              fontSize: isSmallMobile ? "0.9rem" : "auto",
            },
          }}
          label="Nombre del socio"
          onChange={(e) => setNombreIngresado(e.target.value)}
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
            fontSize: isSmallMobile ? "0.8rem" : "auto",
            borderRadius: "30px",
          }}
          onClick={buscarSocios}
        >
          Buscar
        </Button>
      </Box>
      {isLoading ? (
        <LoadingSpinner /> // Mostrar el loading mientras se están cargando los datos
      ) : (
        <>
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
                        Lista de socios
                      </Typography>
                      : columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align="center"
                          style={{ minWidth: column.minWidth }}
                          sx={{
                            backgroundColor:
                              column.id === "deuda" ? "#f8d7da" : undefined,
                            color: column.id === "deuda" ? "#721c24" : undefined,
                            fontWeight: "bold",
                          }}
                        >
                          {column.label}
                        </TableCell>
                      ))
                    }
                  </TableRow>
                </TableHead>
                <TableBody>
                  {socios.map((socio) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      {isTablet || isMobile
                        ? <TableCell padding="checkbox" colSpan={columns.length}>
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Typography
                              sx={{
                                p: 2,
                                // Seleccionar el socio y cambiar el color de fondo
                                bgcolor: mostrarDetalles === socio.id_socio ? "#f0f0f0" : "inherit",
                                "&:hover": {
                                  cursor: "pointer",
                                  bgcolor: "#f0f0f0",
                                }
                              }}
                              onClick={() => setMostrarDetalles(
                                // Si el socio seleccionado es igual al socio actual, ocultar detalles
                                mostrarDetalles === socio.id_socio ? null : socio.id_socio
                              )}
                            >
                              {socio.nombre_completo}
                            </Typography>
                            {mostrarDetalles === socio.id_socio && (
                              <Box
                                sx={{
                                  p: isSmallMobile ? 1 : 2,
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 1
                                }}
                              >
                                {columns.map((column) => {
                                  const value = column.id === "accion" ? "" : (socio as any)[column.id];
                                  return (
                                    <Box>
                                      {/* Mostrar titulo del campo */}
                                      <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                                        {column.label}
                                      </Typography>
                                      {/* Mostrar los detalles del socio */}
                                      <Typography>
                                        {column.id === "deuda" ? (
                                          <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <Typography
                                              sx={{
                                                color: value === "No" ? "green" : "crimson"
                                              }}>
                                              {value === "No" ? "No existen deudas" : value}
                                            </Typography>
                                          </Box>
                                        ) : column.id === "ver_reporte" ? (
                                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Button
                                              variant="contained"
                                              sx={{
                                                width: "50%",
                                                padding: "0.5rem 1.5rem",
                                                backgroundColor: "crimson",
                                                color: "white"
                                              }}
                                              onClick={() => handleVerReporteDeudas(socio.id_puesto)}
                                            >
                                              <Payments sx={{ mr: 1 }} />
                                              Deudas
                                            </Button>
                                            <Button
                                              variant="contained"
                                              sx={{
                                                width: "50%",
                                                padding: "0.5rem 1.5rem",
                                                backgroundColor: "green",
                                                color: "white"
                                              }}
                                              onClick={() => handleVerReportePagos(socio.id_socio)}
                                            >
                                              <Payments sx={{ mr: 1 }} />
                                              Pagos
                                            </Button>
                                          </Box>
                                        ) : column.id === "accion" ? (
                                          <Box
                                            sx={{
                                              width: "100%",
                                              display: "flex",
                                              flexDirection: isTablet ? "row" : "column",
                                              justifyContent: "center",
                                              gap: isTablet ? 1 : 0
                                            }}
                                          >
                                            <Button
                                              variant="contained"
                                              sx={{
                                                width: isTablet ? "33%" : "100%",
                                                mb: isTablet ? 1 : 0,
                                                padding: "0.5rem 1.5rem",
                                                backgroundColor: "#0478E3",
                                                color: "white"
                                              }}
                                              onClick={() => handleOpen(socio)}
                                            >
                                              <SaveAs sx={{ mr: 1 }} />
                                              Editar
                                            </Button>
                                            <Button
                                              variant="contained"
                                              sx={{
                                                width: isTablet ? "33%" : "100%",
                                                mt: isTablet ? 0 : 1,
                                                mb: 1,
                                                padding: "0.5rem 1.5rem",
                                                backgroundColor: "black",
                                                color: "white"
                                              }}
                                              onClick={() => downloadDataSocios(1, "", socio)}
                                            >
                                              <Download sx={{ mr: 1 }} />
                                              Descargar
                                            </Button>
                                            <Button
                                              variant="contained"
                                              sx={{
                                                width: isTablet ? "33%" : "100%",
                                                mb: isTablet ? 1 : 0,
                                                padding: "0.5rem 1.5rem",
                                                backgroundColor: "green",
                                                color: "white"
                                              }}
                                              onClick={() => downloadDataSocios(2, socio.telefono, socio)}
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
                            column.id === "accion" ? "" : (socio as any)[column.id];
                          return (
                            <TableCell
                              key={column.id}
                              align={column.id === "deuda" ? "center" : column.align}
                              sx={{
                                backgroundColor:
                                  column.id === "deuda" && value === 0 ? "#B5F598" : column.id === "deuda" ? "#f8d7da" : undefined,
                                color:
                                  column.id === "deuda" && value === 0 ? "green" : column.id === "deuda" ? "#721c24" : undefined,
                              }}
                            >
                              {column.id === "deuda"
                                ? value === 0 ? "No existen deudas" : `S/ ${value}`
                                : column.id === "ver_reporte" ? (
                                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <IconButton
                                      aria-label="payment"
                                      sx={{ color: "crimson" }}
                                      onClick={() => handleVerReporteDeudas((socio as any).id_puesto)}
                                    >
                                      <Payments />
                                    </IconButton>
                                    <IconButton
                                      aria-label="payment"
                                      sx={{ color: "green" }}
                                      onClick={() => handleVerReportePagos((socio as any).id_socio)}
                                    >
                                      <Payments />
                                    </IconButton>
                                  </Box>
                                ) : column.id === "accion" ? (
                                  <Box sx={{ display: "flex" }}>
                                    <IconButton
                                      aria-label="edit"
                                      sx={{ color: "#0478E3" }}
                                      onClick={() => handleOpen(socio)}
                                    >
                                      <SaveAs />
                                    </IconButton>
                                    <IconButton
                                      aria-label="download"
                                      sx={{ color: "black" }}
                                      onClick={() => downloadDataSocios(1, "", socio)}
                                    >
                                      <Download />
                                    </IconButton>
                                    <IconButton
                                      aria-label="whatsapp"
                                      sx={{ color: "green" }}
                                      onClick={() => downloadDataSocios(2, socio.telefono, socio)}
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
                count={totalPages} // Total de páginas
                page={paginaActual} // Página actual
                onChange={CambioDePagina} // Manejar el cambio de página
                color="primary"
              />
            </Box>
          </Paper>
        </>
      )}
    </Contenedor>
  );
};
export default TablaAsociados;
