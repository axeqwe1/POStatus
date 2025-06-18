import { apiService } from "../axios";

export const getSuppliers = async () => {
  try {
    const res = await apiService.get("/api/Supplier/GetAll");
    return res;
  } catch (ex: any) {
    console.error("Error fetching suppliers:", ex);
    throw ex; // Re-throw the error for further handling if needed
  }
};

export default { getSuppliers };
