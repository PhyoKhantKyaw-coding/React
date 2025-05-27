import axios from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

axios.defaults.baseURL = 'https://localhost:7164/api/v1/';

axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get('token'); 
    if (token) {
      config.headers!.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = '/auth/login';
      Cookies.remove('token'); 
    }
    return Promise.reject(error);
  }
);

export default axios;