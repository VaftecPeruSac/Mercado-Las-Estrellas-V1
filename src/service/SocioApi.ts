const BASE_URL = "https://mercadolasestrellas.online/intranet/public/v1";

export const Api_Global_Socios = {
  socios: {
    fetch: (page: number, buscarTexto: string) =>
      `${BASE_URL}/socios?page=${page}&buscar_texto=${buscarTexto}`,
    exportar: () => `${BASE_URL}/socios/exportar`,
    detalles: (id_socio: string) => `${BASE_URL}/socios/${id_socio}`, 
  },
};
