import React, { useEffect, useRef } from "react";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { FileItem } from "@/types/datatype";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatFileSize } from "@/utils/utilFunction";
import { deleteFile, DownloadFile } from "@/lib/api/uploadFile";
import {
  IconCloudUpload,
  IconDownload,
  IconLoader2,
  IconPaperclip,
  IconPlus,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { FileIcon } from "@/utils/fileIcon";

export interface UploadPopoverGlobalProps {
  open: boolean;
  anchorRect: DOMRect | null;
  onOpenChange: (open: boolean) => void;
  PONo: string;
  files: FileItem[];
  isUploading: boolean;
  responseUpload?: (files: FileList, PONo: string) => Promise<void>;
  onDeleteFile?: (fileId: string) => void;
  onDownloadFile?: (fileId: string, filename: string) => void;
}

export const UploadPopoverGlobal: React.FC<UploadPopoverGlobalProps> = ({
  open,
  anchorRect,
  onOpenChange,
  PONo,
  files,
  isUploading,
  responseUpload,
  onDeleteFile,
  onDownloadFile,
}) => {
  // ปิด popover เมื่อ scroll หรือ resize
  useEffect(() => {
    if (!open) return;
    const close = () => onOpenChange(false);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close, true);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close, true);
    };
  }, [open, onOpenChange]);

  return (
    <Popover open={open} onOpenChange={onOpenChange} modal={false}>
      {anchorRect && (
        <PopoverContent
          side="left"
          // กำหนดตำแหน่งแบบ fixed โดยใช้ anchorRect
          style={{
            position: "fixed",
            top: anchorRect.bottom + window.scrollY - 40, // +8px for spacing
            left: anchorRect.left + window.scrollX - 375,
            minWidth: 380,
            zIndex: 1000,
            padding: 0,
            borderRadius: 8,
          }}
          // กำหนด className เพิ่มเติมได้
        >
          <div className="p-4 w-full max-w-md">
            <h4 className="font-medium text-sm mb-3">
              Upload Files for PO: {PONo}
            </h4>

            {/* File Drop Zone */}
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center cursor-pointer hover:border-gray-400 transition-colors"
              onDragOver={(e) => e.preventDefault()}
              onDrop={async (e) => {
                e.preventDefault();
                if (e.dataTransfer.files.length) {
                  await responseUpload?.(e.dataTransfer.files, PONo);
                }
              }}
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.multiple = true;
                input.accept = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png";
                input.onchange = async (e) => {
                  const files = (e.target as HTMLInputElement).files;
                  if (files) await responseUpload?.(files, PONo);
                };
                input.click();
              }}
            >
              <IconCloudUpload
                size={32}
                className="mx-auto mb-2 text-gray-400"
              />
              <p className="text-sm text-gray-600">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PDF, DOC, XLS, Images (Max 5MB each PO)
              </p>
            </div>

            {/* Uploaded Files */}
            {files.length > 0 && (
              <div className="space-y-2 mt-4">
                <h5 className="text-xs font-medium text-gray-700">
                  Uploaded Files ({files.length})
                </h5>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FileIcon fileType={file.type} />
                        <div className="flex-1 min-w-0">
                          <div className="truncate font-medium">
                            {file.name}
                          </div>
                          <div className="text-gray-500">
                            {formatFileSize(file.size)} •{" "}
                            {new Date(file.uploadDate).toLocaleDateString(
                              "th-TH"
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => onDownloadFile?.(file.id, file.name)}
                        >
                          <IconDownload size={12} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          onClick={() => onDeleteFile?.(file.id)}
                        >
                          <IconTrash size={12} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
};
