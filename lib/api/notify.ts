import { apiService } from "../axios";

export const GetNotifyCount = async (userId: string) => {
  try {
    const res = await apiService.get(`/api/Notification/GetNotify/${userId}`);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const GetNotifyData = async (userId: string) => {
  try {
    const res = await apiService.get(
      `/api/Notification/GetNotifyData/${userId}`
    );
    return res.data;
    //
  } catch (error) {
    console.error(error);
    throw error;
  }
};
