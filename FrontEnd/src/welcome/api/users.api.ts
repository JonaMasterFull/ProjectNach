import axios from "axios";

export const usersApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})