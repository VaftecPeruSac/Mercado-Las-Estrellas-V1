import { Button } from '@mui/material';
import { GridAddIcon } from '@mui/x-data-grid';
import React from 'react'
import useResponsive from '../Responsive';

interface BotonAgregarProps {
  handleAction: (e: React.MouseEvent<HTMLButtonElement>) => void;
  texto: string;
}

const BotonAgregar: React.FC<BotonAgregarProps> = ({ handleAction, texto }) => {

  const { isTablet, isMobile } = useResponsive();

  return (
    <Button
      variant="contained"
      startIcon={<GridAddIcon />}
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