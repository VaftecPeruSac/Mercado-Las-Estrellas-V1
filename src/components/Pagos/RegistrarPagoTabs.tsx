import React, { useState } from "react";
import ContenedorModal from "../Shared/ContenedorModal";
import { AgregarProps } from "../../interface/Cuota";
import RegistrarPago from "./RegistrarPago";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import RegistrarPagoBanco from "./RegistrarPagoBanco";

const RegistrarPagoTabs: React.FC<AgregarProps> = ({ open, handleClose }) => {
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = React.useState(0);

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleCloseModal = () => {
    setActiveStep(0);
    handleClose();
  };

  return (
    <ContenedorModal
      ancho="800px"
      alto="auto"
      abrir={open}
      cerrar={handleCloseModal}
      loading={loading}
      titulo="Registrar Pago"
      botones={null}
    >
      <Stepper nonLinear activeStep={activeStep}>
        <Step key={'Pago en efectivo'}>
          <StepButton color="inherit" onClick={handleStep(0)}>
            {'Pago en efectivo'}
          </StepButton>
        </Step>
        <Step key={'Pago en banco'}>
          <StepButton color="inherit" onClick={handleStep(1)}>
            {'Pago en banco'}
          </StepButton>
        </Step>
      </Stepper>
      <div>
        {activeStep == 0 ? (
          <React.Fragment>
            <RegistrarPago open={true} handleClose={handleClose}></RegistrarPago>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <RegistrarPagoBanco open={true} handleClose={handleClose}></RegistrarPagoBanco>
          </React.Fragment>
        )}
      </div>
    </ContenedorModal>
  );
};

export default RegistrarPagoTabs;
