import React, { useState, useRef, useEffect } from "react";
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
import useResponsive from "../hooks/Responsive/useResponsive";
import { CustomButton, mostrarAlerta, mostrarAlertaConfirmacion } from "./Alerts/Registrar";
import apiClient from "../Utils/apliClient";
import { Api_Global_Setup } from "../service/SetupApi";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {

  // Variables para el responsive
  const { isMobile, isTablet } = useResponsive();
  const { usuario, logout } = useAuth();
  
  const [collapseDashboard, setCollapseDashboard] = useState(true);
  const [collapseReportes, setCollapseReportes] = useState(isMobile || (usuario?.rol === "Socio") ? true : false);

  const [openDialog, setOpenDialog] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [emailUsuario, setEmailUsuario] = useState("");
  const [modulos, setModulos] = useState<any[]>([]);

  const location = useLocation();
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
      mostrarAlerta("Formulario incompleto", "Por favor completa todos los campos.", "error");
      return;
    }

    if (!emailRegex.test(emailUsuario)) {
      mostrarAlerta("Correo inválido", "Por favor ingresa un correo electrónico válido.", "error");
      return;
    }


    if (formData.current) {
      emailjs.sendForm('service_9bvnfok', 'template_et36ked', formData.current, "vyDUK-OuHPsdQAaPJ")
        .then((result) => {
          mostrarAlerta("Correo enviado", "Hemos recibido tu mensaje, nos pondremos en contacto contigo lo más pronto posible.", "success");
          handleCloseDialog();
        }, (error) => {
          mostrarAlerta("Error al enviar correo", "Por favor intenta de nuevo más tarde.", "error");
        });
    } else {
      mostrarAlerta("Error al enviar correo", "Por favor intenta de nuevo más tarde.", "error");
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

  const handleModulos = async () => {
    // setIsLoading(true)
    const idUsuario = usuario?.id_usuario || "";
    try {
      const response = await apiClient.get(Api_Global_Setup.modulosWeb.listar(idUsuario));
      const data = response.data.map((item: any) => ({
        ...item,
      }));
      setModulos(data);
    } catch (error) {
      console.error("Error al traer datos", error);
    } finally {
      // setIsLoading(false);
    }
  };

  const handleCerrarSesion = () => {
    mostrarAlertaConfirmacion(
      "¿Desea cerrar sesión?", "Por favor confirme su acción.", "Cerrar sesión", "Cancelar"
    ).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/");
        onClose();
      }
    });
  };

  useEffect(() => {
    handleModulos();
  }, []);

  return (
    <Box sx={{
      height: "100vh",
      width: isMobile || isTablet ? "100vw" : "260px",
      display: "flex",
      flexDirection: "column",
      bgcolor: "#1f2022",
      px: 2,
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
        <Box sx={{ display: "flex", alignItems: "center", pt: 4, pl: 0.5 }}>
          <BackupTableIcon />
          <Typography
            variant="h6"
            color="#FFFFFF"
            sx={{ ml: 1, py: 2 }}
          >
            <b>SISTEM MERCADO</b>
          </Typography>
        </Box>
        {(isTablet || isMobile) && (
          <IconButton onClick={onClose} sx={{ color: '#fff', pt: 4 }}>
            <Close />
          </IconButton>
        )}
      </Box>

      {/* new Menu */}
      {modulos.map((item) => (
        <>
          <Box>
            <List>
              <ListItemButton component={Link} to="/home" sx={getEstilos("/home", { mt: 2 })}
                onClick={() => {
                  if (!isMobile && !isTablet) {
                    if (location.pathname === "/home") {
                      handleOpenPanel();
                    }
                  } else {
                    if (location.pathname === "/home") {
                      handleOpenPanel();
                    } else {
                      onClose();
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ color: "inherit" }}><DashboardIcon /></ListItemIcon>
                {/* <ListItemText primary="Panel de Control" sx={{ ml: -3, }} /> */}
                <ListItemText primary={item.nombre} sx={{ ml: -3, }} />
                {collapseDashboard ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={collapseDashboard} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.modulos.map((item2: any) => (
                    <ListItemButton component={Link} to={item2.url_foco} sx={getEstilos(item2.url, { ml: 2 })}
                      onClick={isTablet || isMobile ? onClose : undefined}
                    >
                      <ListItemIcon sx={{ color: "inherit" }}><Groups /></ListItemIcon>
                      <ListItemText primary={item2.nombre} sx={{ ml: -3 }} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </List>
          </Box>
          <Divider sx={{ bgcolor: "#505155", m: 3 }} />
        </>
      ))}
      {/* new Menu */}

      <Box sx={{ mt: "auto", mb: 2 }}>

        {/* Ayuda */}
        <ListItemButton
          component="button"
          onClick={handleOpenDialog}
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
          <DialogContent sx={{ width: isMobile ? "100%" : "500px" }}>
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
            <CustomButton variant="contained" color="#202123" onClick={handleCloseDialog}>Cancelar</CustomButton>
            <CustomButton variant="contained" color="#008001" onClick={handleSendEmail} type="submit">Enviar</CustomButton>
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