import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  timeout: 40000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      // 🚀 Nome EXATO do cookie revelado pela sua Server Action
      const token = Cookies.get("@PromoDay:token");

      if (token) {
        config.headers.set
          ? config.headers.set("Authorization", `Bearer ${token}`)
          : (config.headers.Authorization = `Bearer ${token}`);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
