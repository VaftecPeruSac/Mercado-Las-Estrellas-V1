import React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import {
  Divider,
  List,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  ListItemButton,
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
} from "@mui/icons-material";
import BackupTableIcon from '@mui/icons-material/BackupTable';
import { Link } from "react-router-dom";
import LoginIcon from '@mui/icons-material/Login';
interface SidebarProps {
  open: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  return (
    <Box sx={{
      height: "100vh", display: "flex", flexDirection: "column",
      bgcolor: "#1f2022", pl: 2, pr: 2
    }}>
      <Box sx={{ display: "flex", alignItems: "center", pt: 4, pl: 2 }}>
        <BackupTableIcon />
        <Typography
          variant="subtitle1"
          color="#FFFFFF"
          sx={{ ml: 1, }}
        >
          <h3><b>SISTEM MERCADO</b></h3>
        </Typography>
      </Box>
      <List>
        &nbsp;
        <ListItemButton
          component={Link}
          to="/home"
          sx={{ ...listItemStyle }}
        >
          <ListItemIcon sx={{ color: "inherit" }}>
            <DashboardIcon />
          </ListItemIcon>
          {open && (
            <ListItemText
              primary="Panel de Control"
              sx={{ ml: -2, }}
            />
          )}
          <ExpandMore />
        </ListItemButton>
        &nbsp;
        <ListItemButton
          component={Link}
          to="socios"
          sx={listItemStyle}
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
        <ListItemButton
          component={Link}
          to="puestos"
          sx={listItemStyle}
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
        <ListItemButton
          component={Link}
          to="servicios"
          sx={listItemStyle}
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
        <ListItemButton
          component={Link}
          to="cuotas"
          sx={listItemStyle}
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
        <ListItemButton
          component={Link}
          to="pagos"
          sx={listItemStyle}
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


        &nbsp;
        <Divider sx={{ bgcolor: "#505155", ml: 3, mr: 3 }} />
        <ListItemButton
          component={Link}
          to="configuracion"
          sx={listItemStyle}
        >
          <ListItemIcon sx={{ color: "inherit" }}>
            <Settings />
          </ListItemIcon>
          {open && (
            <ListItemText
              primary="Configuracion  "
              sx={{ ml: -3 }}
            />
          )}
        </ListItemButton>
        <br />
        <ListItemButton
          component={Link}
          to="reporte-pagos"
          sx={listItemStyle}
        >
          <ListItemIcon sx={{ color: "inherit" }}>
            <Description />
          </ListItemIcon>
          {open && (
            <ListItemText
              primary="Reporte pagos"
              sx={{ ml: -2 }}
            />
          )}
        </ListItemButton>
        <ListItemButton
          component={Link}
          to="reporte-deudas"
          sx={listItemStyle}
        >
          <ListItemIcon sx={{ color: "inherit", ml: -0.5 }}>
            <Description />
          </ListItemIcon>
          {open && (
            <ListItemText
              primary="Reporte Deudas"
              sx={{ ml: -2 }}
            />
          )}
        </ListItemButton>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <ListItemButton
          component={Link}
          to="ver-deuda"
          sx={listItemStyle}
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
        <ListItemButton
          component={Link}
          to="ver-deuda"
          sx={listItemStyle}
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
        <ListItemButton
          component={Link}
          to="/"
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
      </List>
    </Box>
  );
};

const listItemStyle = {
  "&:hover": {
    backgroundColor: "#404040",
    borderRadius: '16px',
    color: "#FFFFFF",
    "& .MuiListItemText-primary": {
      fontWeight: "bold",
    },
  },
};

export default Sidebar;