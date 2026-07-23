import { errorMsg, successMsg } from "@/app/services/notify";
import { decryptToken } from "../utils/decryptToken";
import axios from "axios";
import Cookies from "js-cookie";
import { statusChecker } from "./statusChecker";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 500000,
});
apiClient.interceptors.request.use(
  (config) => {
    // Check if we are on the client side
    if (typeof window !== "undefined") {
      const token = decryptToken(Cookies.get("auth_token"));
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return statusChecker(response);
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 400:
          errorMsg(data.message || "An error occured. Please try again");
          break;
        case 401:
          errorMsg("Unauthorized! Please log in.");
          if (typeof window !== "undefined") window.location.href = "/login";
          break;
        case 403:
          errorMsg("Access Denied! You do not have permission");
          break;
        case 500:
          errorMsg("Server error! Please try again later");
          break;
        default:
          errorMsg("An error occured. Please try again");
      }
    } else {
      errorMsg(error.message || "Network error! Please check your connection");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
