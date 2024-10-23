import React, { Fragment, useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Drawer,
  CssBaseline,
  Menu,
  MenuItem,
  Avatar,
  Popover,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Sidebar from "./Sidebar";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { ExpandLess, NotificationsActive, NotificationsNone } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useResponsive from "../hooks/Responsive/useResponsive";
import { mostrarAlertaConfirmacion } from "./Alerts/Registrar";
import { getDiaNotificacion, getNotificacionRandom, notificacionesPredefinidas } from "../Utils/notificaciones";
import { toast } from "react-toastify";

interface HeaderProps {
  open: boolean;
  toggleDrawer: () => void;
}

const Header: React.FC<HeaderProps> = ({ open, toggleDrawer }) => {

  const { isLaptop, isTablet, isMobile, isSmallMobile } = useResponsive();
  const { usuario, logout } = useAuth();

  const [menuUsuario, setMenuUsuario] = useState<null | HTMLElement>(null);
  const [menuNotificaciones, setMenuNotificaciones] = useState<null | HTMLElement>(null);

  const [notificaciones, setNotificaciones] = useState<string[]>([]);

  const navigate = useNavigate();

  const handleNotifcacionesOpen = (e: React.MouseEvent<HTMLElement>) => {
    setMenuNotificaciones(e.currentTarget);
  }

  const handleMenuUsuarioOpen = (e: React.MouseEvent<HTMLElement>) => {
    setMenuUsuario(e.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuUsuario(null);
    setMenuNotificaciones(null);
  };

  const handleCerrarSesion = () => {
    mostrarAlertaConfirmacion(
      "¿Desea cerrar sesión?", "Por favor confirme su acción.", "Cerrar sesión", "Cancelar"
    ).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/");
      }
    });
  };

  useEffect(() => {

    const diaHoy = new Date().getDate();
    const fechaNotificacion = getDiaNotificacion();

    if (diaHoy >= fechaNotificacion) {
      setNotificaciones((prev) => {
        const nuevasNotificaciones = notificacionesPredefinidas.filter(
          (notificacion) => !prev.includes(notificacion)
        );
        return [...prev, ...nuevasNotificaciones];
      });
    }

    const interval = setInterval(() => {
      const nuevaNotificacion = getNotificacionRandom();
      setNotificaciones((prev) => {
        toast.info(nuevaNotificacion);
        if (!prev.includes(nuevaNotificacion)) {
          return [...prev, nuevaNotificacion];
        }
        return prev;
      });
    }, 15 * 60 * 1000); // 15 minutos

    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "white",
          zIndex: (theme) => theme.zIndex.drawer - 1,
        }}
      >
        <Toolbar
          sx={{
            justifyContent: isMobile ? "none" : "space-between",
            py: isSmallMobile ? 1 : 2.5,
            paddingRight: 0,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              edge="start"
              aria-label="menu"
              onClick={toggleDrawer}
              sx={{ ml: "0.5rem" }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                sx={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: isSmallMobile ? "18px" : isMobile || isTablet ? "20px" : isLaptop ? "24px" : "28px",
                  ml: isMobile ? 2 : open ? 30 : 3,
                }}
              >
                Bienvenido al Sistema, {usuario?.nombre_completo}
              </Typography>
              <Typography
                sx={{
                  color: "#b3b3b3",
                  fontWeight: "bold",
                  fontSize: isSmallMobile ? "12px" : isMobile || isTablet ? "16px" : isLaptop ? "18px" : "18px",
                  ml: isMobile ? 2 : open ? 30 : 3,
                }}
              >
                Sistema Intranet Mercado las Estrellas versión 2.0
              </Typography>
            </Box>
          </Box>
          <Box display="flex" flexDirection="row" alignItems="center">
            <IconButton onClick={handleNotifcacionesOpen}>
              {notificaciones.length > 0 ? (
                <NotificationsActive
                  sx={{
                    color: "black",
                    display: isMobile ? "none" : "block",
                    cursor: "pointer",
                  }}
                />
              ) : (
                <NotificationsNone
                  sx={{
                    color: "black",
                    display: isMobile ? "none" : "block",
                    cursor: "pointer",
                  }}
                />
              )}
            </IconButton>
            <Popover
              anchorEl={menuNotificaciones}
              open={Boolean(menuNotificaciones)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              sx={{
                "& .MuiPaper-root": {
                  mt: 2,
                  p: 1,
                  width: "500px",
                },
                "& .MuiMenuItem-root": {
                  "&:hover": {
                    bgcolor: "#EAEAEA",
                  },
                },
              }}
            >
              {notificaciones.length > 0 ? (
                <Box sx={{ py: 1, px: 1, cursor: "pointer" }}>
                  <Divider />
                  {notificaciones.map((notificacion, index) => (
                    <Fragment key={index}>
                      <Typography variant="body2" sx={{ py: 1 }}>
                        {notificacion}
                      </Typography>
                      <Divider />
                    </Fragment>
                  ))}
                </Box>
              ) : (
                <Box onClick={handleMenuClose}>
                  <Divider />
                  <Typography variant="body2" sx={{ py: 1 }}>
                    No hay notificaciones
                  </Typography>
                  <Divider />
                </Box>
              )}
            </Popover>
            <Box
              sx={{
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                cursor: "pointer",
                boxSizing: "border-box",
              }}
              onClick={handleMenuUsuarioOpen}
            >
              <Avatar
                alt="Comercial"
                src="/images/image-avatar.jpeg"
                sx={{ width: 35, height: 35, mr: 2 }}
              />
              <Typography
                sx={{
                  color: "black",
                  fontWeight: "bold",
                  display: isMobile ? "none" : "block",
                }}
              >
                {usuario?.nombre_usuario}
              </Typography>
              {Boolean(menuUsuario) ? (
                <ExpandLess
                  sx={{
                    ml: "1rem",
                    color: "black",
                    display: isMobile ? "none" : "block",
                  }}
                />
              ) : (
                <ExpandMoreIcon
                  sx={{
                    ml: "1rem",
                    color: "black",
                    display: isMobile ? "none" : "block",
                  }}
                />
              )}
            </Box>
          </Box>
          <Menu
            anchorEl={menuUsuario}
            open={Boolean(menuUsuario)}
            onClose={handleMenuClose}
            sx={{
              "& .MuiPaper-root": {
                mt: 2,
                width: "220px",
              },
              "& .MuiMenuItem-root": {
                "&:hover": {
                  bgcolor: "#EAEAEA",
                },
              },
            }}
          >
            {/* <MenuItem onClick={handleMenuClose}>Mi Perfil</MenuItem> */}
            <MenuItem onClick={handleCerrarSesion}>Cerrar sesión</MenuItem>
          </Menu>
        </Toolbar>
        <Drawer
          variant={isMobile ? "temporary" : "persistent"}
          anchor="left"
          open={open}
          onClose={toggleDrawer}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              backgroundColor: "#1f2022",
              color: "#FFFFFF",
              height: "100vh",
              transition: "width 0.3s",
              overflowX: "hidden",
            },
          }}
        >
          <Sidebar open={open} onClose={toggleDrawer} />
        </Drawer>
        <Box
          sx={{
            display: isTablet || isMobile || isSmallMobile ? "none" : "flex",
            position: "absolute",
            top: "83vh",
            left: open ? "240px" : "0px",
            borderRadius: "16px",
            transition: "left 0.3s, opacity 0.5s",
            opacity: open ? 1 : 0,
            pointerEvents: open ? "auto" : "none",
            alignItems: "center",
            bgcolor: "#404040",
            zIndex: "modal",
          }}
        >
          <IconButton color="inherit" aria-label="menu" onClick={toggleDrawer}>
            <ArrowBackIosNewIcon />
          </IconButton>
        </Box>
      </AppBar>
    </Box>
  );
};

export default Header;
