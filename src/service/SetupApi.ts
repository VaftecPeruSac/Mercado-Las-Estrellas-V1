export const Api_Global_Setup = {
    bancos: {
        listar: () => `/setup/bancos`,
    },
    bancoCuentas: {
        listar: (idBanco: number | string, perPage: number = 50) =>
            `/setup/banco-cuentas?per_page=${perPage}&id_banco=${idBanco}`,
    },
    anios: {
        listar: () => `/setup/anios`,
    },
    meses: {
        listar: () => `/setup/meses`,
    },
};