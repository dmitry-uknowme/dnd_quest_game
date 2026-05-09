import { AxiosError, AxiosResponse } from "axios";
import axios from "axios";

export const BACKEND_URL = import.meta.env.VITE_BACKEND_BASE_URL;
const AUTH_TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY;
const apiClient = axios.create({ baseURL: BACKEND_URL });

apiClient.interceptors.request.use(async (config) => {
  config.headers["Accept-Language"] = navigator.languages.join(";");
  if (config.headers["Authorization"]) return config;
  //   const authToken = getCookie(AUTH_TOKEN_KEY);
  //   config.headers.Authorization = `Bearer ${authToken}`;
  return config;
});

apiClient.interceptors.response.use(
  (response: AxiosResponse<unknown>) => {
    return response;
  },
  (error: AxiosError<unknown>) => {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      //   removeCookie(AUTH_TOKEN_KEY);
      throw error;
    }
    if (error?.response?.status === 500) {
      //   toast.error(`Возникла непредвиденная ошибка на сервере`);
    }
    throw error;
  },
);

export default apiClient;
