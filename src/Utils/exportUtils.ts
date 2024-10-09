import axios from "axios";

export const handleExport = async (
  exportUrl: string, // URL para exportar
  exportFormat: string, // 1 = PDF, 2 = Excel
  fileNamePrefix: string, // Prefijo para el nombre del archivo exportado
  setExportFormat: React.Dispatch<React.SetStateAction<string>> // Función para resetear el formato
) => {
  try {
    const response = await axios.get(exportUrl, {
      responseType: "blob",
    });

    if (response.status === 200) {
      if (exportFormat === "1") {
        // Exportar a PDF
        alert("En proceso de actualización. Inténtelo más tarde.");
      } else if (exportFormat === "2") {
        // Exportar a Excel
        alert(`La lista de ${fileNamePrefix} se descargará en breve.`);
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
        alert("Formato de exportación no válido.");
      }
    } else {
      alert("Ocurrió un error al exportar. Inténtelo nuevamente más tarde.");
    }
  } catch (error) {
    alert("Ocurrió un error al exportar. Inténtelo nuevamente más tarde.");
  }
};
