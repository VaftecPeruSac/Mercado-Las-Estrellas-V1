import { Button } from '@mui/material';
import React from 'react'
import useResponsive from '../../hooks/Responsive/useResponsive';
import { AddCircle, Assignment } from '@mui/icons-material';

interface BotonAgregarProps {
  exportar?: boolean;
  handleAction: (e: React.MouseEvent<HTMLButtonElement>) => void;
  texto: string;
}

const BotonAgregar: React.FC<BotonAgregarProps> = ({ exportar, handleAction, texto }) => {

  const { isTablet, isMobile } = useResponsive();

  return (
    <Button
      variant="contained"
      startIcon={ exportar ? <Assignment /> : <AddCircle /> }
      sx={{
        backgroundColor: "#008001",
        "&:hover": {
          backgroundColor: "#2c6d33",
        },
        height: "50px",
        width: isTablet || isMobile ? "100%" : "230px",
        marginBottom: isTablet || isMobile ? "1em" : "0",
        borderRadius: "30px",
      }}
      onClick={handleAction}
    >
      {texto}
    </Button>
  );

}

export default BotonAgregar;