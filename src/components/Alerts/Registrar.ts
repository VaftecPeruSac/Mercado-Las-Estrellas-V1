import Swal from "sweetalert2";
import '../../App.css'; // Subimos dos niveles para acceder a src

export const mostrarAlerta = (
    titulo: string,
    texto: string,
    icono: "success" | "error" | "warning" | "info" | "question"
) => {
    return Swal.fire({
        title: titulo,
        text: texto,
        icon: icono,
        confirmButtonText: "Aceptar",
        customClass: {
            confirmButton: 'custom-confirm-button', // Agrega una clase personalizada
            popup: 'custom-popup'

        }
    });
};

export const mostrarAlertaConfirmacion = (
    titulo: string,
    texto: string,
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
