export const API_ROUTES = {
  servicios: {
    fetch: (page: number, buscarTexto: string) =>
      `/servicios?page=${page}&buscar_texto=${buscarTexto}`,
    exportar: () => `/servicios/exportar`,
    eliminar: (id: number) => `/servicios/${id}`,
  },
};