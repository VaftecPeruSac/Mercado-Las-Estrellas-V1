import { useState, useEffect } from 'react';
import axios from 'axios';
import { GiroNegocio } from '../../interface/Puestos';
import { Api_Global_Puestos } from '../../service/PuestoApi';

const useGirosNegocio = () => {
    const [girosNegocio, setGirosNegocio] = useState<GiroNegocio[]>([]);

    useEffect(() => {
        const fechGiroNegocio = async () => {
            try {
                const response = await axios.get(Api_Global_Puestos.girosNegocio.fetch());
                console.log("Giros de negocio obtenidos:", response.data.data);
                setGirosNegocio(response.data.data);
            } catch (error) {
                console.error("Error al obtener los giro de negocio", error);
            }
        };
        fechGiroNegocio();


    }, []);


    return girosNegocio;
};

export default useGirosNegocio;
