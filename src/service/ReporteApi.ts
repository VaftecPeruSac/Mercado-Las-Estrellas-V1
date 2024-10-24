export const Api_Global_Reportes = {
  reportes: {
    fetch: (page: number, buscarTexto: string) =>`/reportes?page=${page}&buscar_texto=${buscarTexto}`,
    exportarResumen: () => `reporte-resumen/exportar`,
    exportarReportePagos:()=> `/reporte-pagos/exportar`,
    exportarReporteDeudas:()=> `/reporte-deudas/exportar`,

  },
};
