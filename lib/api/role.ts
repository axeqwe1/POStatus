import { apiService } from "../axios";

export const getRoleAll = async () => {
  try {
    const res = await apiService.get("/api/Role/GetAll");
    return res; // Assuming the response contains the role data in the 'data' property
  } catch (ex: any) {
    console.error("Error fetching all roles:", ex);
    throw ex; // Re-throw the error for further handling if needed
  }
};

export default { getRoleAll };
