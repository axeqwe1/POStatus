import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { refresh } from "./api/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in .env");
}

const Axios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

Axios.interceptors.request.use(
  (config) => {
    // กรณีอัปโหลดไฟล์: เปลี่ยน Content-Type เป็น multipart/form-data
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    // เพิ่ม Token จาก localStorage (ถ้ามี)
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
Axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isUnauthorized = error.response?.status === 401;
    const url = new URL(originalRequest.url, API_BASE_URL).pathname;
    const isRefreshCall = url === "/api/Auth/refresh";
    const isLoginCall = url === "/api/Auth/login";
    const isLogoutCall = url === "/api/Auth/logout";
    const hasAuthenCookie = document.cookie.includes("auth_status");
    // const isCheckAuthen = url === "/api/Auth/me";

    // ถ้าเป็น login call ที่ fail ให้ส่ง error กลับไปตรงๆ
    if (isUnauthorized && isLoginCall) {
      return Promise.reject(error);
    }

    if (
      isUnauthorized &&
      !originalRequest._retry &&
      !isRefreshCall &&
      !isLoginCall &&
      hasAuthenCookie
    ) {
      originalRequest._retry = true;

      try {
        // ส่ง request โดยไม่ต้องใส่ body เพราะ backend อ่านจาก cookie
        const res = await refresh();
        console.log(res);
        // ไม่ต้องเก็บ token ใน localStorage เพราะใช้ cookie
        // แค่ retry original request
        return Axios(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        // redirect ไป login page
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const get = (
  url: string,
  params: any = {},
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse> => {
  return Axios({
    method: "get",
    url,
    params,
    ...config,
  });
};

const post = (
  url: string,
  data = {},
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse> => {
  return Axios({
    method: "post",
    url,
    data,
    ...config,
  });
};

const put = (
  url: string,
  data = {},
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse> => {
  return Axios({
    method: "put",
    url,
    data,
    ...config,
  });
};

const patch = (
  url: string,
  data = {},
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse> => {
  return Axios({
    method: "patch",
    url,
    data,
    ...config,
  });
};

const _delete = (
  url: string,
  data = {},
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse> => {
  return Axios({
    method: "delete",
    url,
    data,
    ...config,
  });
};

const mediaUpload = (
  url: string,
  data = {},
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse> => {
  return Axios({
    method: "post",
    url,
    data,
    ...config,
  });
};

const request = (config: AxiosRequestConfig = {}): Promise<AxiosResponse> => {
  return Axios(config);
};

export const apiService = {
  get,
  post,
  put,
  patch,
  _delete,
  mediaUpload,
  request,
};
