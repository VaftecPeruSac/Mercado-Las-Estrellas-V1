import React, { useState } from "react";
import { Box } from "@mui/material";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import TemporizadorInactividad from "../context/TemporizadorInactividad";
import useResponsive from "../hooks/Responsive/useResponsive";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Principal = () => {

  // Variables para el responsive
  const { isLaptop, isTablet, isMobile } = useResponsive();

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
            p: isLaptop || isTablet || isMobile ? 0 : 3,
            pt: isTablet || isMobile ? 2 : 3,
            pb: 0,
            transition: "margin-left 0.3s",
            marginLeft: open ? "260px" : "0px",
          }}
        >

          <Outlet />

          <ToastContainer
            style={{ marginTop: "100px" }}
            position="top-right"
            autoClose={10 * 1000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            theme="light"
          />

        </Box>
      </Box>
    </>
  );
};

export default Principal;