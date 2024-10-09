import { useState, useEffect } from 'react';
import axios from 'axios';
import { Api_Global_Puestos } from '../../service/PuestoApi';
import { Bloque } from '../../interface/Puestos';

const useBloques = () => {
    const [bloques, setBloques] = useState<Bloque[]>([]);

    useEffect(() => {
        const fetchBloques = async () => {
            try {
                const response = await axios.get(Api_Global_Puestos.bloques.fetch());
                setBloques(response.data.data);
            } catch (error) {
                console.error("Error al obtener los bloques", error);
            }
        };
        fetchBloques();
    }, []);

    return bloques;
};

export default useBloques;
