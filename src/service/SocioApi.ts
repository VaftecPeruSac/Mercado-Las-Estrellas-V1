
export const Api_Global_Socios = {
  socios: {
    fetch: (page: number, nombreSocio: string, numeroPuesto: string) =>
      `/socios?page=${page}&nombre_socio=${nombreSocio}&numero_puesto=${numeroPuesto}`,
    exportar: () => `/socios/exportar`,
    eliminar: (id_socio: number) => `/socios/${id_socio}`, 
    registrar:()=> `/socios`,
    editar: (id_socio: number | undefined) => `/socios/${id_socio}`, 
    buscar:(page: number, per_page: number) => `/socios?page=${page}&per_page=${per_page}`,
  },
  bloques:{
    obtenerBloques:()=> `/blocks`,
  },
  puestos:{
    obtenerPuestos:(id_block: number)=> `/puestos/sin-socio?id_block=${id_block}`,
  }
};
