export const Api_Global_Puestos = {
    puestos: {
        //el fetch es listar
        fetch: (page: number, idGiroNegocio: string, idBlock: string, numeroPuesto: string) =>
            `/puestos?page=${page}&id_gironegocio=${idGiroNegocio}&id_block=${idBlock}&numero_puesto=${numeroPuesto}`,
        exportar: () => `puestos/exportar`,
        eliminar: (id: number) => `/puestos/${id}`,
        registrar:() => `/puestos`,
        editar: (id_puesto: number | undefined) => `/puestos/${id_puesto}`, 
        asignarPuesto:() =>`/puestos/asignar`,
        transferir:()=>`/puestos/transferir`,
        buscar:(page: number, per_page: number, idGiroNegocio: string, idBlock: string, numeroPuesto: string, idSocio: string = "") => `/puestos?page=${page}&per_page=${per_page}&id_gironegocio=${idGiroNegocio}&id_block=${idBlock}&numero_puesto=${numeroPuesto}&id_socio=${idSocio}`,
        sinSocio:(idBlock: number) => `/puestos/sin-socio?id_block=${idBlock}`,
        sinInquilino:(idBlock: number) => `/puestos/sin-inquilino?id_block=${idBlock}`,
    },
    inquilinos: {
        registrar:()=>`/inquilinos`,
        editar: (id: string | undefined) => `/inquilinos/${id}`,
        eliminar: (id: number) => `/inquilinos/${id}`,
    },
    bloques: {
        listar: () => `/blocks`,
        registrar:()=>`/blocks`,
    },
    girosNegocio: {
        listar: () => `/giro-negocios`,
        registrar:()=>`/giro-negocios`,

    },
};
