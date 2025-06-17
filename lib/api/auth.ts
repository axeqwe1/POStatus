import { apiService } from "../axios";
export const login = async (username: string, password: string) => {
  try {
    const response = await apiService.post("/api/Auth/login", {
      username,
      password,
    });

    console.log(response);
    return response;
  } catch (error: any) {
    return error; // Re-throw the error for further handling if needed
  }
};

export default { login };
