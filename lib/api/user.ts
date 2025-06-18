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
