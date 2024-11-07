export const Api_Global_Reportes = {
  reportes: {
    fetch: (page: number, buscarTexto: string) =>`/reportes?page=${page}&buscar_texto=${buscarTexto}`,
    exportarResumen: () => `/reportes/resumen-por-puestos/exportar`,
    exportarReportePagos:()=> `/reportes/pagos/exportar`,
    exportarReporteDeudas:()=> `/reportes/deudas/exportar`,
    exportarReporteCuotasMetrado:()=> `/reportes/cuota-por-metros/exportar`,
    exportarReporteCuotasPuesto:()=> `/reportes/cuota-por-puestos/exportar`,
  },
};
