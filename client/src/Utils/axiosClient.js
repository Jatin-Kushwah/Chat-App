import axios from "axios";
import {
    KEY_ACCESS_TOKEN,
    getItem,
    removeItem,
    setItem,
} from "./localStorageManager";
import store from "../redux/Store";
import { setBarLoading, showToast } from "../redux/slices/appConfigSlice";
import { TOAST_SUCCESS, TOAST_FAILURE } from "../App";

let baseURL = "http://localhost:4000";
if (process.env.NODE_ENV === "production") {
    baseURL = "https://chat-app-kappa-beryl.vercel.app";
}

export const axiosClient = axios.create({
    baseURL,
    withCredentials: true,
});

axiosClient.interceptors.request.use((request) => {
    const accessToken = getItem(KEY_ACCESS_TOKEN);
    request.headers["Authorization"] = `Bearer ${accessToken}`;
    store.dispatch(setBarLoading(true));

    return request;
});

axiosClient.interceptors.response.use(
    async (response) => {
        store.dispatch(setBarLoading(false));
        const data = response.data;
        if (data.status === "ok") {
            if (
                data.result &&
                typeof data.result === "string" &&
                data.result.trim() !== ""
            ) {
                store.dispatch(
                    showToast({
                        type: TOAST_SUCCESS,
                        message: data.result,
                    })
                );
            }
            return data;
        }

        const originalRequest = response.config;
        const statusCode = data.statusCode;
        const error = data.message;

        store.dispatch(
            showToast({
                type: TOAST_FAILURE,
                message: error,
            })
        );

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
    },
    async (error) => {
        store.dispatch(setBarLoading(false));
        store.dispatch(
            showToast({
                type: TOAST_FAILURE,
                message: error.message,
            })
        );
        return Promise.reject(error);
    }
);
