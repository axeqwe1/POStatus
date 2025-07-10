import { toast } from "sonner";
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
export const registerUser = async (data: any) => {
  try {
    const res = await apiService.post("/api/User/Register", data);
    console.log(res);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
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

export const changePassword = async (userId: number, NewPassword: string) => {
  try {
    const res = await apiService.put(`/api/User/${userId}/change-password`, {
      NewPassword,
    });
    console.log(res);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const changePasswordUser = async (
  userId: number,
  NewPassword: string,
  OldPassword: string
) => {
  try {
    const res = await apiService.put(
      `/api/User/${userId}/change-password-user`,
      {
        NewPassword,
        OldPassword,
      }
    );
    console.log(res);
    return res;
  } catch (error: any) {
    console.error(error);
    toast.error(error.response?.data || "Failed to change password");
    throw error;
  }
};

export const deleteUser = async (userId: number) => {
  try {
    const res = await apiService._delete(`/api/User/Delete/${userId}`);
    console.log(res);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getEmail = async (userId: number) => {
  try {
    const res = await apiService.get(`/api/User/GetEmail/${userId}`);
    console.log(res);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const setActiveEmail = async (emailId: string, isActive: boolean) => {
  try {
    const res = await apiService.put(
      `/api/User/setActiveEmail/${emailId}?isActive=${isActive}`
    );
    console.log(res);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const resetPassword = async (userId: number, newPassword: string) => {
  try {
    const res = await apiService.put(`/api/User/${userId}/change-password`, {
      NewPassword: newPassword,
    });
    console.log(res);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
