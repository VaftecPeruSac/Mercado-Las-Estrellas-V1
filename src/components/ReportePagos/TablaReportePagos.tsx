import { Person, Print } from '@mui/icons-material';
import { Box, Button, Card, FormControl, InputLabel, MenuItem, Paper, Select, TableContainer } from '@mui/material';
import React, { useState } from 'react'

interface Column {
  id: keyof Data | "accion";
  label: string;
  minWidth?: number;
  align?: "center";
}

interface Data {
  id_deuda: string;
  numero_puesto: string;
  nombre_socio: string;
  dni: string;
  fecha: string;
  telefono: string;
  correo: string;
  saldo_a_cuenta: string;
  monto_actual: string;
}

const TablaReportePagos: React.FC = () => {

  // Para exportar
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
      />
      
      <Card
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: "30px",
          width: "100%",
          height: "100%",
          textAlign: "left",
          position: "relative",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
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
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              ml: "10px",
              mr: "auto",
            }}
          >
            {/* Seleccionar socio */}
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
            {/* Botón "Generar Reporte" */}
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#008001",
                "&:hover": {
                  backgroundColor: "#2c6d33",
                },
                height: "50px",
                width: "150px",
                borderRadius: "30px",
              }}
              // onClick={}
            >
              Generar
            </Button>
          </Box>
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

        {/* Tabla reporte pagos */}
        <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: "none" }}>
          <TableContainer sx={{ maxHeight: "100%", borderRadius: "5px", border: "none" }}>
          </TableContainer>
        </Paper>
      </Card>
    </Box>
  );

}

export default TablaReportePagos;