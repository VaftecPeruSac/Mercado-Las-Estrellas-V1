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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Sidebar from "./Sidebar";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

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
          backgroundColor: "#004d00",
          zIndex: (theme) => theme.zIndex.drawer - 1,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", paddingRight: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer}
              sx={{ ml: "0.5rem" }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box
            sx={{
              backgroundColor: "#000000",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              cursor: "pointer",
              height: "64px",
              boxSizing: "border-box",
            }}
            onClick={handleMenuClick}
          >
            <Typography sx={{ fontWeight: "bold" }}>MERCADO</Typography>
            <ExpandMoreIcon />
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
            borderRadius: '16px',
            transition: "left 0.3s, opacity 0.3s",
            opacity: open ? 1 : 0,
            pointerEvents: open ? "auto" : "none",
            display: "flex",
            alignItems: "center",
            bgcolor: "#404040",
            zIndex: "modal",
          }}
        >
          <IconButton
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
        </Box>
      </AppBar>
    </Box>
  );
};

export default Header;
