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
  Typography,
  Box,
  Card,
  Stack,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  Modal,
} from "@mui/material";
import { Edit, Download, FileCopy, WhatsApp, PictureAsPdf, Print } from "@mui/icons-material";
import { GridAddIcon } from "@mui/x-data-grid";

interface Column {
  id: keyof Data | "accion";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: any) => string;
}

interface Data {
  socio: string;
  puesto: string;
  dni: string;
  block: string;
  giro: string;
  telefono: string;
  correo: string;
  inquilino: string;
  cuotas_extra: string;
  fecha: string;
  pagar: string;
  deuda_total: string;
}

const columns: readonly Column[] = [
  { id: "socio", label: "Socio", minWidth: 70 },
  { id: "puesto", label: "Puesto", minWidth: 90 },
  { id: "dni", label: "DNI", minWidth: 130 },
  { id: "block", label: "Block", minWidth: 130 },
  { id: "giro", label: "Giro", minWidth: 130 },
  { id: "telefono", label: "Teléfono", minWidth: 130 },
  { id: "correo", label: "Correo", minWidth: 130 },
  { id: "inquilino", label: "Inquilino", minWidth: 130 },
  { id: "cuotas_extra", label: "Cuotas Extraordinarias", minWidth: 130 },
  { id: "fecha", label: "Fecha", minWidth: 130 },
  { id: "pagar", label: "Pagar", minWidth: 130 },
  { id: "deuda_total", label: "Deuda Total", minWidth: 130 },
  { id: "accion", label: "Acción", minWidth: 130 },
];

const rows: Data[] = [
  {
    socio: "Juan Ramiro",
    puesto: "A-4",
    dni: "772834491",
    block: "1",
    giro: "Carne",
    telefono: "912345678",
    correo: "juan.perez@example.com",
    inquilino: "Sí",
    cuotas_extra: "500",
    fecha: "2024-07-04",
    pagar: "No",
    deuda_total: "1200",
  },
  {
    socio: "Alberth Gonzales",
    puesto: "A-3",
    dni: "772834492",
    block: "2",
    giro: "Abarrotes",
    telefono: "912345679",
    correo: "alberth.gonzales@example.com",
    inquilino: "No",
    cuotas_extra: "300",
    fecha: "2024-07-05",
    pagar: "Sí",
    deuda_total: "2300",
  },
];

export default function StickyHeadTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchValue, setSearchValue] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [exportFormat, setExportFormat] = React.useState("");

  const handleOpen = () => setOpen(true);
  const handleExport = () => {
    // Implement your export logic here
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
        {/* Título opcional */}
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
          margin: "0 auto", // Centra el Card horizontalmente y añade espacio a los lados

        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
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
              marginBottom: { xs: 2, sm: 0 },
              borderRadius: "30px",
            }}
            onClick={handleOpen}
          >
            Agregar Socio
          </Button>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              ml: "auto",
            }}
          >
            <FormControl variant="outlined" sx={{ minWidth: 120 }}>
              <InputLabel>Exportar</InputLabel>
              <Select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                label="Exportar"
                sx={{
                  backgroundColor: "#e0e0e0",
                  "&:hover": {
                    backgroundColor: "#d0d0d0",
                  },
                  borderRadius: "30px",
                }}
              >
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="word">Word</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              startIcon={<Print />}
              sx={{
                backgroundColor: "#1976d2",
                "&:hover": {
                  backgroundColor: "#1565c0",
                },
                height: "40px",
                minWidth: "120px",
                borderRadius: "30px",
              }}
            >
              Imprimir
            </Button>
          </Box>
        </Box>
        <Paper sx={{ width: "100%", overflow: "hidden", p: 2 }}>
          <TableContainer sx={{ maxHeight: "100%", borderRadius: "5px", padding: "10px" }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                      sx={{
                        backgroundColor: "#e8f5e20",
                        color: "#000",
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
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
                  .map((row) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.socio}>
                        {columns.map((column) => {
                          const value =
                            column.id === "accion"
                              ? ""
                              : (row as any)[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.id === "cuotas_extra" ? (
                                <IconButton>
                                  <PictureAsPdf />
                                </IconButton>
                              ) : column.id === "pagar" ? (
                                <IconButton>
                                  <Download />
                                </IconButton>
                              ) : column.id === "accion" ? (
                                <Box sx={{ display: "flex", gap: 1 }}>
                                  <IconButton aria-label="edit">
                                    <Edit />
                                  </IconButton>
                                  <IconButton aria-label="copy">
                                    <FileCopy />
                                  </IconButton>
                                  <IconButton aria-label="whatsapp">
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
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
            <Pagination
              // count={Math.ceil(rows.length / rowsPerPage)}
              count={10}
              color="primary"
              // onChange={(event, newPage) => setPage(10)}
              sx={{ margin: "auto" }}
            />
          </Box>
        </Paper>
      </Card>

      {/* Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
            width: '80%',
            maxWidth: 600,
          }}
        >
          <Typography variant="h6">Exportar Datos</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
            <FormControl variant="outlined" sx={{ mb: 2 }}>
              <InputLabel>Formato</InputLabel>
              <Select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                label="Formato"
              >
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="excel">Excel</MenuItem>
                <MenuItem value="csv">CSV</MenuItem>
              </Select>
            </FormControl>
            <Button onClick={handleExport} sx={{ mt: 2 }}>
              Exportar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
