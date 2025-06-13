import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

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

Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      alert("Session expired! Please login again.");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const get = (
  url: string,
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse> => {
  return Axios({
    method: "get",
    url,
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
