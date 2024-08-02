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
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", paddingRight: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#FFFFFF",
                color: "#000000",
                padding: "0.5rem 2rem",
                height: "62px",
                marginRight: "0px",
                marginLeft: "0px",
              }}
            >
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    lineHeight: 1,
                  }}
                >
                  SISTEMA
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    lineHeight: 1,
                  }}
                >
                  COMERCIAL
                </Typography>
              </Box>
              <ShoppingCartIcon sx={{ ml: 1 }} />
            </Box>
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
            <Typography sx={{ fontWeight: "bold" }}>
              RICARDO GALINDO MERCADO
            </Typography>
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
      </AppBar>
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          zIndex: (theme) => theme.zIndex.appBar + 1,
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
            backgroundColor: "#404040",
            color: "#FFFFFF",
            height: "100vh",
            marginTop: "64px",
            transition: "width 0.3s",
            overflowX: "hidden",
          },
        }}
      >
        <Sidebar open={open} />
      </Drawer>
    </Box>
  );
};

export default Header;
