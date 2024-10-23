import { useState, useEffect } from 'react';
import axios from 'axios';
import { GiroNegocio } from '../../interface/Puestos';
import { Api_Global_Puestos } from '../../service/PuestoApi';
import apiClient from '../../Utils/apliClient';

const useGirosNegocio = () => {
    const [girosNegocio, setGirosNegocio] = useState<GiroNegocio[]>([]);
    useEffect(() => {
        const fechGiroNegocio = async () => {
            try {
                const response = await apiClient.get(Api_Global_Puestos.girosNegocio.listar());
                setGirosNegocio(response.data.data);
            } catch (error) {
            }
        };
        fechGiroNegocio();
    }, []);


    return girosNegocio;
};

export default useGirosNegocio;
