import React, { useState } from "react";
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
  Grid,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Sidebar from "./Sidebar";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { ExpandLess, NotificationsNone } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useResponsive from "./Responsive";

interface HeaderProps {
  open: boolean;
  toggleDrawer: () => void;
}

const Header: React.FC<HeaderProps> = ({ open, toggleDrawer }) => {
  
  // Variables para el responsive
  const { isMobile, isSmallMobile } = useResponsive();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCerrarSesion = () => {
    logout();
    navigate("/");
  };

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
            paddingRight: 0 
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
            <Grid container 
              sx={{
                maxWidth: isMobile ? "280px" : "auto",
              }}
            >
              <Grid item xs={12}>
                <Typography
                  sx={{ 
                    color: 'black', 
                    fontWeight: "bold", 
                    text: "center", 
                    fontSize: isSmallMobile ? 12 : isMobile ? 14 : 18,
                    ml: isMobile ? 2 : open ? 30 : 3, 
                    mb: isMobile ? -4 : -5 
                  }}
                >
                  <h2>Bienvenido al Sistema, Administrador</h2>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography 
                  sx={{ 
                    color: '#b3b3b3', 
                    fontWeight: "bold", 
                    text: "center", 
                    ml: isMobile ? 2 : open ? 30 : 3
                  }}>
                  <h5>Sistema Intranet Mercado las Estrellas versión 2.0</h5>
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <Box 
            display="flex" 
            flexDirection="row" 
            alignItems="center"
          >
            <NotificationsNone 
              sx={{ 
                color: 'black', 
                display: isMobile ? "none" : "block",
              }} 
            />
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
              onClick={handleMenuClick}
            >
              <Avatar
                alt="Comercial"
                src="/images/image-avatar.jpeg"
                sx={{ width: 35, height: 35, mr: 2 }}
              />
              <Typography 
                sx={{ 
                  color: 'black', 
                  fontWeight: "bold",
                  display: isMobile ? "none" : "block"
                }}
              >
                Ottoniel Yauri
              </Typography>
              { Boolean(anchorEl) 
                ? <ExpandLess
                    sx={{ 
                      ml: '1rem', 
                      color: 'black',
                      display: isMobile ? "none" : "block"
                    }}
                  />
                : <ExpandMoreIcon
                    sx={{ 
                      ml: '1rem', 
                      color: 'black',
                      display: isMobile ? "none" : "block"
                    }}
                  />
              }
            </Box>
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{
              "& .MuiPaper-root": {
                mt: 2,
                width: "220px",
              },
              "& .MuiMenuItem-root": {
                "&:hover": {
                  bgcolor: "#EAEAEA",
                }
              }
            }}
          >
            <MenuItem onClick={handleMenuClose}>Mi Perfil</MenuItem>
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
              backgroundColor: "#404040",
              color: "#FFFFFF",
              height: "100vh",
              transition: "width 0.3s",
              overflowX: "hidden",
            },
          }}
        >
          <Sidebar open={open} onClose={toggleDrawer}/>
        </Drawer>
        <Box
          sx={{
            position: "absolute",
            top: "855px",
            left: open ? "240px" : "0px",
            borderRadius: "16px",
            transition: "left 0.3s, opacity 0.5s",
            opacity: open ? 1 : 0,
            pointerEvents: open ? "auto" : "none",
            display: "flex",
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
