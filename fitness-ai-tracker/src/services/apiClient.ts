import axios from "axios";
import { store } from "../app/store";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const api = axios.create({ baseURL });
// Attach JWT token  `user.token`
api.interceptors.request.use((config) => {
    const token = store.getState().user.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default api;
