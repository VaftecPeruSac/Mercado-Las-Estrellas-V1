import { Box, Card } from "@mui/material";
import useResponsive from "../../hooks/Responsive/useResponsive";

interface ContenedorProps {
  children: React.ReactNode;
}

const ContenedorMini: React.FC<ContenedorProps> = ({ children }) => {

  const { isSmallTablet, isMobile, isSmallMobile } = useResponsive();

  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: "#f0f0f0",
        display: "flex",
        flexDirection: "column",
        overflowX: "auto",
      }}
    >

      <Card
        sx={{
          backgroundColor: "#ffffff",
          width: "100%",
          textAlign: "left",
          position: "relative",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          p: isSmallMobile ? 2 : 3,
          overflow: "auto",
          display: "-ms-inline-flexbox",
          margin: "0 auto",
        }}
      >

        {children}

      </Card>

    </Box>
  );

}

export default ContenedorMini;