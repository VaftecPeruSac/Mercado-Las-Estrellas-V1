export const Api_Global_Reportes = {
  reportes: {
    fetch: (page: number, buscarTexto: string) =>`/reportes?page=${page}&buscar_texto=${buscarTexto}`,
    exportarResumen: () => `/reportes/resumen-por-puestos/exportar`,
    exportarReportePagos:()=> `/reportes/pagos/exportar`,
    exportarReporteDeudas:()=> `/reportes/deudas/exportar`,
    exportarReporteCuotasMetrado:()=> `/reportes/cuota-por-metros/exportar`,
    exportarReporteCuotasPuesto:()=> `/reportes/cuota-por-puestos/exportar`,

    dashboard:() => `/reportes/dashboard`,
    deudas:(page: number, per_page: number, idPuesto: number) => `/reportes/deudas?page=${page}&per_page=${per_page}&id_puesto=${idPuesto}`,
    deudasExportar:() => `/reporte-deudas/exportar`,
    cuotaPorMetros:(page: number, per_page: number, idCuota: number) => `/reportes/cuota-por-metros?page=${page}&per_page=${per_page}&id_cuota=${idCuota}`,
    cuotaPorPuestos:(page: number, per_page: number, idPuesto: number) => `/reportes/cuota-por-puestos?page=${page}&per_page=${per_page}&id_puesto=${idPuesto}`,
    pagos:(page: number, per_page: number, idSocio: number) => `/reportes/pagos?page=${page}&per_page=${per_page}&id_socio=${idSocio}`,
    resumenPorPuestos:(page: number, per_page: number, idPuesto: number) => `/reportes/resumen-por-puestos?page=${page}&per_page=${per_page}&id_puesto=${idPuesto}`,
  },
};
