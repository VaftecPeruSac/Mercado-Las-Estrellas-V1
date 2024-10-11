import { Box, Card, LinearProgress, Modal, Tab, Tabs, Typography } from '@mui/material'
import React from 'react'
import useResponsive from '../../hooks/Responsive/useResponsive';

interface ContenedorModalProps {
  ancho: string;
  alto: string;
  abrir: boolean;
  cerrar: (e: React.MouseEvent<HTMLButtonElement>) => void;
  loading: boolean;
  titulo: string;
  activeTab?: number;
  handleTabChange?: (event: React.SyntheticEvent, newValue: number) => void;
  tabs?: string[];
  children: React.ReactNode;
  botones: React.ReactNode;
}

const ContenedorModal: React.FC<ContenedorModalProps> = ({ ancho, alto, abrir, cerrar, loading, titulo, activeTab, handleTabChange, tabs, children, botones }) => {

  const { isLaptop, isSmallLaptop, isTablet, isMobile } = useResponsive();

  return (
    <Modal
      open={abrir}
      onClose={cerrar}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      sx={{ display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1200, }}
    >
      <Card
        sx={{
          width: isTablet ? "90%" : isMobile ? "95%" : `${ancho}`,
          height: isSmallLaptop || isTablet || isMobile ? "90%" : `${alto}`,
          p: isMobile ? 3 : "40px",
          bgcolor: "white",
          boxShadow: 24,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          overflowY: "auto",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#008001",
            p: 2,
            color: "#fff",
            borderRadius: 1,
          }}
        >
          <Typography
            id="modal-title"
            variant="h6"
            component="h2"
            sx={{ textAlign: "center", textTransform: "uppercase" }}
          >
            {titulo}
          </Typography>
        </Box>
        {loading && (
          <div style={{ textAlign: "center", marginBottom: "5px" }}>
            <LinearProgress aria-describedby="modal-description" color="primary" />
          </div>
        )}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 0 }}>
          {tabs && tabs.length > 0 && (
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                "& .MuiTabs-flexContainer": {
                  minHeight: "36px",
                },
                "& .MuiTab-root": {
                  fontSize: "0.8rem",
                  fontWeight: "normal",
                  color: "gray",
                  textTransform: "uppercase",
                  minWidth: "auto",
                  px: 2,
                },
                "& .MuiTab-root.Mui-selected": {
                  fontWeight: "bold",
                  color: "black !important",
                },
                "& .MuiTabs-indicator": {
                  display: "none",
                },
                mb: -1,
                overflowX: "auto",
              }}
            >
              {tabs && tabs.length > 0 && (
                tabs.map((tab, index) => (
                  <Tab key={index} label={tab} />
                )
              ))}
            </Tabs>
          )}
        </Box>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{ padding: isTablet || isMobile ? "0px" : "0px 58px" }}
        >
          {children}
        </Box>
        {botones}
      </Card>
    </Modal>
  );

}

export default ContenedorModal;