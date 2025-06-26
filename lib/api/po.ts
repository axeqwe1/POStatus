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

export const GetAllPO = async () => {
  try {
    const res = await apiService.get(`/api/PO/GetAllPO`);
    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const GetPODetail = async (PONo: string) => {
  try {
    const res = await apiService.get(`/api/PO/GetPODetails/${PONo}`);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
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

export const RequestCancelPO = async (PONo: string, Remark: string) => {
  try {
    const res = await apiService.post(`/api/PO/RequestCancelPO`, {
      PONo,
      Remark,
    });

    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export default { GetPO };
