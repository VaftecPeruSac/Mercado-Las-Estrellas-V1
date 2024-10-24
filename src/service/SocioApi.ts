
export const Api_Global_Socios = {
  socios: {
    fetch: (page: number, buscarTexto: string) =>
      `/socios?page=${page}&buscar_texto=${buscarTexto}`,
    exportar: () => `/socios/exportar`,
    eliminar: (id_socio: string) => `/socios/${id_socio}`, 
    registrar:()=> `/socios`,
    editar: (id: string | undefined) => `/socios/${id}`, 
  },
  bloques:{
    obtenerBloques:()=> `/blocks`,
  },
  puestos:{
    obtenerPuestos:()=> `/puestos/select`,
  }
};
