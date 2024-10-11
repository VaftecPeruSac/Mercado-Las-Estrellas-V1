import { Box } from '@mui/material'
import React from 'react'
import useResponsive from '../../hooks/Responsive/useResponsive';

interface ContenedorBotonesProps {
  reporte?: boolean;
  children: React.ReactNode;
}

const ContenedorBotones: React.FC<ContenedorBotonesProps> = ({ reporte, children }) => {

  const { isTablet, isMobile } = useResponsive();

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: isTablet || isMobile ? "column" : "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: reporte ? "1px solid rgba(0, 0, 0, 0.25)" : "none",
        mb: isMobile ? 2 : 3,
        p: 0,
        pb: reporte ? 1 : 0,
      }}
    >

      {children}

    </Box>
  );

}

export default ContenedorBotones;
