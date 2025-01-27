import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import ContenedorModal from "../Shared/ContenedorModal";
import { AgregarProps } from "../../interface/Cuota";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import GenerarCuota from "./GenerarCuota";
import GenerarCuotaPorPuesto from "./GenerarCuotaPorPuesto";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      // style={{ marginLeft: "auto" }}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const GenerarCuotaTabs: React.FC<AgregarProps> = ({ open, handleClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);

  // PARA LOS TABS
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleCloseModal = () => {
    setValue(0);
    handleClose();
  };

  return (
    <ContenedorModal
      ancho="800px"
      alto="auto"
      abrir={open}
      cerrar={handleCloseModal}
      loading={loading}
      titulo="Generar Cuota"
      botones={
        <Button
          style={{ marginLeft: "auto", marginRight: "auto" }}
          variant="contained"
          sx={{
            width: "140px",
            height: "45px",
            backgroundColor: "#202123",
            color: "#fff",
            mr: 1,
            "&:hover": {
              backgroundColor: "#3F4145",
            },
          }}
          onClick={handleCloseModal}
        >
          Cerrar
        </Button>
      }
    >

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Para todos" {...a11yProps(0)} />
          <Tab label="Por puesto" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <GenerarCuota
        ></GenerarCuota>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <GenerarCuotaPorPuesto
        ></GenerarCuotaPorPuesto>
      </CustomTabPanel>
    </ContenedorModal>
  );
};

export default GenerarCuotaTabs;
