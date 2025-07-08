import { apiService } from "../axios";

export const GetNotify = async (userId: string) => {
  try {
    const res = await apiService.get(`/api/Notification/GetNotify/${userId}`);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
