import { apiService } from "../axios";

export const GetPO = async (suppCode: string) => {
  try {
    const res = await apiService.get(`/api/PO/GetPo/${suppCode}`);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const GetAllPO = async (page: number, pageSize: number) => {
  try {
    const res = await apiService.get(
      `/api/PO/GetAllPO?page=${page + 1}&pageSize=${pageSize}`
    );
    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const SaveStatusDownload = async (PONo: string) => {
  try {
    const res = await apiService.post(`/api/PO/SaveDownloadStatus/${PONo}`);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default { GetPO };
