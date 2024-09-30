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
        confirmButtonColor: "#008001",
        cancelButtonColor: "#202123",
        iconColor: "#008001",
        allowOutsideClick: false,
        customClass: {
            popup: 'custom-popup'
        }
    });
};
