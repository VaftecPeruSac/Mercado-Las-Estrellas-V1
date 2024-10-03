import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingSpinner: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", 
        width: "100%",
        position: "relative",
      }}
    >
      <CircularProgress 
        sx={{ 
          color: "#008001", 
          mb: 2,
          animation: "spin 1.5s linear infinite" 
        }} 
        size={60}
        thickness={4.5} 
      />
      <Typography
        variant="h6"
        sx={{
          mt: 1,
          color: "#3f51b5",
          fontWeight: 500,
          textTransform: "uppercase", 
          letterSpacing: 1.5,
        }}
      >
        {/* Cargando... */}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
