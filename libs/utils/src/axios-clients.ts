import { HttpException } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";

const api = (baaseUrl: string, token = ""): AxiosInstance => {
    const api = axios.create();
    api.defaults.baseURL = baaseUrl;
    if(token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    api.interceptors.response.use(
        (response) => response,
        (error) => {
            return Promise.reject(new HttpException(error.response?.data, error.response?.status));
        }
    );
    return api;
} 

export const genericHttpConsumer = () => {
    return api("");
}