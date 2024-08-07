import * as React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Button,
  IconButton,
  Typography,
  Box,
  Divider,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useMediaQuery,
  Modal,
  Grid,
  Container,
} from "@mui/material";
import { Edit, Search as SearchIcon } from "@mui/icons-material";
import { GridAddIcon } from "@mui/x-data-grid";
import { useTheme } from '@mui/material/styles';

interface Column {
  id: keyof Data | 'accion';
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: any) => string;
}

interface Data {
  id: number;
  socio: string;
  puesto: string;
  dni: string;
  block: string;
  giro: string;
  telefono: string;
  correo: string;
  ano: number;
  status: string;
  monto_actual: string;
}

const columns: readonly Column[] = [
  { id: "socio", label: "Socio", minWidth: 70 },
  { id: "puesto", label: "Puesto", minWidth: 90 },
  { id: "dni", label: "DNI", minWidth: 130 },
  { id: "block", label: "Block", minWidth: 130 },
  { id: "giro", label: "Giro", minWidth: 130 },
  { id: "telefono", label: "Telefono", minWidth: 130 },
  { id: "correo", label: "Correo", minWidth: 130 },
  { id: "ano", label: "Año", minWidth: 130 },
  { id: "monto_actual", label: "Monto Actual", minWidth: 130 },
  { id: "status", label: "Status", minWidth: 130 },
  { id: "accion", label: "Accion", minWidth: 130 },
];

const rows: Data[] = [
  {
    id: 1,
    socio: "Juan Ramiro",
    puesto: "A-4",
    dni: "772834491",
    block: "1",
    giro: "carne",
    telefono: "eliminar",
    correo: "juan.perez@example.com",
    ano: 2012,
    status: "Activo",
    monto_actual: "1200",
  },
  {
    id: 2,
    socio: "Alberth Gonzales",
    puesto: "A-3",
    dni: "772834491",
    block: "2",
    giro: "abarrotes",
    telefono: "eliminar",
    correo: "juan.perez@example.com",
    ano: 2013,
    status: "inactivo",
    monto_actual: "2300",
  },
];

export default function   StickyHeadTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchValue, setSearchValue] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<{ value: unknown }>) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0); // Reset page to 0 when changing rows per page
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        pt: 10, // Espacio adicional en la parte superior para crear un margen con el Header
        backgroundColor: "#f0f0f0",
        minHeight: "50vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: 2,
        }}
      >
        <Typography variant="h4" sx={{ mb: { xs: 2, sm: 0 } }}>
          MANTENIMIENTO DE SOCIOS
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            fontWeight: "bold",
          }}
        >
          <Button
            variant="outlined"
            startIcon={<GridAddIcon />}
            sx={{
              color: "white",
              boxShadow: 1,
              backgroundColor: "#d32f2f",
              "&:hover": {
                backgroundColor: "darkred",
              },
              height: "40px",
              minWidth: "120px",
              marginRight: 2,
            }}
            onClick={handleOpen}
          >
            Nuevo Registro
          </Button>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            sx={{
              color: "black",
              boxShadow: 1,
              height: "60px",
              minWidth: "150px",
              backgroundColor: "rgb(255 215 0)",
              "&:hover": {
                backgroundColor: "white",
              },
            }}
          >
            Relacion de Puestos
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          mb: 3,
        }}
      >
        <Divider sx={{ mb: 2, mt: 1 }} />
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: { xs: "flex-start", sm: "space-between" },
            alignItems: { xs: "flex-start", sm: "center" },
            mb: 3,
            mt: 1,
          }}
        >
          <Box sx={{ flexGrow: 1 }} />
          <TextField
            variant="outlined"
            placeholder="Buscar..."
            value={searchValue}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: {
                padding: "8px 12px",
              },
            }}
            sx={{
              width: { xs: "100%", sm: "350px" },
              display: "inline-flex",
              mb: { xs: 2, sm: 0 },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.23)",
                },
                "& input": {
                  padding: "1px ",
                },
              },
            }}
          />
        </Box>
      </Box>
      <Paper sx={{ width: "100%", overflow: "hidden", mt: -3 }}>
        <TableContainer sx={{ maxHeight: 450, borderRadius: "5px" }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    sx={{ backgroundColor: "green", color: "white" }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={0} key={row.id}>
                      {columns.map((column) => {
                        if (column.id === 'accion') {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <IconButton
                                sx={{
                                  backgroundColor: "#3e70f9de"
                                }}
                              >
                                <Edit />
                              </IconButton>
                            </TableCell>
                          );
                        }
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.id === "status" ? (
                              <Button
                                variant="contained"
                                sx={{
                                  backgroundColor:
                                    value === "Activo" ? "green" : "red",
                                  color: "white",
                                  pointerEvents: "none",
                                }}
                              >
                                {value}
                              </Button>
                            ) : column.format && typeof value === "number" ? (
                              column.format(value)
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
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ backgroundColor: "white", fontSize: "14px" }}
        />
      </Paper>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 400 },
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Nuevo Registro
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <TextField label="Nombre" />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <TextField label="Email" />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <TextField label="Teléfono" />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Estatus</InputLabel>
            <Select label="Estatus">
              <MenuItem value="Activo">Activo</MenuItem>
              <MenuItem value="Inactivo">Inactivo</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" onClick={handleClose}>
              Guardar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
