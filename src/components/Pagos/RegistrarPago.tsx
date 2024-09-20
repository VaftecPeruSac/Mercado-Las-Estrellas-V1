import { AttachMoney, Person, Business } from "@mui/icons-material";
import {
  Box,
  Card,
  Modal,
  Tabs,
  Tab,
  Typography,
  Button,
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
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface AgregarProps {
  open: boolean;
  handleClose: () => void;
}

interface Column {
  id: keyof Data | "accion";
  label: string;
  minWidth?: number;
  align?: "center";
}

interface Socio{
  id_socio: number;
  socio: string;
  nombre_completo: string;
}

interface Puesto{
  id_puesto:number;
  numero_puesto: string;
}

interface Cuota{
  id_cuota:number;
  monto: string;
}

interface Data {
  id_cuota: number;
  anio: string;
  mes: string;
  total: number;
  a_cuenta: number;
  pago: number;
}

const columns: readonly Column[] = [
  {
    id: "id_cuota",
    label: "#ID Cuota",
    minWidth: 50,
    align: "center",
  },
  {
    id: "anio",
    label: "Año",
    minWidth: 50,
    align: "center",
  },
  {
    id: "mes",
    label: "Mes",
    minWidth: 50,
    align: "center",
  },
  {
    id: "total",
    label: "Total (S/)",
    minWidth: 50,
    align: "center",
  },
  {
    id: "a_cuenta",
    label: "A cuenta (S/)",
    minWidth: 50,
    align: "center",
  },
  {
    id: "pago",
    label: "Pago (S/)",
    minWidth: 50,
    align: "center",
  },
  {
    id: "accion",
    label: "",
    minWidth: 50,
    align: "center",
  },
];

const initialRows: Data[] = [
  {
    id_cuota: 3,
    anio: "2024",
    mes: "Septiembre",
    total: 200.0,
    a_cuenta: 50.0,
    pago: 0,
  },
  {
    id_cuota: 2,
    anio: "2024",
    mes: "Agosto",
    total: 200.0,
    a_cuenta: 50.0,
    pago: 0,
  },
  {
    id_cuota: 1,
    anio: "2024",
    mes: "Junio",
    total: 120.0,
    a_cuenta: 120.0,
    pago: 0,
  },
];

const RegistrarPago: React.FC<AgregarProps> = ({ open, handleClose }) => {
  const [rows, setRows] = useState<Data[]>(initialRows);
  const [page, setPage] = useState(0);
  const [rowsPage, setRowsPage] = useState(5);

  const [totalPagar, setTotalPagar] = useState(0);
  const [filasSeleccionadas, setFilasSeleccionadas] = useState<({[key: string]: boolean;})>({});

  const [activeTab, setActiveTab] = useState(0);

  const [socios, setSocios] = useState<Socio[]>([]);
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState<number | "">("");
  const [puestosFiltrados, setPuestosFiltrados] = useState<Puesto[]>([]);

  // const [idSocio, setIdSocio] = useState<string>("");
  const [formDataSocio, setFormDataSocio] = useState({
    id_socio: "",
    socio: "",
    nombre_completo: "",
  });
  const [formDataPuesto, setFormDataPuesto] = useState({
    id_puesto: "",
    numero_puesto: "",
  });

  // Cerrar modal
  const handleCloseModal = () => {
    handleClose();
  };


  // Obtener Lista Socios
  useEffect(() => {
    const fetchBloques = async () => {
      try {
        const response = await axios.get(`https://mercadolasestrellas.online/intranet/public/v1/socios?per_page=50`);
        // console.log("Socios obtenidos:", response.data.data);
        const data = response.data.data.map((item: Socio) => ({
          id_socio: item.id_socio,
          socio: item.socio,
          nombre_completo: item.nombre_completo,
        }));
        setSocios(data);
      } catch (error) {
        console.error("Error al obtener los Socios", error);
      }
    };
    fetchBloques();
  }, []);

  // Obtener Lista Puestos
  const fetchPuestos = async (idSocio: string) => {
    try {
      const response = await axios.get(`https://mercadolasestrellas.online/intranet/public/v1/puestos?per_page=50&id_socio=${idSocio}`);
      const data = response.data.data.map((item: Puesto) => ({
        id_puesto: item.id_puesto,
        numero_puesto: item.numero_puesto,
      }));
      setPuestos(data);
    } catch (error) {
      console.error("Error al obtener los Socios", error);
    }
  };

  // useEffect(() => {
  //   fetchPuestos();
  // }, []);

  // Calcular el total a pagar de las filas seleccionadas
  const calcularTotalSeleccionado = () => {
    let total = 0;
    Object.keys(filasSeleccionadas).forEach((id_cuota) => {
      if(filasSeleccionadas[id_cuota]){
        const fila = rows.find((row) => row.id_cuota === parseInt(id_cuota));
        if(fila){
          total += fila.total - fila.a_cuenta;
        }
      }
    });
    setTotalPagar(total);
  };

  useEffect(() => {
    calcularTotalSeleccionado();
  }, [filasSeleccionadas]);

  // Seleccionar filas
  const handleCheckBoxChange = (seleccionado: boolean, montoPagar: number, idCuota: number) => {
    setFilasSeleccionadas((estadoPrevio) => {
      const nuevoEstado = {...estadoPrevio, [idCuota]: seleccionado};
      return nuevoEstado;
    });
  };

  // Cambiar entre pestañas
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) =>
    setActiveTab(newValue);

  // Contenido del modal
  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <>
            <Box
              component="form"
              noValidate
              autoComplete="off"
              sx={{ p: "20px 58px" }}
            >
              <Grid container spacing={2}>

              <Grid item xs={12} sm={12}>

                {/* Seleccionar socio */}
                <FormControl sx={{ width: "390px" }} required>
                  <InputLabel id="seleccionar-socio-label">
                    Seleccionar Socio
                  </InputLabel>
                  <Select
                      labelId="seleccionar-socio-label"
                      label="Socio"
                      id="select-socio"
                      value={formDataSocio.id_socio}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormDataSocio({ ...formDataSocio, id_socio: value });
                        fetchPuestos(value);
                      }}
                      startAdornment={<Business sx={{ mr: 1, color: "gray" }} />}
                    >
                      {socios.map((socio: Socio) => (
                        <MenuItem key={socio.id_socio} value={socio.id_socio}>
                          {socio.nombre_completo}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>

                {/* Seleccionar puesto */}
                <FormControl sx={{ ml: "23px" , width: "390px" }} required>
                  <InputLabel id="seleccionar-puesto-label">
                    Seleccionar Puesto
                  </InputLabel>
                  <Select
                      labelId="seleccionar-puesto-label"
                      label="Puesto"
                      id="select-puesto"
                      value={formDataPuesto.id_puesto}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormDataPuesto({ ...formDataPuesto, id_puesto: value });
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
                        maxHeight: "235px",
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
                          {rows
                            .slice(page * rowsPage, page * rowsPage + rowsPage)
                            .map((row) => {

                              // Calculamos el monto a pagar
                              const monto_pagar = row.total - row.a_cuenta;
                              const pagado = monto_pagar === 0;
                              const seleccionado = filasSeleccionadas[row.id_cuota] || false;

                              return (
                                <TableRow
                                  hover
                                  tabIndex={-1}
                                  key={row.id_cuota}
                                  sx={{
                                    // Cambiara el color de la linea si el valor de pago es 0
                                    backgroundColor: pagado ? "#0AB544" : "inherit",
                                    "&:hover": { backgroundColor: pagado ? "#0AB544 !important" : "inherit" },
                                  }}
                                >
                                  {columns.map((column) => {
                                    let value =
                                      column.id === "accion" ? "" : (row as any)[column.id];

                                    if (column.id === "pago") {
                                      value = monto_pagar;
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
                                                    monto_pagar,
                                                    row.id_cuota
                                                  )
                                                }
                                              />
                                            </IconButton>
                                          </Box>
                                        ) : column.id === "pago" && pagado ? ( "PAGADO" ) : // Si el valor de pago es 0 cambiara a pagado
                                        ( value )}
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
                <Grid item xs={12} sm={8} sx={{ m: "10px 0 0 auto" }}>
                  <TextField
                    label="Total (S/)"
                    value={totalPagar}
                    required
                    focused
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <AttachMoney sx={{ mr: 1, color: "gray" }} />
                      ),
                    }}
                    sx={{
                      mr: 2
                    }}
                  />
                  <TextField
                    color="success"
                    label="Monto a pagar (S/)"
                    value={totalPagar}
                    required
                    focused
                    InputProps={{
                      // Solo se puede editar cuando se selecciona una sola fila
                      readOnly: Object.values(filasSeleccionadas).filter(Boolean).length !== 1,
                      startAdornment: (<AttachMoney sx={{ mr: 1, color: "gray" }} />),
                    }}
                    // Para mostrar el monto a pagar
                    onChange={(e) => setTotalPagar(Number(e.target.value))}
                  />
                </Grid>
              </Grid>
            </Box>
          </>
        );
      default:
        return "";
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleCloseModal}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Card
        sx={{
          width: "1000px",
          height: "750px",
          p: "40px",
          bgcolor: "#f0f0f0",
          boxShadow: 24,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box
          sx={{
            backgroundColor: "#008001",
            p: 2,
            color: "#fff",
            borderRadius: 1,
          }}
        >
          <Typography
            id="modal-title"
            variant="h6"
            component="h2"
            sx={{ textAlign: "center", textTransform: "uppercase" }}
          >
            Registrar Pago
          </Typography>
        </Box>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            sx={{ 
              "& .MuiTabs-flexContainer": {
                minHeight: "36px",
              },
              "& .MuiTab-root": {
                fontSize: "0.8rem",
                fontWeight: "normal",
                color: "gray",
                textTransform: "uppercase",
                minWidth: "auto",
                px: 2,
              },
              "& .MuiTab-root.Mui-selected": {
                fontWeight: "bold",
                color: "black !important",
              },
              "& .MuiTabs-indicator": {
                display: "none",
              },
              mb: -1,
            }}
          >
            <Tab label="Registrar Pago" />
          </Tabs>
        </Box>

        {renderTabContent()}

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: "auto",
            p: "20px 58px 0 58px",
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <Button
            variant="contained"
            sx={{
              width: "140px",
              height: "45px",
              backgroundColor: "#202123",
              color: "#fff",
              mr: 1,
              "&:hover": {
                backgroundColor: "#3F4145",
              },
            }}
            onClick={handleCloseModal}
          >
            Cerrar
          </Button>
          <Button
            variant="contained"
            sx={{
              width: "140px",
              height: "45px",
              backgroundColor: "#008001",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#388E3C",
              },
            }}
            // onClick={}
          >
            Pagar
          </Button>
        </Box>
      </Card>
    </Modal>
  );
};

export default RegistrarPago;
