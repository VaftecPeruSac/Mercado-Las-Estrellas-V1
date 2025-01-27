export const Api_Global_Pagos = {
  pagos: {
    listar: (page: number = 1) => `/pagos?page=${page}`,
    exportar: () => `/pagos/exportar`,
    registrar:() => `/pagos`,
    registrarPorBanco:() => `/pagos/por-bancos`,

  },
  socios: {
    listar: (perPage: number = 50) => `/socios?per_page=${perPage}`,
  },
  puestos: {
    listarPorSocio: (idSocio: number | string, perPage: number = 50) =>
      `/puestos?per_page=${perPage}&id_socio=${idSocio}`,
  },
  cuotas: {
    pendientesPorPuesto: (
      idSocio: number | string,
      idPuesto: number | string,
      perPage: number = 50
    // ) =>`/cuotas/pendientes?per_page=${perPage}&id_socio=${idSocio}&id_puesto=${idPuesto}`,
    ) =>`/deudas/pendientes?per_page=${perPage}&id_socio=${idSocio}&id_puesto=${idPuesto}`,
  },
};
