import apiClient from "./apliClient";
import { mostrarAlerta } from "../components/Alerts/Registrar";

export const handleExport = async (
  exportUrl: string, // URL para exportar
  exportFormat: string, // 1 = PDF, 2 = Excel
  fileNamePrefix: string, // Prefijo para el archivo exportado
  setExportFormat: React.Dispatch<React.SetStateAction<string>>, // Resetear el formato
  params?: string, // Parámetros adicionales
) => {
  try {
    if (exportFormat === "1") {
      let response;
      if (params) {
        response = await apiClient.get(`${exportUrl}-pdf?${params}`, { responseType: "blob" });
      } else {
        response = await apiClient.get(`${exportUrl}-pdf`, { responseType: "blob" });
      }      
      if (response.status === 200) {
        mostrarAlerta("Exportación Exitosa",`Podra visualizar la ${fileNamePrefix} en breve.`,"success");
        const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
        window.open(url, "_blank");
        setExportFormat("");
      } else {
        mostrarAlerta("Error","Ocurrió un error al exportar. Inténtelo nuevamente más tarde.","error");
      }
    } else if (exportFormat === "2") {
      let response;
      if (params) {
        response = await apiClient.get(`${exportUrl}?${params}`, { responseType: "blob" });
      } else {
        response = await apiClient.get(`${exportUrl}`, { responseType: "blob" });
      }
      if (response.status === 200) {
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
        mostrarAlerta("Error","Ocurrió un error al exportar. Inténtelo nuevamente más tarde.","error");
      }
    } else {
      mostrarAlerta("Formato inválido", "Formato de exportación no válido.", "error");
    }
  } catch (error) {
    mostrarAlerta(
      "Error inesperado","Ocurrió un error al exportar. Inténtelo nuevamente más tarde.","error"
    );
  }
};