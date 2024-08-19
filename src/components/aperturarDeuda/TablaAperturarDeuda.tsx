import * as React from "react";
import { useState } from "react";
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
  Card,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { Edit, Download, SaveAs, Delete, DeleteForever, MonetizationOn } from "@mui/icons-material";
import { GridAddIcon } from "@mui/x-data-grid";

interface Column {
  id: keyof Data | "accion";
  label: string;
  minWidth?: number;
  align?: "right";
}

interface Data {
  numero: string;
  puesto: string;
  datos_socio: string;
  fecha_registro: string;
  precio: string;
}

const columns: readonly Column[] = [
  { id: "numero", label: "#ID", minWidth: 50 },
  { id: "puesto", label: "N°Puesto", minWidth: 50 },
  { id: "datos_socio", label: "Datos del Socio", minWidth: 50 },
  { id: "fecha_registro", label: "Fecha de Registro", minWidth: 50 },
  { id: "precio", label: "Precio", minWidth: 50 },
  { id: "accion", label: "Acción", minWidth: 120 },
];

const initialRows: Data[] = [
  {
    numero: "1",
    puesto: "Puesto 1",
    datos_socio: "100",
    fecha_registro: "2024",
    precio: "200",
  },
  {
    numero: "2",
    puesto: "Puesto 2",
    datos_socio: "100",
    fecha_registro: "2024",
    precio: "200",
  },
];

const TablaAperturarDeuda: React.FC = () => {
  const [rows, setRows] = useState<Data[]>(initialRows);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [exportFormat, setExportFormat] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [openPagar, setOpenPagar] = useState<boolean>(false);

  const [anio, setAnio] = useState<string>('');
  const [mes, setMes] = useState<string>('');
  const [itemsSeleccionados, setItemsSeleccionados] = useState<string[]>([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenPagar = () => setOpenPagar(true);
  const handleClosePagar = () => setOpenPagar(false);

  const manejarCheckCambio = (servicio: string) => {
    setItemsSeleccionados(prev =>
      prev.includes(servicio) ? prev.filter(item => item !== servicio) : [...prev, servicio]
    );
  };

  const manejarAnioCambio = (evento: SelectChangeEvent<string>) => {
    setAnio(evento.target.value as string);
  };

  const manejarMesCambio = (evento: SelectChangeEvent<string>) => {
    setMes(evento.target.value as string);
  };

  const handleExport = () => {
    console.log(`Exporting as ${exportFormat}`);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        pt: 10,
        backgroundColor: "#f0f0f0",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflowX: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: 3,
        }}
      >
      </Box>

      <Card
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: "30px",
          width: "100%",
          height: "100%",
          textAlign: "left",
          position: "relative",
          transition: "all 0.3s ease",
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          p: 3,
          overflow: "auto",
          display: "-ms-inline-flexbox",
          margin: "0 auto",
        }}
      >

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            p: 0,
          }}
        >
          {/* Contenedor para los 4 FormControl en horizontal */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2, // Espaciado entre los FormControl
              alignItems: "center",
              flexWrap: "wrap", // Asegura que los elementos se ajusten en pantallas pequeñas
              mb: 2,
            }}
          >
            {/* Primer FormControl */}
            <FormControl sx={{ minWidth: 250, height: 10 }}>
              <InputLabel id="cuota-label2">Año</InputLabel>
              <Select
                value={anio}
                onChange={manejarAnioCambio}
                label="Año"
              >
                {[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012].map(año => (
                  <MenuItem key={año} value={año}>{año}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Segundo FormControl */}
            <FormControl sx={{ minWidth: 250, height: 10 }}>
              <InputLabel id="cuota-label2">Mes</InputLabel>
              <Select
                value={mes}
                onChange={manejarMesCambio}
                label="Mes"
              >
                {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map(mesNombre => (
                  <MenuItem key={mesNombre} value={mesNombre}>{mesNombre}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Contenedor para los botones */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column", // Alinea los botones en columna
              gap: 2,
              alignItems: "center",
              ml: "auto",
            }}
          >
            {/* Contenedor para "Exportar" y "Imprimir" en fila horizontal */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
              }}
            >
              {/* Formulario para el Select "Exportar" */}
              <FormControl
                variant="outlined"
                sx={{
                  minWidth: 130,
                  height: "37px",
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#dcdcdc',
                    },
                    '&:hover fieldset': {
                      borderColor: '#dcdcdc',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#dcdcdc',
                      boxShadow: 'none',
                    },
                  },
                }}
              >
                <Select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as string)}
                  displayEmpty
                  sx={{
                    backgroundColor: "white",
                    "&:hover": {
                      backgroundColor: "#e0e0e0",
                    },
                    height: "37px",
                    minWidth: "120px",
                    borderRadius: "30px",
                    color: exportFormat ? "#000" : "#999",
                    '& .MuiSelect-icon': {
                      color: '#000',
                    },
                  }}
                >
                  <MenuItem disabled value="">
                    Exportar
                  </MenuItem>
                  <MenuItem value="pdf">PDF</MenuItem>
                  <MenuItem value="excel">Excel</MenuItem>
                </Select>
              </FormControl>

              {/* Botón "Imprimir" */}
              <Button
                variant="contained"
                startIcon={<Card />}
                sx={{
                  backgroundColor: "#388e3c",
                  "&:hover": {
                    backgroundColor: "#2c6d33",
                  },
                  height: "40px",
                  minWidth: "170px",
                  borderRadius: "30px",
                }}
                onClick={handleExport}
              >
                Imprimir
              </Button>
            </Box>

            {/* Botón "Generar Cuota" debajo del botón "Imprimir" */}
            <Button
              variant="contained"
              startIcon={<GridAddIcon />}
              sx={{
                backgroundColor: "#388e3c",
                "&:hover": {
                  backgroundColor: "#2c6d33",
                },
                height: "40px",
                minWidth: "120px",
                borderRadius: "30px",
                ml: "150px",
                mt: 4
              }}
              onClick={handleOpen}
            >
              Generar Cuota
            </Button>
          </Box>
        </Box>

        <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 'none' }}>
          <TableContainer sx={{ maxHeight: '100%', borderRadius: '5px', border: 'none' }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                      sx={{
                        fontWeight: 'bold',
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.numero}>
                      {columns.map((column) => {
                        const value = column.id === 'accion' ? '' : (row as any)[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                          >
                            {column.id === 'accion' ? (
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton aria-label="save " sx={{ color: 'green' }}>
                                  <SaveAs />
                                </IconButton>
                                <IconButton aria-label="delete" sx={{ color: 'black' }}>
                                  <DeleteForever />
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

          <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginTop: 3 }}>
            <Pagination count={10} color="primary" sx={{ marginLeft: '25%' }} />
          </Box>
        </Paper>
      </Card>
    </Box>
  );
}

export default TablaAperturarDeuda;
