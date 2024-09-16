import axios from "axios";
import React, { useEffect, useState } from 'react'

// const BaseApi = () => {
//     // const [socios, setSocios] = useState([]);

//     // const fetchData = () => {
//     //     return axios.get("http://127.0.0.1:8000/v1/personas")
//     //         .then((response) => setSocios(response.data));
//     // }
//     // useEffect(() => {
//     //     fetchData();
//     // }, [])
// }

// export default BaseApi

// axios.defaults.withCredentials = true; // Habilita el envío de cookies

// axios.interceptors.request.use((config) => {
//   const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
//   if (token) {
//     config.headers['X-XSRF-TOKEN'] = token;
//   }
//   return config;
// });