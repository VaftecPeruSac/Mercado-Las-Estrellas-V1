
export const API_ROUTES = {
  servicios: {
    fetch: (page: number, buscarTexto: string) =>
      `/servicios?page=${page}&buscar_texto=${buscarTexto}`,
    exportar: () => `/servicios/exportar`,
    registrar:()=> `/servicios`,
    editar: (id: string | undefined) => `/servicios/${id}`, 
    eliminar: (id: number) => `/servicios/${id}`,
  },
  //Constulas useEffect para listar socios en formularios
  socios: {
    listar: (perPage = 50) => `/socios?per_page=${perPage}`,
  },
  //Constulas useEffect para listar puestos por socio en formularios
  puestos: {
    listarPorSocio: (idSocio: number | string, perPage: number = 50): string =>
      `/puestos?per_page=${perPage}&id_socio=${idSocio}`,
  },
  
  
};