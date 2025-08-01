export const Api_Global_Cuotas = {
  cuotas: {
    listar: (page: number = 1, anio: string , mes: string) =>
        `/cuotas?page=${page}&anio=${anio}&mes=${mes}`,
    registrar:() => `/cuotas`,
    registrarPorPuesto:() => `/cuotas/por-puestos`,
    exportar: () => `cuotas/exportar`,
    buscar:(page: number, per_page: number) => `/cuotas?page=${page}&per_page=${per_page}`,
  },
  servicio: {
    listar: () => `/servicios?per_page=1000`,
   
},
  puesto: {
    listar: () => `/puestos?per_page=1000`,
  },
};
