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
      formData.append("Files", files[i]);
    }
    formData.append("PONo", poNo);
    formData.append("UploadType", UploadType.toString());
    console.log(formData.get("Files"));
    const response = await apiService.post("api/FileUpload/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("File upload failed");
  }
};

export const deleteFile = async (
  fileId: string,
  poNo: string
): Promise<void> => {
  const response = await fetch(`/api/delete-file/${fileId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ poNo }),
  });

  if (!response.ok) throw new Error("Delete failed");
};

export const DownloadFile = async (fileId: string) => {
  try {
    const response = await apiService.get(
      `api/FileUpload/download/${fileId}`,
      {}, // ← ไม่มี params
      {
        responseType: "blob", // ← สำคัญ
      }
    );
    return response;
  } catch (error) {
    console.error("Error downloading file:", error);
    throw new Error("File download failed");
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
