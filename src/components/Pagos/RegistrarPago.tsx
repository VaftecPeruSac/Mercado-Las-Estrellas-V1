import { AttachMoney, Person } from "@mui/icons-material";
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
import React, { useState } from "react";

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

interface Data {
  id_cuota: string;
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
    id_cuota: "3",
    anio: "2024",
    mes: "Agosto",
    total: 200.0,
    a_cuenta: 50.0,
    pago: 0,
  },
  {
    id_cuota: "2",
    anio: "2024",
    mes: "Agosto",
    total: 200.0,
    a_cuenta: 50.0,
    pago: 0,
  },
  {
    id_cuota: "1",
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
  const [filasSeleccionadas, setFilasSeleccionadas] = useState<{
    [key: string]: boolean;
  }>({});

  const [itemsSeleccionados, setItemsSeleccionados] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  // Cerrar modal
  const handleCloseModal = () => {
    handleClose();
  };

  // Calcular el total a pagar
  const handleCheckBoxChange = (
    checked: boolean,
    payment: number,
    id: string
  ) => {
    const total_pagar = checked ? totalPagar + payment : totalPagar - payment;
    setTotalPagar(total_pagar);

    setFilasSeleccionadas({
      ...filasSeleccionadas,
      [id]: checked,
    });
  };

  // Cambiar entre pestañas
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) =>
    setActiveTab(newValue);

  const manejarCheckCambio = (servicio: string) => {
    setItemsSeleccionados((prev) =>
      prev.includes(servicio)
        ? prev.filter((item) => item !== servicio)
        : [...prev, servicio]
    );
  };

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

                {/* Seleccionar socio */}
                <Grid item xs={12} sm={12}>
                  <FormControl sx={{ width: "400px" }} required>
                    <InputLabel id="seleccionar-socio-label">
                      Seleccionar Socio
                    </InputLabel>
                    <Select
                      labelId="seleccionar-socio-label"
                      label="Seleccionar Socio"
                      startAdornment={<Person sx={{ mr: 1, color: "gray" }} />}
                    >

                      {/* Listado de socios */}
                      <MenuItem value="1">Juanito Perez</MenuItem>

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
                        maxHeight: "230px",
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
                                  role="checkbox"
                                  tabIndex={-1}
                                  key={row.id_cuota}
                                  sx={{
                                    // Cambiara el color de la linea si el valor de pago es 0
                                    backgroundColor: pagado ? "#0AB544" : "inherit",
                                    "&:hover": {
                                      backgroundColor: pagado ? "#0AB544 !important" : "inherit",
                                    },
                                  }}
                                >
                                  {columns.map((column) => {
                                    let value =
                                      column.id === "accion" ? "" : (row as any)[column.id];

                                    if (column.id === "pago") {
                                      value = monto_pagar;
                                    }

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

                {/* Total a pagar */}
                <Grid item xs={12} sm={6} sx={{ m: "10px 0 0 auto" }}>
                  <TextField
                    fullWidth
                    label="Total a pagar (S/)"
                    value={totalPagar}
                    required
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <AttachMoney sx={{ mr: 1, color: "gray" }} />
                      ),
                    }}
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
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
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
