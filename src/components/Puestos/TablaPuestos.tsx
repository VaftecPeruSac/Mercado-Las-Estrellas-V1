import {
  DeleteForever,
  ExpandLess,
  ExpandMore,
  SaveAs,
  Search,
} from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { columns } from "../../Columns/Puesto";
import useBloques from "../../hooks/Puestos/useBloques";
import useGirosNegocio from "../../hooks/Puestos/useGiroNegocio";
import usePuestos from "../../hooks/Puestos/usePuesto";
import { Bloque, GiroNegocio, Puesto } from "../../interface/Puestos";
import { Api_Global_Puestos } from "../../service/PuestoApi";
import LoadingSpinner from "../PogressBar/ProgressBarV1";
import BotonAgregar from "../Shared/BotonAgregar";
import BotonExportar from "../Shared/BotonExportar";
import Contenedor from "../Shared/Contenedor";
import ContenedorBotones from "../Shared/ContenedorBotones";
import RegistrarPuesto from "./RegistrarPuesto";
import { handleExport } from "../../Utils/exportUtils";

const TablaPuestos: React.FC = () => {
  const bloques = useBloques();
  const girosNegocio = useGirosNegocio();
  const {
    puestos,
    totalPages,
    paginaActual,
    isLoading,
    fetchPuestos,
    mostrarFiltros,
    setMostrarFiltros,
    isLaptop,
    isMobile,
    isTablet,
    mostrarDetalles,
    setMostrarDetalles,
    bloqueSeleccionado,
    setBloqueSeleccionado,
    nroPuestoIngresado,
    setNroPuestoIngresado,
    giroSeleccionado,
    setGiroSeleccionado,
    puestoSeleccionado,
    setPuestoSeleccionado,
    exportFormat,
    setExportFormat,
    open,
    setOpen,
  } = usePuestos();
  const buscarPuestos = () => fetchPuestos();
  const CambioDePagina = (event: React.ChangeEvent<unknown>, value: number) => {
    fetchPuestos(value);
  };

  const handleOpen = (puesto?: Puesto) => {
    setPuestoSeleccionado(puesto || null);
    setOpen(true);
  };

  const handleClose = () => {
    setPuestoSeleccionado(null);
    setOpen(false);
  };

  const handleExportPuestos = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const exportUrl = Api_Global_Puestos.puestos.exportar(); // URL específica para puestos
    const fileNamePrefix = "lista-puestos"; // Nombre del archivo
    await handleExport(exportUrl, exportFormat, fileNamePrefix, setExportFormat);
  };

  return (
    <Contenedor>
      <ContenedorBotones>
        <BotonAgregar
          handleAction={() => handleOpen()}
          texto="Agregar Puesto"
        />

        <RegistrarPuesto
          open={open}
          handleClose={handleClose}
          puesto={puestoSeleccionado}
        />

        <BotonExportar
          exportFormat={exportFormat}
          setExportFormat={setExportFormat}
          handleExport={handleExportPuestos}
        />
      </ContenedorBotones>

      {(isMobile || isTablet) && (
        // Botón "Filtros" para mostrar/ocultar los filtros
        <Box
          sx={{
            width: "100%",
            borderTop: "1px solid rgba(0, 0, 0, 0.25)",
            borderBottom: !mostrarFiltros
              ? "1px solid rgba(0, 0, 0, 0.25)"
              : "none",
            pt: "1rem",
          }}
        >
          <Button
            variant="contained"
            sx={{
              height: "50px",
              width: "100%",
              borderRadius: "30px",
              mb: "1rem",
            }}
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            endIcon={mostrarFiltros ? <ExpandLess /> : <ExpandMore />}
          >
            {mostrarFiltros ? "Ocultar Filtros" : "Mostrar Filtros"}
          </Button>
        </Box>
      )}

      {(!isMobile || mostrarFiltros) && (!isTablet || mostrarFiltros) && (
        <Box
          sx={{
            padding: isLaptop || isTablet || isMobile ? "15px 0" : "15px 35px",
            borderTop: "1px solid rgba(0, 0, 0, 0.25)",
            borderBottom: "1px solid rgba(0, 0, 0, 0.25)",
            display: "flex",
            flexDirection: isTablet || isMobile ? "column" : "row",
            alignItems: isMobile ? "left" : "center",
          }}
        >
          <Typography
            sx={{
              display: isTablet || isMobile ? "none" : "block",
              textAlign: "left",
              fontWeight: "bold",
              mr: 2,
              mt: isMobile ? 1 : 0,
              mb: isMobile ? 2 : 0,
            }}
          >
            Buscar por:
          </Typography>

          <Box
            sx={{
              width: isTablet || isMobile ? "100%" : isLaptop ? "70%" : "auto",
              mb: isTablet ? 2 : 0,
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            {/* Seleccionar Bloque */}
            <FormControl
              sx={{
                width: isTablet ? "33%" : isMobile ? "100%" : "200px",
                mr: isMobile ? 0 : 2,
                textAlign: "left",
              }}
            >
              <InputLabel id="bloque-label">Bloque</InputLabel>
              <Select
                labelId="bloque-label"
                label="Bloque"
                id="select-bloque"
                value={bloqueSeleccionado}
                onChange={(e) => {
                  const value = e.target.value;
                  setBloqueSeleccionado(value);
                }}
              >
                <MenuItem value="">Todos</MenuItem>
                {bloques.map((bloque: Bloque) => (
                  <MenuItem
                    key={bloque.id_block}
                    value={bloque.id_block}
                  >
                    {bloque.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Input Numero de puesto */}
            <TextField
              sx={{
                width: isTablet ? "33%" : isMobile ? "100%" : "200px",
                mt: isMobile ? 2 : 0,
                mb: isMobile ? 2 : 0,
              }}
              type="text"
              label="Numero de puesto"
              onChange={(e) => setNroPuestoIngresado(e.target.value)}
            />

            {/* Seleccionar Giro negocio */}
            <FormControl
              sx={{
                width: isTablet ? "33%" : isMobile ? "100%" : "200px",
                ml: isMobile ? 0 : 2,
                textAlign: "left",
              }}
            >
              <InputLabel id="giro-negocio-label">Giro de negocio</InputLabel>
              <Select
                labelId="giro-negocio-label"
                label="Giro de negocio"
                id="select-giro-negocio"
                value={giroSeleccionado}
                onChange={(e) => {
                  const value = e.target.value;
                  setGiroSeleccionado(value);
                }}
              >
                <MenuItem value="">Todos</MenuItem>
                {girosNegocio.map((giro: GiroNegocio) => (
                  <MenuItem
                    key={giro.id_gironegocio}
                    value={giro.id_gironegocio}
                  >
                    {giro.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

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
              width: isTablet ? "100%" : isMobile ? "100%" : "170px",
              marginTop: isMobile ? 2 : 0,
              marginLeft: isMobile ? 0 : "1rem",
              borderRadius: "30px",
            }}
            onClick={buscarPuestos}
          >
            Buscar
          </Button>
        </Box>
      )}

      {isLoading ? (
        <LoadingSpinner /> // Mostrar el loading mientras se están cargando los datos
      ) : (
        <>
          {/* Tabla */}
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
                        Lista de Puestos
                      </Typography>
                    ) : (
                      columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={
                            column.id === "accion" ? "center" : column.align
                          }
                          style={{ minWidth: column.minWidth }}
                          sx={{
                            fontWeight: "bold",
                          }}
                        >
                          {column.label}
                        </TableCell>
                      ))
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {puestos.map((puesto) => (
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
                                // Seleccionar el puesto y cambiar el color de fondo
                                bgcolor:
                                  mostrarDetalles === puesto.id_puesto
                                    ? "#f0f0f0"
                                    : "inherit",
                                "&:hover": {
                                  cursor: "pointer",
                                  bgcolor: "#f0f0f0",
                                },
                              }}
                              onClick={() =>
                                setMostrarDetalles(
                                  // Si el puesto seleccionado es igual al puesto actual, ocultar detalles
                                  mostrarDetalles === puesto.id_puesto
                                    ? null
                                    : puesto.id_puesto
                                )
                              }
                            >
                              {puesto.block.nombre} - {puesto.numero_puesto} - {" "}
                              {puesto.giro_negocio.nombre}
                            </Typography>
                            {mostrarDetalles === puesto.id_puesto && (
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
                                      : (puesto as any)[column.id];
                                  return (
                                    <Box>
                                      {/* Mostrar titulo del campo */}
                                      <Typography
                                        sx={{ fontWeight: "bold", mb: 1 }}
                                      >
                                        {column.label}
                                      </Typography>
                                      {/* Mostrar los detalles del puesto */}
                                      <Typography>
                                        {column.id === "giro_negocio" ? (
                                          puesto.giro_negocio.nombre
                                        ) : column.id === "block" ? (
                                          puesto.block.nombre
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
                                              onClick={() => handleOpen(puesto)}
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
                              : (puesto as any)[column.id];
                          return (
                            <TableCell
                              key={column.id}
                              align={column.align}
                            >
                              {/* Acciones */}
                              {column.id === "giro_negocio" ? (
                                puesto.giro_negocio.nombre
                              ) : column.id === "block" ? (
                                puesto.block.nombre
                              ) : column.id === "accion" ? (
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: 1,
                                    justifyContent: "center",
                                  }}
                                >
                                  <IconButton
                                    aria-label="edit"
                                    sx={{ color: "#0478E3" }}
                                    onClick={() => handleOpen(puesto)}
                                  >
                                    <SaveAs />
                                  </IconButton>
                                  <IconButton
                                    aria-label="delete"
                                    sx={{ color: "red" }}
                                    onClick={() =>
                                      alert(
                                        "En proceso de actualización. Intentelo más tarde."
                                      )
                                    }
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

export default TablaPuestos;
