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
  Autocomplete,
  TextField,
  InputAdornment,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Sidebar from "./Sidebar";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { GridSearchIcon } from "@mui/x-data-grid";
import { Notifications, NotificationsNone } from "@mui/icons-material";

interface HeaderProps {
  open: boolean;
  toggleDrawer: () => void;
}

const Header: React.FC<HeaderProps> = ({ open, toggleDrawer }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
        <Toolbar sx={{ justifyContent: "space-between", paddingRight: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              edge="start"
              aria-label="menu"
              onClick={toggleDrawer}
              sx={{ ml: "0.5rem" }}
            >
              <MenuIcon />
            </IconButton>
            <Grid container>
              <Grid item xs={12}>
                <Typography
                  sx={{ color: 'black', fontWeight: "bold", text: "center", ml: 30, mb: -5 }}
                >
                  <h2>Bienvenido al Sistema, Administrador</h2>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{ color: '#b3b3b3', fontWeight: "bold", text: "center", ml: 30 }}>
                  <h5>Sitema Intranet Mercado las Estrellas versopm 2.0</h5>
                </Typography>
              </Grid>
            </Grid>
            <Box
              sx={{
                borderRadius: "20px",
                bgcolor: "#f3f3f3",
                ml: '340px',
                pl: '10px'
              }}
            >
              <TextField
                id="input-with-icon-textfield"
                placeholder="Buscar"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <GridSearchIcon />
                    </InputAdornment>
                  ),
                }}
                variant="standard" sx={{
                  border: "white",
                  "& .MuiInput-underline:before": {
                    borderBottom: "none"
                  },
                  "& .MuiInput-underline:hover:before": {
                    borderBottom: "none"
                  },
                  "& .MuiInput-underline:after": {
                    borderBottom: "none"
                  }
                }}
              />
            </Box>
            <NotificationsNone sx={{ color: 'black' }} />
          </Box>
          <Box sx={{ flexGrow: 1 }} />
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
            <Typography sx={{ color: 'black', fontWeight: "bold" }}>Ottoniel Yauri</Typography>
            <ExpandMoreIcon sx={{ mr: '20px', color: 'black' }} />
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>My account</MenuItem>
            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
          </Menu>
        </Toolbar>
        <Drawer
          variant="persistent"
          anchor="left"
          open={open}
          sx={{
            // zIndex: (theme) => theme.zIndex.appBar + 1,
            // width: 220,
            // flexShrink: 0,
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
          <Sidebar open={open} />
        </Drawer>
        <Box
          sx={{
            position: "absolute",
            top: "855px",
            left: open ? "225px" : "0px",
            borderRadius: "16px",
            transition: "left 0.3s, opacity 0.3s",
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
