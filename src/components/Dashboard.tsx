import React from "react";
import { Box, Typography, Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SchoolIcon from "@mui/icons-material/School";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupIcon from "@mui/icons-material/Group";

const Dashboard: React.FC = () => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        pt: 10, // Espacio adicional en la parte superior para crear un margen con el Header
        backgroundColor: "#f0f0f0",
        minHeight: "50vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          mb: 3,
          gap: "1rem",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#800080",
            color: "#FFFFFF",
            padding: "1rem",
            borderRadius: "8px",
            width: "300px",
            textAlign: "center",
            position: "relative",
          }}
        >
          <Typography
            variant="h6"
            sx={{ position: "absolute", top: "10px", left: "10px" }}
          >
            4
          </Typography>
          <SchoolIcon
            sx={{
              position: "absolute",
              top: "10px",
              right: "10px",
              fontSize: "40px",
              opacity: 0.3,
            }}
          />
          <Typography variant="subtitle1" sx={{ mt: "50px" }}>
            Contratos Registrados
          </Typography>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={{
              mt: 2,
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              color: "#FFFFFF",
            }}
          >
            Ver Más
          </Button>
        </Box>

        <Box
          sx={{
            backgroundColor: "#008000",
            color: "#FFFFFF",
            padding: "1rem",
            borderRadius: "8px",
            width: "300px",
            textAlign: "center",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{ position: "absolute", top: "10px", left: "10px" }}
          >
            ₹185358
          </Typography>
          <MonetizationOnIcon
            sx={{
              position: "absolute",
              top: "10px",
              right: "10px",
              fontSize: "40px",
              opacity: 0.3,
            }}
          />
          <Typography variant="subtitle1" sx={{ mt: "50px" }}>
            Today's Collection
          </Typography>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={{
              mt: 2,
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              color: "#FFFFFF",
            }}
          >
            Ver Más
          </Button>
        </Box>

        <Box
          sx={{
            backgroundColor: "#FFFF00",
            color: "#000000",
            padding: "1rem",
            borderRadius: "8px",
            width: "300px",
            textAlign: "center",
            position: "relative",
          }}
        >
          <Typography
            variant="h6"
            sx={{ position: "absolute", top: "10px", left: "10px" }}
          >
            5464
          </Typography>
          <PersonAddIcon
            sx={{
              position: "absolute",
              top: "10px",
              right: "10px",
              fontSize: "40px",
              opacity: 0.3,
            }}
          />
          <Typography variant="subtitle1" sx={{ mt: "50px" }}>
            New Admissions
          </Typography>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={{
              mt: 2,
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              color: "#000000",
            }}
          >
            Ver Más
          </Button>
        </Box>

        <Box
          sx={{
            backgroundColor: "#FF0000",
            color: "#FFFFFF",
            padding: "1rem",
            borderRadius: "8px",
            width: "300px",
            textAlign: "center",
            position: "relative",
          }}
        >
          <Typography
            variant="h6"
            sx={{ position: "absolute", top: "10px", left: "10px" }}
          >
            723
          </Typography>
          <GroupIcon
            sx={{
              position: "absolute",
              top: "10px",
              right: "10px",
              fontSize: "40px",
              opacity: 0.3,
            }}
          />
          <Typography variant="subtitle1" sx={{ mt: "50px" }}>
            Faculty Strength
          </Typography>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={{
              mt: 2,
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              color: "#FFFFFF",
            }}
          >
            Ver Más
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          backgroundColor: "#FFFFFF",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: 0,
          width: "100%",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
          Bienvenido al Sistema de Control de Pagos de Socios
        </Typography>
        <Typography variant="body1">--</Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;
