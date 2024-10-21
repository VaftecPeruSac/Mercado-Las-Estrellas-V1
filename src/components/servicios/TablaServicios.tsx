import * as React from "react";
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
  TextField,
  Typography,
} from "@mui/material";
import { SaveAs, DeleteForever, Search } from "@mui/icons-material";
import RegistrarServicio from "./RegistrarServicio";
import LoadingSpinner from "../PogressBar/ProgressBarV1";
import { Servicio } from "../../interface/Servicios"; // se esta importando la interface servicios
import { columns } from "../../Columns/Servicios";
import useServicioState from "../../hooks/Servicios/useServicio";
import { API_ROUTES } from "../../service/ServicioApi"; // Asegúrate de que la ruta sea correcta
import Contenedor from "../Shared/Contenedor";
import ContenedorBotones from "../Shared/ContenedorBotones";
import BotonExportar from "../Shared/BotonExportar";
import BotonAgregar from "../Shared/BotonAgregar";
import { handleExport } from "../../Utils/exportUtils";
import axios from "axios";
import { manejarError, mostrarAlerta, mostrarAlertaConfirmacion } from "../Alerts/Registrar";
import apiClient from "../../Utils/apliClient";

const TablaServicios: React.FC = () => {
  const {
    mostrarDetalles,
    setMostrarDetalles,
    buscarTexto,
    setBuscarTexto,
    servicios,
    setServicios,
    servicioSeleccionado,
    setServicioSeleccionado,
    totalPages,
    setTotalPages,
    paginaActual,
    setPaginaActual,
    exportFormat,
    setExportFormat,
    open,
    setOpen,
    isLoading,
    setIsLoading,
    isTablet,
    isMobile,
    isSmallMobile,
    fetchServicios
  } = useServicioState();

  // Abrir modal con un servicio seleccionado o vacio
  const handleOpen = (servicio?: Servicio) => {
    setServicioSeleccionado(servicio || null);
    setOpen(true);
  };

  const handleClose = () => {
    setServicioSeleccionado(null);
    setOpen(false);
  };

  const handleExportServicios = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const exportUrl = API_ROUTES.servicios.exportar(); // URL específica para servicios
    const fileNamePrefix = "lista-servicios"; // Nombre del archivo
    await handleExport(exportUrl, exportFormat, fileNamePrefix, setExportFormat);
  };

  const CambioDePagina = (event: React.ChangeEvent<unknown>, value: number) => {
    setPaginaActual(value);
    fetchServicios(value); 
  };

  const buscarServicios = () => {
    fetchServicios(1);
  };
  const eliminarServicio = async (item: any) => {
    try {
      const response = await apiClient.delete(API_ROUTES.servicios.eliminar(item.id_servicio));
      if (response.status === 200) {
        const mensaje = response.data.message || "El servicio se elimino.";
        mostrarAlerta("Eliminación exitosa", mensaje, "success");
        fetchServicios();
      } else {
        mostrarAlerta("Error");
      }
    } catch (error) {
      manejarError(error);
    } finally {
      // ---
    }
  };

  return (
    <Contenedor>
      <ContenedorBotones>
        <BotonAgregar
          handleAction={() => handleOpen()}
          texto="Agregar Servicio"
        />

        <RegistrarServicio
          open={open}
          handleClose={handleClose}
          servicio={servicioSeleccionado}
        />

        <BotonExportar
          exportFormat={exportFormat}
          setExportFormat={setExportFormat}
          handleExport={handleExportServicios}
        />
      </ContenedorBotones>

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
          }}
        >
          Buscar por:
        </Typography>

        {/* Input Nombre Servicio */}
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
          label="Nombre del servicio"
          type="text"
          onChange={(e) => setBuscarTexto(e.target.value)}
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
          // onClick={}buscarServicios
          onClick={buscarServicios}
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
              <Table
                stickyHeader
                aria-label="sticky table"
              >
                <TableHead>
                  <TableRow>
                    {isTablet || isMobile ? (
                      <Typography
                        sx={{
                          mt: 2,
                          mb: 1,
                          fontSize: "1.5rem",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          textAlign: "center",
                        }}
                      >
                        Lista de Servicios
                      </Typography>
                    ) : (
                      columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={
                            column.id === "accion" ? "center" : column.align
                          }
                          style={{ minWidth: column.minWidth }}
                          sx={{ fontWeight: "bold" }}
                        >
                          {column.label}
                        </TableCell>
                      ))
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {servicios.map((servicio) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                    >
                      {isTablet || isMobile ? (
                        <TableCell
                          padding="checkbox"
                          colSpan={columns.length}
                        >
                          <Box
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            <Typography
                              sx={{
                                p: 2,
                                // Seleccionar el servicio y cambiar el color de fondo
                                bgcolor:
                                  mostrarDetalles === servicio.id_servicio
                                    ? "#f0f0f0"
                                    : "inherit",
                                "&:hover": {
                                  cursor: "pointer",
                                  bgcolor: "#f0f0f0",
                                },
                              }}
                              onClick={() =>
                                setMostrarDetalles(
                                  // Si el servicio seleccionado es igual al servicio actual, ocultar detalles
                                  mostrarDetalles === servicio.id_servicio
                                    ? null
                                    : servicio.id_servicio
                                )
                              }
                            >
                              {servicio.descripcion} -{" "}
                              {parseInt(servicio.tipo_servicio) === 1
                                ? "Ordinario"
                                : parseInt(servicio.tipo_servicio) === 2
                                  ? "Extraordinario"
                                  : "Por metrado"}
                            </Typography>
                            {mostrarDetalles === servicio.id_servicio && (
                              <Box
                                sx={{
                                  p: 2,
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 1,
                                }}
                              >
                                {columns.map((column) => {
                                  const value =
                                    column.id === "accion"
                                      ? ""
                                      : (servicio as any)[column.id];
                                  return (
                                    <Box>
                                      {/* Mostrar titulo del campo */}
                                      <Typography
                                        sx={{ fontWeight: "bold", mb: 1 }}
                                      >
                                        {column.label}
                                      </Typography>
                                      {/* Mostrar los detalles del servicio */}
                                      <Typography>
                                        {column.id === "tipo_servicio" ? (
                                          // Si el campo es tipo_servicio, mostrar el tipo de servicio
                                          parseInt(servicio.tipo_servicio) ===
                                            1 ? (
                                            "Ordinario (Pagos fijos)"
                                          ) : parseInt(
                                            servicio.tipo_servicio
                                          ) === 2 ? (
                                            "Extraordinario (Pagos extras)"
                                          ) : (
                                            "Por metrado (Pagos por metraje)"
                                          )
                                        ) : column.id === "accion" ? (
                                          <Box
                                            sx={{
                                              display: "flex",
                                              justifyContent: "flex-start",
                                              gap: 1,
                                            }}
                                          >
                                            <Button
                                              variant="contained"
                                              sx={{
                                                width: "50%",
                                                bgcolor: "#EA9A00",
                                                color: "#fff",
                                              }}
                                              onClick={() =>
                                                handleOpen(servicio)
                                              }
                                            >
                                              <SaveAs sx={{ mr: 1 }} />
                                              Editar
                                            </Button>
                                            <Button
                                              variant="contained"
                                              sx={{
                                                width: "50%",
                                                bgcolor: "crimson",
                                                color: "#fff",
                                              }}
                                              onClick={() =>
                                                alert(
                                                  "En proceso de actualización. Intentelo más tarde."
                                                )
                                              }
                                            >
                                              <DeleteForever sx={{ mr: 1 }} />
                                              Eliminar
                                            </Button>
                                          </Box>
                                        ) : (
                                          value
                                        )}
                                      </Typography>
                                    </Box>
                                  );
                                })}
                              </Box>
                            )}
                          </Box>
                        </TableCell>
                      ) : (
                        columns.map((column) => {
                          const value =
                            column.id === "accion"
                              ? ""
                              : (servicio as any)[column.id];
                          return (
                            <TableCell
                              key={column.id}
                              align={column.align}
                            >
                              {column.id === "tipo_servicio" ? (
                                parseInt(servicio.tipo_servicio) === 1 ? (
                                  "Ordinario (Pagos fijos)"
                                ) : parseInt(servicio.tipo_servicio) === 2 ? (
                                  "Extraordinario (Pagos extras)"
                                ) : (
                                  "Por metrado (Pagos por metraje)"
                                )
                              ) : column.id === "accion" ? (
                                <Box
                                  sx={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                >
                                  <IconButton
                                    aria-label="edit"
                                    sx={{ color: "#0478E3" }}
                                    onClick={() => handleOpen(servicio)}
                                  >
                                    <SaveAs />
                                  </IconButton>
                                  <IconButton
                                    aria-label="delete"
                                    sx={{ color: "red" }}
                                    onClick={() => eliminarServicio(servicio)}
                                  >
                                    <DeleteForever />
                                  </IconButton>
                                </Box>
                              ) : (
                                value
                              )}
                            </TableCell>
                          );
                        })
                      )}
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

export default TablaServicios;
