import { ColumnDef, RowExpanding } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileItem,
  PO_Details,
  PO_Status,
  Product,
  Variant,
} from "@/types/datatype"; // สมมุติ
import { ColumnCheckboxFilter } from "@/components/ColumnCheckboxFilter";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuPortal,
} from "@radix-ui/react-dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  IconAutomation,
  IconCancel,
  IconCheck,
  IconCircleCheckFilled,
  IconClock,
  IconCloudUpload,
  IconCross,
  IconDotsVertical,
  IconDownload,
  IconLoader,
  IconLoader2,
  IconPaperclip,
  IconPlus,
  IconTrash,
  IconX,
  IconXPowerY,
} from "@tabler/icons-react";
import { DialogHeader } from "@/components/ui/dialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@radix-ui/react-dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerPortal,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Target } from "lucide-react";
import { DateRangeFilter } from "@/components/CustomDateFilter";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { FileIcon } from "@/utils/fileIcon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  deleteFile,
  DownloadFile,
  getFilePo,
  uploadFile,
} from "@/lib/api/uploadFile";
import { formatDate, formatFileSize } from "@/utils/utilFunction";

const downloadUrl = process.env.NEXT_PUBLIC_PO_URL;

export const getColumns = (
  onCancel?: (PONo: string, Remark: string) => void,
  isEdit?: boolean,
  setIsEdit?: (isEdit: boolean) => void,
  editItem?: string,
  setEditItem?: (item: string) => void,
  isDesktop?: boolean
): ColumnDef<PO_Status>[] => [
  {
    id: "PONo",
    accessorKey: "PONo",
    header: ({ column }) => (
      <div className="flex items-center gap-2">
        {/* PONo */}
        {/* <ColumnCheckboxFilter column={column} table={table} /> */}
        <Button
          className="hover:cursor-pointer !p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          PO Number
          <ArrowUpDown />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      return row.original.Supreceive ? (
        <a
          href={`${downloadUrl}pono=${row.original.PONo}&Company=POMatr`}
          // onMouseDown={() => {
          //   if (!row.original.Supreceive) {
          //     setEditItem?.(row.original.PONo);
          //   }
          //   window.open(
          //     `${downloadUrl}pono=${row.original.PONo}&Company=POMatr`,
          //     "_blank"
          //   );
          // }}
          target="_blank"
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
        >
          {row.original.PONo}
        </a>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="hover:cursor-default">{row.original.PONo}</span>
          </TooltipTrigger>
          <TooltipContent className="bg-neutral-800 text-white ">
            <span className="text-white ">
              Please Confirm PO before download.
            </span>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "supplierName",
    // ใส่ filter header dropdown!
    header: ({ column, table }) => (
      <div className="flex items-center gap-2">
        SupplierName
        <ColumnCheckboxFilter column={column} table={table} />
      </div>
    ),
    // รองรับ filter แบบ multi-checkbox
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true;
      // ในกรณีที่ filterValue เป็น array
      return filterValue.includes(row.getValue(columnId));
    },
    cell: ({ row }) => {
      return <div>{row.original.supplierName}</div>;
    },

    // (optional) enableFacetedValues: true,
  },
  {
    accessorKey: "Status",
    accessorFn: (row) =>
      row.cancelStatus === 1
        ? "RequestCancel"
        : row.cancelStatus === 2
        ? "Cancel"
        : row.Supreceive
        ? "Confirm"
        : !row.ClosePO
        ? "Process.. "
        : "Pending",
    // ใส่ filter header dropdown!
    header: ({ column, table }) => (
      <div className="flex items-center gap-2">
        Status
        <ColumnCheckboxFilter column={column} table={table} />
      </div>
    ),
    // รองรับ filter แบบ multi-checkbox
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true;
      // ในกรณีที่ filterValue เป็น array
      return filterValue.includes(row.getValue(columnId));
    },
    cell: ({ row }) => {
      const isConfirmed = row.original.Supreceive;
      const isCancel = row.original.cancelStatus;
      return (
        <Badge
          variant="outline"
          className={`text-muted-foreground px-1.5 ${
            isCancel
              ? "bg-red-200 dark:bg-red-900"
              : isConfirmed
              ? "bg-green-200 dark:bg-green-900"
              : row.original.ClosePO
              ? "bg-yellow-200 dark:bg-yellow-900"
              : "bg-blue-200 dark:bg-blue-900"
          }`}
        >
          {isCancel ? (
            <IconCancel className="fill-red-500 dark:fill-red-400" />
          ) : isConfirmed ? (
            <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
          ) : row.original.ClosePO ? (
            <IconClock className="fill-yellow-500 dark:fill-yellow-400" />
          ) : (
            <IconAutomation className="fill-blue-500 dark:fill-blue-400" />
          )}
          {isCancel === 1
            ? "RequestCancel"
            : isCancel === 2
            ? "Cancel"
            : isConfirmed
            ? "Confirm"
            : row.original.ClosePO
            ? "Pending"
            : "Process.. "}
        </Badge>
      );
    },

    // (optional) enableFacetedValues: true,
  },

  {
    accessorKey: "ApproveDate",
    accessorFn: (row) => {
      return !row.ClosePO
        ? "Not Approved"
        : row.sendDate
        ? new Date(row.sendDate).toLocaleDateString("th-TH", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "Not Approved";
    },
    header: ({ column }) => (
      <Button
        className="hover:cursor-pointer !p-0"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Lastest Approve Date
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.original.sendDate;
      return (
        <span className="pl-1">
          {!row.original.ClosePO
            ? "Not Approved"
            : row.original.sendDate
            ? new Date(row.original.sendDate).toLocaleDateString("th-TH", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "Not Approved"}
          {/* {date ? new Date(date).toLocaleDateString() : "Not downloaded"} */}
        </span>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue?.from) return true;

      const rowDate = new Date(row.getValue(columnId));
      const from = filterValue.from;
      const to = filterValue.to ?? from; // กรณีเลือกวันเดียว

      return rowDate >= from && rowDate <= to;
    },
    meta: {
      filterElement: DateRangeFilter, // custom meta key สำหรับ filter
    },
  },
  {
    accessorKey: "confirmDate",
    header: ({ column }) => (
      <Button
        className="hover:cursor-pointer !p-0"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Confirm Date
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.original.confirmDate;
      return (
        <span className="pl-1">
          {date
            ? new Date(row.original.confirmDate).toLocaleDateString("th-TH", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "Not Confirm"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: ({ column, table }) => {
      return <div>Confirm/Cancel</div>;
    },
    cell: ({ row }) => {
      const [remark, setRemark] = useState("");
      const [isOpen, setIsOpen] = useState(false);
      const [shouldClose, setShouldClose] = useState(false);

      const handleSubmit = (e: any) => {
        if (remark.trim() === "") {
          toast.error("Please enter a reason for cancellation.");
          return;
        }

        toast.success("Send request success.");
        onCancel?.(row.original.PONo, remark);

        setShouldClose(true);
        setTimeout(() => {
          setIsOpen(false);
          setShouldClose(false);
        }, 1000); // ตรงกับ duration
        e.preventDefault();
      };

      return (
        <>
          <div className="flex gap-3 pl-4">
            {row.original.ClosePO ? (
              <>
                {/* Confirm PO Button */}
                {!row.original.Supreceive && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="w-[25px] h-[25px] bg-neutral-200 hover:bg-neutral-300/70 hover:cursor-pointer">
                        <IconCheck
                          className="text-green-500 font-bold"
                          size={40}
                        />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogPortal>
                      <AlertDialogContent className="sm:max-w-[425px]">
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you want to Confirm PO?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            confirm your data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="hover:cursor-pointer">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction asChild>
                            <Button
                              type="button"
                              className="hover:cursor-pointer text-white"
                              onClick={() => setEditItem?.(row.original.PONo)}
                            >
                              Confirm
                            </Button>
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialogPortal>
                  </AlertDialog>
                )}

                {/* Cancel PO Button */}
                <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="w-[25px] h-[25px] hover:cursor-pointer"
                    >
                      <IconX />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogPortal>
                    <AlertDialogContent className="sm:max-w-[425px] z-50">
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you want to Cancel PO?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          cancel your data.
                          <Label className="mt-3">Reason</Label>
                          <Textarea
                            className="mt-2"
                            placeholder="Enter reason for cancel"
                            onChange={(e) => {
                              setRemark?.(e.target.value);
                            }}
                          />
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="hover:cursor-pointer">
                          Cancel
                        </AlertDialogCancel>
                        <Button
                          type="button"
                          className="hover:cursor-pointer text-white bg-red-500 hover:bg-red-500/90"
                          onClick={handleSubmit}
                        >
                          Confirm
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialogPortal>
                </AlertDialog>
              </>
            ) : (
              <span>Not Available</span>
            )}
          </div>

          {/* Dialog/Drawer อยู่ภายนอก Dropdown */}
        </>
      );
    },
  },
  {
    id: "attachedFiles",
    accessorKey: "attachedFiles",
    header: () => (
      <div className="flex items-center gap-2">
        <IconPaperclip size={16} />
        Attached Files
      </div>
    ),
    cell: ({ row }) => {
      const [isUploading, setIsUploading] = useState(false);
      const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>(
        row.original.attachedFiles || []
      );
      const [showFileList, setShowFileList] = useState(false);

      useEffect(() => {
        console.log(uploadedFiles);
      }, [uploadedFiles]);
      // Handle file upload
      const handleFileUpload = async (files: FileList) => {
        setIsUploading(true);
        try {
          const newFiles: FileItem[] = [];

          // for (let i = 0; i < files.length; i++) {
          //   const file = files[i];
          //   console.log(file);
          //   // Upload logic here

          //   // newFiles.push({
          //   //   id: uploadedFile.id,
          //   //   name: file.name,
          //   //   size: file.size,
          //   //   type: file.type,
          //   //   uploadDate: new Date(),
          //   //   url: uploadedFile.url,
          //   // });
          //   console.log(uploadedFile);
          // }
          const res = await uploadFile(files, 1, row.original.PONo);
          console.log(res);
          const message = res.message;
          setUploadedFiles((prev) => [...prev, ...newFiles]);
          toast.success(message);
        } catch (error: any) {
          toast.error(error.response.data.message || "File upload failed");
        } finally {
          setIsUploading(false);
        }
      };

      // Handle file delete
      const handleFileDelete = async (fileId: string) => {
        try {
          await deleteFile(fileId, row.original.PONo);
          setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
          toast.success("File deleted successfully");
        } catch (error) {
          toast.error("Failed to delete file");
        }
      };

      const handleDownloadFile = async (
        fileId: string,
        filenameData: string
      ) => {
        try {
          const res = await DownloadFile(fileId);
          console.log(res);
          // ดึงชื่อไฟล์จาก header
          const disposition = res.headers["content-disposition"] || "";
          const filenameMatch = disposition.match(/filename="?(.+)"?/);
          console.log(disposition, filenameMatch);
          const filename = filenameData;

          // ดึง content-type จาก header
          const contentType =
            res.headers["content-type"] || "application/octet-stream";

          // สร้าง Blob โดยใส่ MIME type ให้ถูกต้อง
          const blob = new Blob([res.data], { type: contentType });

          // สร้าง URL จาก Blob
          const url = window.URL.createObjectURL(blob);

          // สร้างลิงก์ดาวน์โหลด
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", filename);
          document.body.appendChild(link);
          link.click();
          link.remove();

          // ล้าง URL object
          window.URL.revokeObjectURL(url);

          toast.success("File downloaded successfully");
        } catch (error) {
          console.error(error);
          toast.error("Failed to download file");
        }
      };

      return (
        <div className="flex items-center gap-2">
          {/* File Count Badge */}
          {uploadedFiles.length > 0 && (
            <Badge
              variant="secondary"
              className="text-xs cursor-pointer"
              onClick={() => setShowFileList(!showFileList)}
            >
              <IconPaperclip size={12} className="mr-1" />
              {uploadedFiles.length}
            </Badge>
          )}

          {/* Upload Button */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={isUploading}
                // onClick={(e) => {
                //   fetchFiles(row.original.PONo); // Fetch files when button is clicked
                // }}
              >
                {isUploading ? (
                  <IconLoader2 size={16} className="animate-spin" />
                ) : (
                  <IconPlus size={16} />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="center" className="w-80 p-4">
              <div className="space-y-4">
                <h4 className="font-medium text-sm">
                  Upload Files for PO: {row.original.PONo}
                </h4>

                {/* File Drop Zone */}
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = e.dataTransfer.files;
                    if (files.length > 0) {
                      handleFileUpload(files);
                    }
                  }}
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.multiple = true;
                    input.accept = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png";
                    input.onchange = (e) => {
                      const files = (e.target as HTMLInputElement).files;
                      if (files) handleFileUpload(files);
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
                    PDF, DOC, XLS, Images (Max 10MB each)
                  </p>
                </div>

                {/* Current Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-medium text-gray-700">
                      Uploaded Files ({uploadedFiles.length})
                    </h5>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {uploadedFiles.map((file) => (
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
                                  "th-TH",
                                  {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  }
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() =>
                                handleDownloadFile(file.id, file.name)
                              }
                            >
                              <IconDownload size={12} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                              onClick={() => handleFileDelete(file.id)}
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
          </Popover>
        </div>
      );
    },
  },
];

export const getSubColumns = (
  originalFinalETA?: Date,
  setOriginalFInalETA?: (date: Date) => void
): ColumnDef<PO_Details>[] => [
  {
    accessorKey: "Delivery", // ยังคงไว้เพื่อกรณีอื่นใช้
    accessorFn: (row) => {
      const finalEta = originalFinalETA
        ? new Date(originalFinalETA).toLocaleDateString("th-TH", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "Not Found Delivery Date";

      return row.finalETADate
        ? new Date(row.finalETADate).toLocaleDateString("th-TH", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : finalEta;
    },

    header: ({ column, table }) => {
      return (
        <>
          <div className="pl-[15px]">
            Delivery
            <ColumnCheckboxFilter column={column} table={table} />
          </div>
        </>
      );
    },
    cell: ({ getValue }) => {
      const value = getValue() as string;

      return (
        <>
          <div>{value}</div>
        </>
      );
    },
  },
  {
    id: "MatrClass",
    accessorKey: "matrClass",
    header: ({ column, table }) => (
      <div className="flex items-center gap-2">
        {/* PONo */}
        {/* <ColumnCheckboxFilter column={column} table={table} /> */}
        <div className="pl-[15px]">
          MatrClass
          <ColumnCheckboxFilter column={column} table={table} />
        </div>
      </div>
    ),
    cell: ({ row }) => (
      <>
        <div>{row.original.matrClass}</div>
      </>
    ),
  },
  {
    id: "MatrCode",
    accessorKey: "matrCode",
    header: ({ column, table }) => {
      return (
        <>
          <div className="pl-[15px]">
            MatrCode
            <ColumnCheckboxFilter column={column} table={table} />
          </div>
        </>
      );
    },
    cell: ({ row }) => {
      return (
        <>
          <div>{row.original.matrCode}</div>
        </>
      );
    },
  },
  {
    id: "Color",
    accessorKey: "color",
    header: ({ column, table }) => {
      return (
        <>
          <div className="pl-[15px]">
            Color
            <ColumnCheckboxFilter column={column} table={table} />
          </div>
        </>
      );
    },
    cell: ({ row }) => {
      return (
        <>
          <div>{row.original.color ? `${row.original.color}` : ``}</div>
        </>
      );
    },
  },
  {
    id: "Size",
    accessorKey: "size",
    header: ({ column, table }) => {
      return (
        <>
          <div className="pl-[15px]">
            Size
            <ColumnCheckboxFilter column={column} table={table} />
          </div>
        </>
      );
    },
    cell: ({ row }) => {
      return (
        <>
          <div>{row.original.size ? `${row.original.size}` : ``}</div>
        </>
      );
    },
  },
  {
    // id: "description",
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <>
          <div className="pl-[15px]">Description</div>
        </>
      );
    },
    cell: ({ row }) => {
      return (
        <>
          <div>{row.original.description}</div>
        </>
      );
    },
  },
];
