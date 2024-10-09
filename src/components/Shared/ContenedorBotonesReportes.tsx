import { Box } from '@mui/material'
import React from 'react'
import useResponsive from '../../hooks/Responsive/useResponsive';

interface ContenedorBotonesReportesProps {
  children: React.ReactNode;
}

const ContenedorBotonesReportes: React.FC<ContenedorBotonesReportesProps> = ({ children }) => {

  const { isTablet, isMobile } = useResponsive();

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: isTablet || isMobile ? "column" : "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid rgba(0, 0, 0, 0.25)",
        mb: isMobile ? 2 : 3,
        p: 0,
        pb: 1,
      }}
    >

      {children}

    </Box>
  );

}

export default ContenedorBotonesReportes;
