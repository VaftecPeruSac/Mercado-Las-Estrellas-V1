
export const Api_Global_Socios = {
  socios: {
    fetch: (page: number, nombreSocio: string, numeroPuesto: string) =>
      `/socios?page=${page}&nombre_socio=${nombreSocio}&numero_puesto=${numeroPuesto}`,
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
