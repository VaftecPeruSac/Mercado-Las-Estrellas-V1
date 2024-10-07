import React from 'react'
import useResponsive from '../Responsive';
import { Box, Button, FormControl, MenuItem, Select } from '@mui/material';
import { Download } from '@mui/icons-material';

interface BotonExportarProps {
  exportFormat: string;
  setExportFormat: (format: string) => void;
  handleExport: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const BotonExportar: React.FC<BotonExportarProps> = ({ exportFormat, setExportFormat, handleExport }) => {
  
  const { isTablet, isMobile } = useResponsive();

  return (
    <Box
      sx={{
        width: isTablet ? "100%" : isMobile ? "100%" : "auto", // Ancho del contenedor
        display: "flex",
        gap: 2,
        alignItems: "center",
        ml: isMobile ? 0 : "auto",
      }}
    >
      <FormControl
        variant="outlined"
        sx={{
          width: isTablet || isMobile ? "50%" : "150px",
          height: "50px",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#dcdcdc", // Color del borde inicial (gris claro)
            },
            "&:hover fieldset": {
              borderColor: "#dcdcdc", // Color del borde al hacer hover (gris claro)
            },
            "&.Mui-focused fieldset": {
              borderColor: "#dcdcdc", // Color del borde cuando está enfocado (gris claro)
              boxShadow: "none", // Elimina la sombra del enfoque
            },
          },
        }}
      >
        <Select
          value={ exportFormat }
          onChange={(e) => setExportFormat(e.target.value)}
          displayEmpty
          sx={{
            backgroundColor: "white", // Color de fondo suave y clásico
            "&:hover": {
              backgroundColor: "#e0e0e0", // Cambio sutil al hacer hover
            },
            height: "50px",
            width: "100%",
            padding: "0 15px",
            borderRadius: "30px",
            color: exportFormat ? "#000" : "#999", // Texto negro si hay selección, gris si es el placeholder
            "& .MuiSelect-icon": {
              color: "#000", // Color del icono del menú desplegable
            },
          }}
        >
          <MenuItem disabled value="">Exportar</MenuItem>
          <MenuItem value="1">PDF</MenuItem>
          <MenuItem value="2">Excel</MenuItem>
        </Select>
      </FormControl>

      <Button
        variant="contained"
        startIcon={<Download />}
        sx={{
          backgroundColor: "#008001",
          "&:hover": {
            backgroundColor: "#2c6d33",
          },
          height: "50px",
          width: isTablet || isMobile ? "50%" : "200px",
          borderRadius: "30px",
          fontSize: isMobile ? "0.8rem" : "auto"
        }}
        disabled={ exportFormat === "" }
        onClick={ handleExport }
      >
        Descargar
      </Button>
    </Box>
  );
}

export default BotonExportar;