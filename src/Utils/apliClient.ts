import axios from "axios";
import Cookies from "js-cookie";

//instancia de Axios + config global
const apiClient = axios.create({
  baseURL: "https://mercadolasestrellas.online/intranet/public/v1",
  // baseURL: "http://127.0.0.1:8000/v1",
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

