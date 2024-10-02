import React, { useState, useRef } from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import emailjs from '@emailjs/browser';

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
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import {
  Assignment,
  MonetizationOn,
  ExpandMore,
  ShoppingBasket,
  Article,
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
import Swal from "sweetalert2";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {

  // Variables para el responsive
  const { isMobile, isTablet } = useResponsive();

  const [collapseDashboard, setCollapseDashboard] = useState(isMobile ? true : false);
  const [collapseReportes, setCollapseReportes] = useState(isMobile ? true : false);

  const [openDialog, setOpenDialog] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [emailUsuario, setEmailUsuario] = useState("");

  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleOpenPanel = () => {
    setCollapseDashboard(!collapseDashboard);
  };

  const handleOpenReportes = () => {
    setCollapseReportes(!collapseReportes);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNombreUsuario("");
    setEmailUsuario("");
    setMensaje("");
  };
  
  const formData = useRef<HTMLFormElement>(null);

  const handleSendEmail = () => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nombreUsuario || !emailUsuario || !mensaje) {
      Swal.fire("¡Formulario incompleto!", "Por favor completa todos los campos.", "error");
      return;
    }

    if (!emailRegex.test(emailUsuario)) {
      Swal.fire("¡Correo inválido!", "Por favor ingresa un correo electrónico válido.", "error");
      return;
    }

    if (formData.current) {
      emailjs.sendForm('service_dqutkuh', 'template_eeifnsc', formData.current, "DBrhXyzM6llItxs8c")
        .then((result) => {
          Swal.fire("¡Correo enviado!", "Hemos recibido tu mensaje, nos pondremos en contacto contigo lo más pronto posible.", "success");
          handleCloseDialog();
        }, (error) => {
          Swal.fire("¡Error al enviar correo!", "Por favor intenta de nuevo más tarde.", "error");
        });
    } else {
      Swal.fire("¡Error al enviar correo!", "Por favor intenta de nuevo más tarde.", "error");
    }

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
            sx={getEstilos("/home", { mt: 2 })}
            onClick={() => {
              if(!isMobile && !isTablet) {
                if(location.pathname === "/home") {
                  handleOpenPanel();
                }
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
            {collapseDashboard ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse in={collapseDashboard} timeout="auto" unmountOnExit>

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

        <ListItemButton
          sx={getEstilos("", { mt: 3 })}
          onClick={() => handleOpenReportes()}
        >
          <ListItemIcon sx={{ color: "inherit" }}>
            <DashboardIcon />
          </ListItemIcon>
          {open && (
            <ListItemText
              primary="Reportes"
              sx={{ ml: -3, }}
            />
          )}
          {collapseReportes ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={collapseReportes} timeout="auto" unmountOnExit>

          {/* Reporte de pagos */}
          <ListItemButton
            component={Link}
            to="reporte-pagos"
            sx={getEstilos("/home/reporte-pagos", { ml: 2 })}
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
            sx={getEstilos("/home/reporte-deudas", { ml: 2 })}
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

          {/* Reporte de cuotas por metrado */}
          <ListItemButton
            component={Link}
            to="reporte-cuotas-metrado"
            sx={getEstilos("/home/reporte-cuotas-metrado", { ml: 2 })}
            onClick={isTablet || isMobile ? onClose : undefined}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <Description />
            </ListItemIcon>
            {open && (
              <ListItemText
                primary="Reporte de cuotas por metrado"
                sx={{ ml: -3 }}
              />
            )}
          </ListItemButton>

          {/* Reporte de cuotas por puestos */}
          <ListItemButton
            component={Link}
            to="reporte-cuotas-puesto"
            sx={getEstilos("/home/reporte-cuotas-puesto", { ml: 2 })}
            onClick={isTablet || isMobile ? onClose : undefined}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <Description />
            </ListItemIcon>
            {open && (
              <ListItemText
                primary="Reporte de cuotas por puestos"
                sx={{ ml: -3 }}
              />
            )}
          </ListItemButton>

        </Collapse>

        <Divider sx={{ bgcolor: "#505155", m: 3 }} />

      </Box>

      <Box sx={{ mt: "auto", mb: 2 }}>

        {/* Ayuda */}
        <ListItemButton
          component="button"
          onClick={() => {
            if(isTablet || isMobile) {
              handleOpenDialog();
              onClose();
            } else {
              handleOpenDialog();
            }
          }}
          sx={getEstilos("/home/ayuda", { width: "100%" })}
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

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle sx={{ textAlign: "center" }}>
            <Typography variant="h5">¿Estas experimentando algún problema?</Typography>
            <Typography sx={{ mt: 2, fontSize: "1rem" }}>Cuentanos ¿Que paso?</Typography>
          </DialogTitle>
          <DialogContent sx={{ width: "500px" }}>
            <Box component="form" ref={formData}>
              <TextField
                fullWidth
                required
                type="text"
                margin="dense"
                label="Nombre de usuario"
                name="user_name"
                placeholder="Ingrese su nombre"
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
              />
              <TextField
                fullWidth
                required
                type="email"
                margin="dense"
                label="Correo Electrónico"
                name="user_email"
                placeholder="Ingrese su correo electrónico"
                value={emailUsuario}
                onChange={(e) => setEmailUsuario(e.target.value)}
              />
              <TextField
                fullWidth
                multiline
                rows={8}
                type="text"
                margin="dense"
                label="Problema"
                name="message"
                placeholder="Describe tu problema aquí"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center" }}>
            <Button variant="contained" color="error" onClick={handleCloseDialog}>Cancelar</Button>
            <Button variant="contained" color="success" type="submit" onClick={handleSendEmail}>Enviar</Button>
          </DialogActions>
        </Dialog>

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