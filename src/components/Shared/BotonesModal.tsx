import { Box, Button } from "@mui/material";
import React from "react";
import useResponsive from "../Responsive";

interface BotonesModalProps {
  loading: boolean;
  action: (e: React.MouseEvent<HTMLButtonElement>) => void;
  close: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const BotonesModal: React.FC<BotonesModalProps> = ({
  loading,
  action,
  close,
}) => {
  const { isTablet, isMobile } = useResponsive();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isTablet || isMobile ? "center" : "flex-end",
        mt: "auto",
        p: isTablet || isMobile ? "20px 0px 0px 0px" : "20px 58px 0 58px",
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Button
        variant="contained"
        sx={{
          width: "140px",
          height: "45px",
          backgroundColor: "#202123",
          color: "#fff",
          mr: 1,
          "&:hover": {
            backgroundColor: "#3F4145",
          },
        }}
        onClick={close}
        disabled={loading}
      >
        Cerrar
      </Button>
      <Button
        variant="contained"
        sx={{
          width: "140px",
          height: "45px",
          backgroundColor: "#008001",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#388E3C",
          },
        }}
        onClick={action}
        disabled={loading}
      >
        {loading ? "Cargando..." : "Registrar"}
      </Button>
    </Box>
  );
};

export default BotonesModal;
