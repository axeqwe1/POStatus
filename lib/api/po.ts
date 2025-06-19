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

export const SaveStatusDownload = async (PONo: string) => {
  try {
    const res = await apiService.post(`/api/PO/SaveDownloadStatus/${PONo}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export default { GetPO };
