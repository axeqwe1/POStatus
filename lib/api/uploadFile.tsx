import { AxiosDefaults, AxiosHeaders } from "axios";
import { apiService } from "../axios";

// API Functions (ตัวอย่าง)
export const uploadFile = async (
  files: FileList,
  UploadType: number, // 1 = PO, 2 = Supplier
  poNo: string
) => {
  try {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append(`Files`, files[i]);
    }
    formData.append("PONo", poNo);
    formData.append("UploadType", UploadType.toString());
    console.log(formData.get("Files"));
    const response = await apiService.post("api/FileUpload/upload", formData);

    return response.data;
  } catch (error: any) {
    console.error("Error uploading file:", error);
    throw new Error(error.response?.data?.message || "File upload failed");
  }
};

export const deleteFile = async (fileId: string) => {
  try {
    const response = await apiService._delete(
      `api/FileUpload/delete/${fileId}`
    );
    if (response.status !== 200) {
      throw new Error("Failed to delete file");
    }
    console.log("File deleted successfully:", response.data);
    return response;
  } catch (error: any) {
    console.error("Error deleting file:", error);
    throw new Error("File deletion failed", error);
  }
};

export const DownloadFile = async (fileId: string) => {
  try {
    const response = await apiService.get(
      `api/FileUpload/download/${fileId}`,
      {},
      {
        responseType: "blob",
        validateStatus: () => true, // ✅ ป้องกันไม่ให้ axios throw อัตโนมัติ
      }
    );

    const contentType = response.data.type;

    if (response.status >= 400 && contentType === "application/json") {
      const errorText = await blobToText(response.data);
      const errorJson = JSON.parse(errorText);
      throw errorJson;
    }
    console.log(response);
    return response;
  } catch (error: any) {
    console.error("Error downloading file:", error.message);
    throw error.message;
  }
};

export const getFilePo = async (PONo: string, uploadType: number) => {
  try {
    const res = await apiService.get(
      `api/FileUpload/files/${PONo}?uploadType=${uploadType}`
    );
    return res;
  } catch (error) {
    console.error("Error fetching file PO:", error);
    throw new Error("Failed to fetch file PO");
  }
};

export const UpdateDescription = async (
  fileId: string,
  description: string
) => {
  try {
    const response = await apiService.put(
      `api/FileUpload/update-description/${fileId}`,
      { description } // ส่ง description เป็น object
    );
    return response;
  } catch (error) {
    console.error("Error updating file description:", error);
    throw new Error("Failed to update file description");
  }
};

// ✅ helper function แปลง Blob เป็น text
const blobToText = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(blob);
  });
};
