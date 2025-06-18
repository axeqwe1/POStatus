import { apiService } from "../axios";

export const getUserAll = async () => {
  try {
    const res = await apiService.get("/api/User/GetAll");
    console.log(res);
    return res.data; // Assuming the response contains the user data in the 'data' property
  } catch (ex: any) {
    console.error("Error fetching all users:", ex);
    throw ex; // Re-throw the error for further handling if needed
  }
};

export const updateUser = async (userId: number, data: any) => {
  try {
    const res = await apiService.put("/api/User/UpdateUser/" + userId, data);
    console.log(res);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
