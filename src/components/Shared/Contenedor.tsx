import { Box, Card } from "@mui/material";
import useResponsive from "../Responsive";

interface ContenedorProps {
  children: React.ReactNode;
}

const Contenedor: React.FC<ContenedorProps> = ({ children }) => {

  const { isSmallTablet, isMobile, isSmallMobile } = useResponsive();

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: isSmallMobile ? 2 : 3,
        pt: isSmallMobile ? 18 : isSmallTablet || isMobile ? 20 : 14,
        backgroundColor: "#f0f0f0",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflowX: "auto",
      }}
    >

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
          p: isSmallMobile ? 2 : 3,
          overflow: "auto",
          display: "-ms-inline-flexbox",
          margin: "0 auto",
          // Centra el Card horizontalmente y añade espacio a los lados
        }}
      >

        {children}

      </Card>

    </Box>
  );

}

export default Contenedor;