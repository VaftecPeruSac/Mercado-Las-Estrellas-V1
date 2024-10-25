import axios from "axios";
import apiClient from "./apliClient";
import { mostrarAlerta } from "../components/Alerts/Registrar";

export const handleExport = async (
  exportUrl: string, // URL para exportar
  exportFormat: string, // 1 = PDF, 2 = Excel
  fileNamePrefix: string, // Prefijo para el archivo exportado
  setExportFormat: React.Dispatch<React.SetStateAction<string>> // Resetear el formato
) => {
  try {
    const response = await apiClient.get(exportUrl, { responseType: "blob" });
    if (response.status === 200) {
      if (exportFormat === "1") {
        mostrarAlerta("En proceso", "Intentelo más tarde", "warning");
      } else if (exportFormat === "2") {
        mostrarAlerta("Exportación Exitosa",`La ${fileNamePrefix} se descargará en breve.`,"success");
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        const hoy = new Date();
        const formatDate = hoy.toISOString().split("T")[0];
        link.setAttribute("download", `${fileNamePrefix}-${formatDate}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        setExportFormat(""); 
      } else {
        mostrarAlerta("Formato inválido", "Formato de exportación no válido.", "error");
      }
    } else {
      mostrarAlerta(
        "Error","Ocurrió un error al exportar. Inténtelo nuevamente más tarde.","error"
      );
    }
  } catch (error) {
    mostrarAlerta(
      "Error inesperado","Ocurrió un error al exportar. Inténtelo nuevamente más tarde.","error"
    );
  }
};
