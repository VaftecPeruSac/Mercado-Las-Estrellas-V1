
export const Api_Global_Puestos = {
    puestos: {
        //el fetch es listar
        fetch: (page: number, idGiroNegocio: string, idBlock: string, numeroPuesto: string) =>
            `/puestos?page=${page}&id_gironegocio=${idGiroNegocio}&id_block=${idBlock}&numero_puesto=${numeroPuesto}`,
        exportar: () => `puestos/exportar`,
        eliminar: (id: number) => `/puestos/${id}`,
        registrar:() => `/puestos`,
        editar: (id: string | undefined) => `/puestos/${id}`, 
        asignarPuesto:() =>`/puestos/asignar`,



    },
    
    bloques: {
        fetch: () => `/blocks`,
    },
    girosNegocio: {
        fetch: () => `$/giro-negocios`,
    },
};
