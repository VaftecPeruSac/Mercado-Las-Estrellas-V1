import axios from "axios";
import Cookies from "js-cookie";

// Crear instancia de Axios con configuración global
const apiClient = axios.create({
  baseURL: "https://mercadolasestrellas.online/intranet/public/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar automáticamente el token a cada petición
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;

