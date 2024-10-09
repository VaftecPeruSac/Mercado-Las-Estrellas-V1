const BASE_URL = "https://mercadolasestrellas.online/intranet/public/v1";

export const Api_Global_Puestos = {
    puestos: {
        fetch: (page: number, idGiroNegocio: string, idBlock: string, numeroPuesto: string) =>
            `${BASE_URL}/puestos?page=${page}&id_gironegocio=${idGiroNegocio}&id_block=${idBlock}&numero_puesto=${numeroPuesto}`,
        exportar: () => `${BASE_URL}/puestos/exportar`,
    },
    bloques: {
        fetch: () => `${BASE_URL}/blocks`,
    },
    girosNegocio: {
        fetch: () => `${BASE_URL}/giro-negocios`,
    },
};
