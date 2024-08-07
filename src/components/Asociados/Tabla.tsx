import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import {
  Button,
  IconButton,
  Stack,
  Typography,
  Box,
  Divider,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { Edit, Search as SearchIcon } from "@mui/icons-material";

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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: SelectChangeEvent<number>) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0); // Reset page to 0 when changing rows per page
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 5,
        pt: 10,
        backgroundColor: "#f0f0f0",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography variant="h4">MANTENIMIENTO DE SOCIOS</Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            <Button
              variant="outlined"
              startIcon={<Edit />}
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
        <Divider sx={{ mb: 2, mt: 1 }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            mt: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", minWidth: 250 }}>
            <Typography sx={{ mr: 1, fontWeight: "bold" }}>Mostrar</Typography>
            <FormControl
              sx={{
                minWidth: 80, // Reducción del ancho mínimo para que el Select sea más corto
                mr: 2,
                "& .MuiSelect-root": {
                  padding: "8px 12px", // Ajuste del padding para que coincida con el TextField
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.23)", // Color del borde
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.87)", // Color del borde en hover
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.87)", // Color del borde cuando está enfocado
                  },
                },
              }}
            >
              <Select
                id="rows-per-page-select"
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
                inputProps={{ "aria-label": "Mostrar registros" }}
                variant="outlined" // Para que coincida con el TextField
                sx={{
                  "& .MuiSelect-select": {
                    padding: "8px 12px", // Ajuste de padding para el Select
                  },
                }}
              >
                {[5, 10, 20].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography sx={{ ml: -1, fontWeight: "bold" }}>
              Registros
            </Typography>
          </Box>
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
              width: "350px",
              display: "inline-flex",

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
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={() => {}} // No usar onRowsPerPageChange aquí, ya que el manejo está en el Select
          labelRowsPerPage="Mostrar"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      </Paper>
    </Box>
  );
}
