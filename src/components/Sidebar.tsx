import React from "react";
import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  ListItemButton,
} from "@mui/material";
import {
  Home,
  Group,
  Assignment,
  Build,
  AccountBalance,
  MonetizationOn,
  People,
  ExpandMore,
  Store,
} from "@mui/icons-material";
import { link } from "fs";

import { Link } from "react-router-dom";
interface SidebarProps {
  open: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
        <Avatar
          alt="Comercial"
          src="/images/image-avatar.jpeg"
          sx={{ width: 56, height: 56 }}
        />
        <Box sx={{ ml: 2 }}>
          <Typography
            variant="subtitle1"
            color="#FFFFFF"
          >
            comercial
          </Typography>
          <Typography
            variant="subtitle2"
            color="#FFFFFF"
          >
            ADMINISTRADOR
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List>
        <ListItemButton
          component={Link}
          to="/"
          sx={listItemStyle}
        >
          <ListItemIcon sx={{ color: "inherit" }}>
            <Home />
          </ListItemIcon>
          {open && (
            <ListItemText
              primary="Inicio"
              sx={{ pl: 2 }}
            />
          )}
        </ListItemButton>
        {open && (
          <Typography
            variant="subtitle2"
            color="#FFFFFF"
            sx={{ p: 2 }}
          >
            MENU ADMINISTRADOR
          </Typography>
        )}
        <ListItem
          button
          sx={listItemStyle}
        >
          <ListItemIcon sx={{ color: "inherit" }}>
            <Store />
          </ListItemIcon>
          {open && (
            <ListItemText
              primary="Puestos"
              sx={{ pl: 2 }}
            />
          )}
          <ExpandMore />
        </ListItem>
        <ListItemButton
          component={Link}
          to="/asociados"
          sx={listItemStyle}
        >
          <ListItemIcon sx={{ color: "inherit" }}>
            <Group />
          </ListItemIcon>
          {open && (
            <ListItemText
              primary="Asociados"
              sx={{ pl: 2 }}
            />
          )}
          <ExpandMore />
        </ListItemButton>
        <ListItem
          button
          sx={listItemStyle}
        >
          <ListItemIcon sx={{ color: "inherit" }}>
            <People />
          </ListItemIcon>
          {open && (
            <ListItemText
              primary="Inquilinos"
              sx={{ pl: 2 }}
            />
          )}
          <ExpandMore />
        </ListItem>
        <ListItem
          button
          sx={listItemStyle}
        >
          <ListItemIcon sx={{ color: "inherit" }}>
            <Assignment />
          </ListItemIcon>
          {open && (
            <ListItemText
              primary="Contratos"
              sx={{ pl: 2 }}
            />
          )}
          <ExpandMore />
        </ListItem>
        <ListItem
          button
          sx={listItemStyle}
        >
          <ListItemIcon sx={{ color: "inherit" }}>
            <Build />
          </ListItemIcon>
          {open && (
            <ListItemText
              primary="Servicios"
              sx={{ pl: 2 }}
            />
          )}
          <ExpandMore />
        </ListItem>
        <ListItem
          button
          sx={listItemStyle}
        >
          <ListItemIcon sx={{ color: "inherit" }}>
            <AccountBalance />
          </ListItemIcon>
          {open && (
            <ListItemText
              primary="Aperturar Deuda"
              sx={{ pl: 2 }}
            />
          )}
          <ExpandMore />
        </ListItem>
        <ListItem
          button
          sx={listItemStyle}
        >
          <ListItemIcon sx={{ color: "inherit" }}>
            <MonetizationOn />
          </ListItemIcon>
          {open && (
            <ListItemText
              primary="Ver Deuda"
              sx={{ pl: 2 }}
            />
          )}
          <ExpandMore />
        </ListItem>
        {open && (
          <Typography
            variant="subtitle2"
            color="#FFFFFF"
            sx={{ p: 2 }}
          >
            CONTROL DE ACCESO
          </Typography>
        )}
        <ListItem
          button
          sx={listItemStyle}
        >
          <ListItemIcon sx={{ color: "inherit" }}>
            <People />
          </ListItemIcon>
          {open && (
            <ListItemText
              primary="Empleados"
              sx={{ pl: 2 }}
            />
          )}
          <ExpandMore />
        </ListItem>
      </List>
    </Box>
  );
};

const listItemStyle = {
  "&:hover": {
    backgroundColor: "#3B82F6",
    color: "#FFFFFF",
    "& .MuiListItemText-primary": {
      fontWeight: "bold",
    },
  },
};

export default Sidebar;
