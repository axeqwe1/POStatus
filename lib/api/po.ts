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

export const GetPOByPONo = async (PONo: string) => {
  try {
    const res = await apiService.get(`api/PO/GetPONo/${PONo}`);
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

export const InsertTemp = async (PONo: string, Comname: string) => {
  try {
    const request = { PONo, Comname };
    const res = await apiService.post(`/api/PO/InsertTemp`, request);
    return res;
  } catch (err: any) {
    console.error(err);
    throw err;
  }
};

export default { GetPO };
