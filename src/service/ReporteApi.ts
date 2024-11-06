export const Api_Global_Reportes = {
  reportes: {
    fetch: (page: number, buscarTexto: string) =>`/reportes?page=${page}&buscar_texto=${buscarTexto}`,
    exportarResumen: (idPuesto: number) => `/reportes/resumen-por-puestos/exportar?id_puesto=${idPuesto}`,
    exportarReportePagos:(idSocio: number)=> `/reportes/pagos/exportar?id_socio=${idSocio}`,
    exportarReporteDeudas:(idPuesto: number)=> `/reportes/deudas/exportar?id_puesto=${idPuesto}`,
    exportarReporteCuotasMetrado:(idCuota: number)=> `/reportes/cuota-por-metros/exportar?id_cuota=${idCuota}`,
    exportarReporteCuotasPuesto:(idPuesto: number)=> `/reportes/cuota-por-puestos/exportar?id_puesto=${idPuesto}`,
  },
};
