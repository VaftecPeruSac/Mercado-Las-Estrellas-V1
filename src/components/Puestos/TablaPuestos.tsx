import { DeleteForever, Print, SaveAs } from '@mui/icons-material';
import { Box, Button, Card, FormControl, IconButton, MenuItem, Pagination, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { GridAddIcon } from '@mui/x-data-grid';
import React, { useState } from 'react'

interface Column {
  id: keyof Data | "accion";
  label: string;
  minWidth?: number;
  align?: "center";
}

interface Data {
  bloque: string;
  numero_puesto: string;
  area: string;
  giro_negocio: string;
  socio: string;
  inquilino: string;
  estado: string;
  fecha_registro: string;
}

const columns: readonly Column[] = [
  {
    id: "bloque", 
    label: "Bloque", 
    minWidth: 50, 
    align: "center" 
  },
  {
    id: "numero_puesto", 
    label: "N° Puesto", 
    minWidth: 50, 
    align: "center" 
  },
  {
    id: "area", 
    label: "Área", 
    minWidth: 50, 
    align: "center" 
  },
  {
    id: "giro_negocio", 
    label: "Giro de Negocio", 
    minWidth: 50, 
    align: "center" 
  },
  {
    id: "socio", 
    label: "Socio", 
    minWidth: 50, 
    align: "center" 
  },
  {
    id: "inquilino", 
    label: "Inquilino", 
    minWidth: 50, 
    align: "center" 
  },
  {
    id: "estado", 
    label: "Estado", 
    minWidth: 50, 
    align: "center" 
  },
  {
    id: "fecha_registro", 
    label: "Fecha Registro", 
    minWidth: 50, 
    align: "center" 
  },
  {
    id: "accion", 
    label: "Acciones", 
    minWidth: 50, 
    align: "center" 
  },
]

const initialRows: Data[] = [
  {
    bloque: "1er Piso",
    numero_puesto: "A-1",
    area: "16m2",
    giro_negocio: "venta de abarrotes",
    socio: "Juanito Gomez",
    inquilino: "No",
    estado: "Ocupado",
    fecha_registro: "28-08-2024"
  }
]

const TablaPuestos: React.FC = () => {

  // Para la tabla
  const [rows, setRows] = useState<Data[]>(initialRows);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Para el modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Para exportar la información
  const [exportFormat, setExportFormat] = useState<string>("");

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
          textAlign: "center",
          position: "relative",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          p: 3,
          overflow: "auto",
          display: "-ms-inline-flexbox",
          margin: "0 auto",
          // Centra el Card horizontalmente y añade espacio a los lados
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            P: 0,
          }}
        >
          {/* Botón "Agregar Puesto" */}
          <Button
            variant="contained"
            startIcon={<GridAddIcon />}
            sx={{
              backgroundColor: "#008001",
              "&:hover": {
                backgroundColor: "#2c6d33",
              },
              height: "50px",
              width: "230px",
              borderRadius: "30px",
            }}
            onClick={handleOpen}
          >
            Agregar Puesto
          </Button>

          {/* <RegistrarPuesto open={open} handleClose={handleClose} /> */}

          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              ml: "auto",
            }}
          >

            {/* Formulario para el Select "Exportar" */}
            <FormControl
              variant="outlined"
              sx={{
                minWidth: "150px",
                height: "50px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#dcdcdc",
                  },
                  "&:hover fieldset": {
                    borderColor: "#dcdcdc",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#dcdcdc",
                    boxShadow: "none",
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
                  height: "50px",
                  minWidth: "120px",
                  padding: "0 15px",
                  borderRadius: "30px",
                  color: exportFormat ? "#000" : "#999",
                  "& .MuiSelect-icon": {
                    color: "#000",
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
              startIcon={<Print />}
              sx={{
                backgroundColor: "#008001",
                "&:hover": {
                  backgroundColor: "#2c6d33",
                },
                height: "50px",
                width: "200px",
                borderRadius: "30px",
              }}
              onClick={handleExport}
            >
              Imprimir
            </Button>
          </Box>
        </Box>

        {/* Tabla */}
        <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: "none" }}>
          <TableContainer
            sx={{ maxHeight: "100%", borderRadius: "5px", border: "none" }}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
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
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                    >
                      {columns.map((column) => {
                        const value = column.id === "accion" ? "" : (row as any)[column.id];
                        return (
                          <TableCell key={column.id} align="center">
                            {/* Acciones */}
                            {column.id === "accion" ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 1,
                                  justifyContent: "center",
                                }}
                              >
                                <IconButton
                                  aria-label="save "
                                  sx={{ color: "#0478E3" }}
                                >
                                  <SaveAs />
                                </IconButton>
                                <IconButton
                                  aria-label="delete"
                                  sx={{ color: "red" }}
                                >
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

          <Box sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}>
            <Pagination count={10} color="primary" />
          </Box>
        </Paper>
      </Card>
    </Box>
  )
}

export default TablaPuestos;
