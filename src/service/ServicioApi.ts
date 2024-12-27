
export const API_ROUTES = {
  servicios: {
    fetch: (page: number, buscarTexto: string) =>
      `/servicios?page=${page}&buscar_texto=${buscarTexto}`,
    exportar: () => `/servicios/exportar`,
    registrar:()=> `/servicios`,
    editar: (id: string | undefined) => `/servicios/${id}`, 
    eliminar: (id: number) => `/servicios/${id}`,
  },
  socios: { 
    listar: () => `/socios/seleccionar` 
  },
  puestos: {
    listarPorSocio: (idSocio: number) => `/socios/ver-puestos?id_socio=${idSocio}`,
    totalPuestos: () => `/puestos/total`,
    areaTotal: () => `/puestos/area-total`,
  },
  multaInasistencia: {
    registrar: () => `/deudas/registrar-multa-inasistencia`,
    importe: () => `/servicios/consultar-importe-multa-inasistencia`,
  }
};