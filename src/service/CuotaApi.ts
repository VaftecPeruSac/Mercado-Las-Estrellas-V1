export const Api_Global_Cuotas = {
  cuotas: {
    listar: (page: number = 1, anio: string , mes: string) =>
        `/cuotas?page=${page}&anio=${anio}&mes=${mes}`,
    registrar:() => `/cuotas`,
    registrarPorPuesto:() => `/cuotas/por-puestos`,
    exportar: () => `cuotas/exportar`,
  },
  servicio: {
    listar: () => `/servicios?per_page=1000`,
   
},
  puesto: {
    listar: () => `/puestos?per_page=1000`,
  },
};
