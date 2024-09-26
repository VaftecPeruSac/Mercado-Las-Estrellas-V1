import React, { useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import TemporizadorInactividad from "../context/TemporizadorInactividad";

const Principal = () => {

  // Variables para el responsive
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Estado para abrir y cerrar el drawer
  const [open, setOpen] = useState(false);

  // Función para abrir y cerrar el drawer
  const toggleDrawer = () => {
    setOpen(!open);
  };

  // Iniciamos el temporizador de inactividad en 30 minutos
  // con una alerta a los 5 minutos antes de cerrar sesión
  TemporizadorInactividad(30 * 60 * 1000, 5 * 60 * 1000);

  return (
    <>

      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Header
          open={open}
          toggleDrawer={toggleDrawer}
        />
        <Box
          sx={{
            flexGrow: 1,
            p: isMobile ? 0 : 3,
            pt: isMobile ? 2 : 3,
            pb: 0,
            transition: "margin-left 0.3s",
            marginLeft: open ? "260px" : "0px",
          }}
        >
          {/* <Dashboard /> */}
          <Outlet />
        </Box>
      </Box>

    </>
  );
};

export default Principal;