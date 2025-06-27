// API Functions (ตัวอย่าง)
const uploadFile = async (
  file: File,
  poNo: string
): Promise<{ id: string; url: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("poNo", poNo);

  const response = await fetch("/api/upload-file", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Upload failed");
  return response.json();
};

const deleteFile = async (fileId: string, poNo: string): Promise<void> => {
  const response = await fetch(`/api/delete-file/${fileId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ poNo }),
  });

  if (!response.ok) throw new Error("Delete failed");
};
