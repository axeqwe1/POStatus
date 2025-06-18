import { apiService } from "../axios";
export const signIn = async (username: string, password: string) => {
  try {
    const response = await apiService.post("/api/Auth/login", {
      username,
      password,
    });
    return response;
  } catch (error: any) {
    return error; // Re-throw the error for further handling if needed
  }
};

export const signOut = async () => {
  try {
    const response = await apiService.post(
      "/api/Auth/logout",
      {},
      {
        withCredentials: true, // ใช้ cookie ในการส่ง request
      }
    );
    return response;
  } catch (ex: any) {
    console.error(ex);
    return ex;
  }
};
export const refresh = async () => {
  try {
    const response = await apiService.post(
      "/api/Auth/refresh",
      {},
      {
        withCredentials: true, // ใช้ cookie ในการส่ง request
      }
    );
    return response;
  } catch (error: any) {
    // ถ้าเป็น 401 ไม่ต้อง log
    if (error.response && error.response.status === 401) {
      // อาจคืนค่า null หรือ undefined ก็ได้
      return null;
    }
    // error อื่น log ปกติ
    console.error(error);
  }
};
export const me = async () => {
  try {
    const response = await apiService.get("/api/Auth/me");
    return response;
  } catch (error: any) {
    return error; // Re-throw the error for further handling if needed
  }
};
export default { signIn, signOut, me };
