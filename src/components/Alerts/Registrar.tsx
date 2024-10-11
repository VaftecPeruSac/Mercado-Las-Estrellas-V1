import Swal from "sweetalert2";
import '../../App.css';
import axios from "axios";
import { Button } from "@mui/material";

interface CustomButtonProps {
    variant?: 'text' | 'outlined' | 'contained';
    color?: string; // Cambiar a string para aceptar un valor de color personalizado
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    children: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
}

export const mostrarAlerta = (
    titulo: string,
    texto: string = "Ocurrio un error en el registro. Intentelo Nuevamente",
    icono: "success" | "error" | "warning" | "info" | "question" = "info" // <- Valor predeterminado agregado
) => {
    return Swal.fire({
        title: titulo,
        text: texto,
        icon: icono,
        confirmButtonText: "Aceptar",
        allowOutsideClick: false,
        customClass: {
            confirmButton: 'custom-confirm-button',
            popup: 'custom-popup'
        }
    });
};

export const mostrarAlertaConfirmacion = (
    titulo: string,
    texto: string = "Verifique la información antes de continuar",
    confirmButtonText: string = "Confirmar",
    cancelButtonText: string = "Cancelar"
) => {
    return Swal.fire({
        title: titulo,
        text: texto,
        icon: "question",
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText,
        iconColor: "#008001",
        allowOutsideClick: false,
        customClass: {
            popup: 'custom-popup', // Clase para el popup
            confirmButton: 'custom-confirm-button', // Clase para el botón de confirmar
            cancelButton: 'custom-cancel-button' // Clase para el botón de cancelar
        }
    });
};

export const manejarError = (error: any) => {
    let mensajeError = "Ocurrió un error al registrar. Inténtalo nuevamente.";

    if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
            mensajeError = error.response.data.message;
        } else if (error.response?.data) {
            mensajeError = error.response.data;
        }
    }

    if (typeof mensajeError === "string" && mensajeError.includes("Integrity constraint violation")) {
        mensajeError = "Por favor, completa todos los campos requeridos.";
    }


    mostrarAlerta("Error", mensajeError, "error");
};

export const validarCamposCuotas = (formData: any, requiredFields: string[]) => {
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
        mostrarAlerta("Error", "Por favor, completa todos los campos requeridos.", "error");
        return false;
    }
    return true;
};

export const CustomButton: React.FC<CustomButtonProps> = ({ variant = 'contained', color, onClick, children, type = 'button' }) => {
    return (
        <Button
            variant={variant}
            style={{ backgroundColor: color }} // Aplicar el color personalizado aquí
            onClick={onClick}
            type={type}
        >
            {children}
        </Button>
    );
};


