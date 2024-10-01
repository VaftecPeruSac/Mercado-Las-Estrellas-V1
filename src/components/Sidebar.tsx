import React, { useState } from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import {
  Divider,
  List,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  ListItemButton,
  Collapse,
  IconButton,
} from "@mui/material";
import {
  Assignment,
  MonetizationOn,
  ExpandMore,
  ShoppingBasket,
  Article,
  Settings,
  Description,
  Storefront,
  Groups,
  ExpandLess,
  Close,
} from "@mui/icons-material";
import BackupTableIcon from '@mui/icons-material/BackupTable';
import { Link, useLocation, useNavigate } from "react-router-dom";
import LoginIcon from '@mui/icons-material/Login';
import { useAuth } from "../context/AuthContext";
import useResponsive from "./Responsive";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {

  // Variables para el responsive
  const { isMobile, isTablet } = useResponsive();

  const [openPanel, setOpenPanel] = useState(isMobile ? true : false);
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleOpenPanel = () => {
    setOpenPanel(!openPanel);
  };

  // Estilos de los items de la lista
  const getEstilos = (ubicacion: string, estilosAdicionales = {}) => {
    // Si la ubicacion actual es igual a la ubicacion del item de la lista
    return location.pathname === ubicacion
    // Retornar los estilos del item de la lista con el color de fondo #404040 y el texto en negrita
      ? { 
        ...listItemStyle, 
        ...estilosAdicionales, 
        backgroundColor: "#404040", 
        "& .MuiListItemText-primary": {
          fontWeight: "550",
        },
      }
    // De lo contrario, retornar los estilos del item de la lista con el color de fondo por defecto 
    // y el texto en color #888
      : { 
        ...listItemStyle, 
        ...estilosAdicionales, 
        color: "#888" 
      }
  };

  const handleCerrarSesion = () => {
    logout();
    navigate("/");
    onClose();
  };

  return (
    <Box sx={{
      height: "100vh",
      width: isMobile || isTablet ? "100vw" : "260px",
      display: "flex", 
      flexDirection: "column",
      bgcolor: "#1f2022", 
      pl: 2, pr: 2,
      overflowY: "auto", // Hace que el sidebar tenga scroll
      "&::-webkit-scrollbar": {
      display: "none", // Oculta el scrollbar en navegadores basados en WebKit
      },
    }}>

    <Box sx={{ 
      display: "flex", 
      alignItems: "center", 
      alignContent: "center",
      justifyContent: "space-between" 
    }}>
      <Box sx={{ display: "flex", alignItems: "center", pt: 4, pl: 1 }}>
        <BackupTableIcon />
        <Typography
          variant="subtitle1"
          color="#FFFFFF"
          sx={{ ml: 1, }}
        >
          <h3><b>SISTEM MERCADO</b></h3>
        </Typography>
      </Box>
      {(isTablet || isMobile) && (
        <IconButton onClick={onClose} sx={{ color: '#fff', pt: 4 }}>
          <Close />
        </IconButton>
      )}
    </Box>

      <Box>

        <List>

          <ListItemButton
            component={Link}
            to="/home"
            sx={getEstilos("/home", { mt: 3 })}
            onClick={() => {
              if(!isMobile && !isTablet) {
                handleOpenPanel();
              } else {
                if(location.pathname === "/home") {
                  handleOpenPanel();
                } else {
                  onClose();
                }
              }
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <DashboardIcon />
            </ListItemIcon>
            {open && (
              <ListItemText
                primary="Panel de Control"
                sx={{ ml: -3, }}
              />
            )}
            {openPanel ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse in={openPanel} timeout="auto" unmountOnExit>

            <List component="div" disablePadding>

              {/* Socios */}
              <ListItemButton
                component={Link}
                to="socios"
                sx={getEstilos("/home/socios", { ml: 2 })}
                onClick={isTablet || isMobile ? onClose : undefined}
              >
                <ListItemIcon sx={{ color: "inherit" }}>
                  <Groups />
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary="Socios"
                    sx={{ ml: -3 }}
                  />
                )}
              </ListItemButton>

              {/* Puestos */}
              <ListItemButton
                component={Link}
                to="puestos"
                sx={getEstilos("/home/puestos", { ml: 2 })}
                onClick={isTablet || isMobile ? onClose : undefined}
              >
                <ListItemIcon sx={{ color: "inherit" }}>
                  <Storefront />
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary="Puestos"
                    sx={{ ml: -3 }}
                  />
                )}
              </ListItemButton>

              {/* Servicios */}
              <ListItemButton
                component={Link}
                to="servicios"
                sx={getEstilos("/home/servicios", { ml: 2 })}
                onClick={isTablet || isMobile ? onClose : undefined}
              >
                <ListItemIcon sx={{ color: "inherit" }}>
                  <ShoppingBasket />
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary="Servicios"
                    sx={{ ml: -3 }}
                  />
                )}
              </ListItemButton>

              {/* Cuotas */}
              <ListItemButton
                component={Link}
                to="cuotas"
                sx={getEstilos("/home/cuotas", { ml: 2 })}
                onClick={isTablet || isMobile ? onClose : undefined}
              >
                <Assignment sx={{ color: "inherit" }}>
                  <Article />
                </Assignment>
                {open && (
                  <ListItemText
                    primary="Generar Cuota"
                    sx={{ ml: 1 }}
                  />
                )}
              </ListItemButton>

              {/* Pagos */}
              <ListItemButton
                component={Link}
                to="pagos"
                sx={getEstilos("/home/pagos", { ml: 2 })}
                onClick={isTablet || isMobile ? onClose : undefined}
              >
                <ListItemIcon sx={{ color: "inherit" }}>
                  <MonetizationOn />
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary="Pagos"
                    sx={{ ml: -3 }}
                  />
                )}
              </ListItemButton>

            </List>

          </Collapse>

        </List>

      </Box>

      <Box>

        <Divider sx={{ bgcolor: "#505155", m: 3 }} />

        {/* Reporte de pagos */}
        <ListItemButton
          component={Link}
          to="reporte-pagos"
          sx={getEstilos("/home/reporte-pagos", {})}
          onClick={isTablet || isMobile ? onClose : undefined}
        >
          <ListItemIcon sx={{ color: "inherit" }}>
            <Description />
          </ListItemIcon>
          {open && (
            <ListItemText
              primary="Reporte Pagos"
              sx={{ ml: -3 }}
            />
          )}
        </ListItemButton>

        {/* Reporte de deudas */}
        <ListItemButton
          component={Link}
          to="reporte-deudas"
          sx={getEstilos("/home/reporte-deudas", {})}
          onClick={isTablet || isMobile ? onClose : undefined}
        >
          <ListItemIcon sx={{ color: "inherit" }}>
            <Description />
          </ListItemIcon>
          {open && (
            <ListItemText
              primary="Reporte Deudas"
              sx={{ ml: -3 }}
            />
          )}
        </ListItemButton>

        <Divider sx={{ bgcolor: "#505155", m: 3 }} />

        {/* Configuracion */}
        <ListItemButton
          component={Link}
          to="configuracion"
          sx={getEstilos("/home/configuracion", { mb: "auto" })}
          onClick={isTablet || isMobile ? onClose : undefined}
        >
          <ListItemIcon sx={{ color: "inherit" }}>
            <Settings />
          </ListItemIcon>
          {open && (
            <ListItemText
              primary="Configuracion"
              sx={{ ml: -3 }}
            />
          )}
        </ListItemButton>

      </Box>

      <Box sx={{ mt: "auto", mb: 2 }}>

        {/* Ayuda */}
        <ListItemButton
          component={Link}
          to="ayuda"
          sx={getEstilos("/home/ayuda", {})}
          onClick={isTablet || isMobile ? onClose : undefined}
        >
          <ListItemIcon sx={{ color: "inherit", ml: -0.5 }}>
          </ListItemIcon>
          {open && (
            <ListItemText
              primary="Ayuda"
              sx={{ ml: -7 }}
            />
          )}
        </ListItemButton>

        {/* Contactanos */}
        <ListItemButton
          component={Link}
          to="contactenos"
          sx={getEstilos("/home/contactenos", {})}
          onClick={isTablet || isMobile ? onClose : undefined}
        >
          <ListItemIcon sx={{ color: "inherit", ml: -0.5 }}>
          </ListItemIcon>
          {open && (
            <ListItemText
              primary="Contactenos"
              sx={{ ml: -7 }}
            />
          )}
        </ListItemButton>

        {/* Salir / Cerrar sesión */}
        <ListItemButton
          onClick={handleCerrarSesion}
          sx={listItemStyle}
        >
          <ListItemIcon sx={{ color: "inherit", ml: -0.5 }}>
            <LoginIcon />
          </ListItemIcon>
          {open && (
            <ListItemText
              primary="Salir"
              sx={{ ml: -2 }}
            />
          )}
        </ListItemButton>

      </Box>

    </Box>

  );
};

const listItemStyle = {
  mt: "2px",
  mb: "2px",
  borderRadius: '16px',
  "&:hover": {
    backgroundColor: "#404040",
  },
};

export default Sidebar;