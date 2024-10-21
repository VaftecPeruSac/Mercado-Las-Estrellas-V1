const BASE_URL = "https://mercadolasestrellas.online/intranet/public/v1";

export const Api_Global_Reportes = {
  reportes: {
    fetch: (page: number, buscarTexto: string) =>`${BASE_URL}/reportes?page=${page}&buscar_texto=${buscarTexto}`,
    exportarResumen: () => `${BASE_URL}/reporte-resumen/exportar`,
    exportarReportePagos:()=> `${BASE_URL}/reporte-pagos/exportar`,
    exportarReporteDeudas:()=> `${BASE_URL}/reporte-deudas/exportar`,

  },
};
