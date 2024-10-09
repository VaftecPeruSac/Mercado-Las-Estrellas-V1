import { Box } from '@mui/material'
import React from 'react'
import useResponsive from '../../hooks/Responsive/useResponsive';

interface ContenedorBotonesProps {
  children: React.ReactNode;
}

const ContenedorBotones: React.FC<ContenedorBotonesProps> = ({ children }) => {

  const { isTablet, isMobile } = useResponsive();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isTablet ? "column" : { xs: "column", sm: "row" }, // Columna en mobile, fila en desktop
        justifyContent: "space-between",
        alignItems: "center",
        mb: isMobile ? 2 : 3,
        p: 0,
      }}
    >

      {children}

    </Box>
  );

}

export default ContenedorBotones;
