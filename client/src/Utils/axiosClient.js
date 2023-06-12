import axios from "axios";
import {
    KEY_ACCESS_TOKEN,
    getItem,
    removeItem,
    setItem,
} from "./localStorageManager";

let baseURL;

export const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_SERVER_BASE_URL || "http://localhost:4000",
    withCredentials: true,
});

axiosClient.interceptors.request.use((request) => {
    const accessToken = getItem(KEY_ACCESS_TOKEN);
    request.headers["Authorization"] = `Bearer ${accessToken}`;

    return request;
});

axiosClient.interceptors.response.use(async (response) => {
    const data = response.data;
    if (data.status === "ok") {
        return data;
    }

    const originalRequest = response.config;
    const statusCode = data.statusCode;
    const error = data.message;

    if (statusCode === 401 && !originalRequest._retry) {
        // means the access token has expired
        originalRequest._retry = true;

        const response = await axios
            .create({
                baseURL,
                withCredentials: true,
            })
            .get(`/auth/refresh`);

        if (response.data.status === "ok") {
            setItem(KEY_ACCESS_TOKEN, response.data.result.accessToken);
            originalRequest.headers[
                "Authorization"
            ] = `Bearer ${response.data.result.accessToken}`;

            const refreshedResponse = await axios(originalRequest);
            return refreshedResponse.data;
        } else {
            window.location.replace("/login", "_self");
            removeItem(KEY_ACCESS_TOKEN);
            return Promise.reject(error);
        }
    }
    return Promise.reject(error);
});
