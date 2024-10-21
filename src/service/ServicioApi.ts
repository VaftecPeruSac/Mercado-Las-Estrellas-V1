const BASE_URL = "https://mercadolasestrellas.online/intranet/public/v1";

export const API_ROUTES = {
  servicios: {
    fetch: (page: number, buscarTexto: string) =>
      `${BASE_URL}/servicios?page=${page}&buscar_texto=${buscarTexto}`,
    exportar: () => `${BASE_URL}/servicios/exportar`,
    eliminar: (id: number) => `${BASE_URL}/servicios/${id}`,  
  },
};
