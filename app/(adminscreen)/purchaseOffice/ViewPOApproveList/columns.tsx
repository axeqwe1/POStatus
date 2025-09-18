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
  IconPencil,
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
import { ArrowUpDown, Package, Target } from "lucide-react";
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
  UpdateDescription,
  uploadFile,
} from "@/lib/api/uploadFile";
import {
  formatDate,
  formatFileSize,
  getDeliveryStatus,
} from "@/utils/utilFunction";
import { GetPOByPONo, InsertTemp } from "@/lib/api/po";
import { useAuth } from "@/context/authContext";
import { FormET } from "@/components/DeliveryComponent/modal";
const downloadUrl = process.env.NEXT_PUBLIC_PO_URL;

export const getColumns = (
  onCancel?: (PONo: string, Remark: string) => void,
  isEdit?: boolean,
  setIsEdit?: (isEdit: boolean) => void,
  editItem?: string,
  setEditItem?: (item: string) => void,
  isDesktop?: boolean,
  openPopoverPONo?: string | null,
  setOpenPopoverPONo?: (PONo: string | null) => void,
  responseUpload?: (
    files: FileList,
    PONo: string,
    uploadType: number
  ) => Promise<void>,
  deleteFiles?: (fileId: string) => void,
  updateDesc?: (
    fileId: string,
    description: string,
    PONo: string
  ) => Promise<void>,
  onRefreshFromDelivery?: () => void
): ColumnDef<PO_Status>[] => [
  {
    id: "PONo",
    accessorKey: "PONo",
    header: ({ column, table }) => {
      return (
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
          <span className="flex flex-row items-center gap-1 text-xs text-gray-500">
            <IconPaperclip size={16} />
            PO Files
          </span>
          <span className="flex flex-row items-center gap-1 text-xs text-gray-500">
            <Package size={16} />
            Delivery
          </span>
        </div>
      );
    },
    cell: ({ row }) => {
      const [isUploading, setIsUploading] = useState(false);
      const [desc, setDesc] = useState<string>(""); // ใช้ Remark เป็นค่าเริ่มต้น
      const [showFileList, setShowFileList] = useState(false);
      const [descriptionOpen, setDescriptionOpen] = useState(false);
      const [selectFileId, setSelectFileId] = useState<string>("");
      const { user } = useAuth();
      const POData = row.original.attachedFiles!.filter(
        (item) => item.uploadType == 2
      );
      // useEffect(() => {
      //   setPOData(row.original.attachedFiles || []);
      //   console.log(row.original.attachedFiles);
      // }, [row.original.attachedFiles]);
      // Handle file upload
      // useEffect(() => {
      //   POData?.find((file: any) => {
      //     // console.log(file, selectFileId, file.id);
      //     if (selectFileId == file.id && file.remark) {
      //       setDesc(file.remark);
      //     } else {
      //       setDesc(""); // ถ้าไม่มี remark ให้ล้างค่า description
      //     }
      //     return file.remark;
      //   });
      // }, [selectFileId]);
      const handleSelectFile = (fileId: string) => {
        POData?.find((file: any) => {
          console.log(file, fileId);
          if (fileId == file.id && file.remark) {
            setDesc(file.remark);
          } else {
            setDesc(""); // ถ้าไม่มี remark ให้ล้างค่า description
          }
        });
      };
      const handleFileUpload = async (
        files: FileList,
        PONo: string,
        uploadType: number
      ) => {
        setIsUploading(true);
        await responseUpload?.(files, PONo, uploadType);
        setIsUploading(false);
      };
      // Handle file delete
      const handleFileDelete = async (fileId: string) => {
        setIsUploading(true);
        await deleteFiles?.(fileId);
        setIsUploading(false);
      };
      const handleUpdateDescription = async (
        fileId: string,
        description: string,
        PONo: string
      ) => {
        await updateDesc?.(fileId, description, PONo);
        setDesc(""); // ล้างค่า description หลังจากอัพเดต
      };

      const handleDownloadFile = async (
        fileId: string,
        filenameData: string
      ) => {
        try {
          const res = await DownloadFile(fileId);
          console.log(res);
          // ดึงชื่อไฟล์จาก header
          // const disposition = res.headers["content-disposition"] || "";
          // const filenameMatch = disposition.match(/filename="?(.+)"?/);
          // console.log(disposition, filenameMatch);
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
        } catch (error: any) {
          console.error(error);
          toast.error(error);
        }
      };
      return (
        <div className="flex flex-row items-center jsutify-center gap-2">
          {row.original.Supreceive ? (
            <a
              onClick={async () => {
                // const res = await InsertTemp(row.original.PONo, user!.username);
                // console.log(res);

                window.open(
                  `${downloadUrl}pono=${row.original.PONo}&Company=POMatr&typePO=${row.original.typePO}&Comname=${user?.username}`,
                  "_blank"
                );
              }}
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
              className="cursor-pointer text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
            >
              {row.original.PONo}
            </a>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="hover:cursor-default">
                  {row.original.PONo}
                </span>
              </TooltipTrigger>
              <TooltipContent className="bg-neutral-800 text-white ">
                <span className="text-white ">
                  Please Confirm PO before download.
                </span>
              </TooltipContent>
            </Tooltip>
          )}
          <div className="flex flex-row justify-start items-center gap-5">
            <Popover
              key={`${row.original.PONo}-type-1`} // ใช้ PONo เป็น key เพื่อแยก popover แต่ละรายการ
              modal={false}
              open={openPopoverPONo === row.original.PONo}
              onOpenChange={(open) => {
                if (open) setOpenPopoverPONo?.(row.original.PONo);
                else setOpenPopoverPONo?.(null);
              }}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-12 p-0 hover:cursor-pointer"
                >
                  <Badge
                    variant="outline"
                    className="text-xs cursor-pointer pointer-events-none"
                    onClick={() => {
                      if (openPopoverPONo !== row.original.PONo)
                        setOpenPopoverPONo?.(row.original.PONo);
                      else setOpenPopoverPONo?.(null);
                    }}
                  >
                    <IconPaperclip size={12} className="mr-1" />
                    {POData!.length}
                  </Badge>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                key={`${row.original.PONo}-type-1`}
                side="right"
                align="center"
                className="w-100 p-4"
              >
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">
                    Upload Files for PO: {row.original.PONo}
                  </h4>

                  {/* File Drop Zone */}
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center cursor-pointer hover:border-gray-400 transition-colors"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={async (e) => {
                      e.preventDefault();
                      const files = e.dataTransfer.files;
                      if (files.length > 0) {
                        await handleFileUpload(files, row.original.PONo, 2);
                        // await refreshPO(row.original.PONo); // Refresh PO after upload
                      }
                    }}
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.multiple = true;
                      input.accept =
                        ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt";
                      input.onchange = async (e) => {
                        const files = (e.target as HTMLInputElement).files;
                        if (files) {
                          await handleFileUpload(files, row.original.PONo, 2);
                          // await refreshPO(row.original.PONo); // Refresh PO after upload
                        }
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

                  {/* Current Files List */}
                  {POData!.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-xs font-medium text-gray-700">
                        Uploaded Files ({POData!.length})
                      </h5>
                      <div className="max-h-64 overflow-y-auto space-y-1">
                        {POData!.map((file: any) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between p-2 border shadow-sm rounded text-xs"
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <FileIcon fileType={file.type} />
                              <div className="flex-1 min-w-0">
                                <div className="truncate font-medium">
                                  {file.name}
                                </div>
                                {/* Desctiption */}
                                {descriptionOpen && selectFileId == file.id ? (
                                  <div className="flex flex-row relative">
                                    <form
                                      onSubmit={(e) => {
                                        e.preventDefault(); // ป้องกัน reload หน้า
                                        handleUpdateDescription(
                                          file.id,
                                          desc,
                                          row.original.PONo
                                        );
                                      }}
                                    >
                                      <Input
                                        className="mt-1"
                                        placeholder="Enter file description"
                                        value={desc}
                                        onChange={(e) =>
                                          setDesc(e.target.value)
                                        }
                                        // onKeyDown={(e) => {
                                        //   if (e.key === "Escape") {
                                        //     e.preventDefault();
                                        //     setDescriptionOpen(false); // ปิดถ้ากด ESC
                                        //   }
                                        // }}
                                      />
                                    </form>

                                    <span className="absolute right-1 top-3 text-gray-500 p-0.5 cursor-pointer rounded-full hover:bg-neutral-300">
                                      <IconX
                                        className="text-red-500"
                                        size={16}
                                        onClick={() =>
                                          setDescriptionOpen(!descriptionOpen)
                                        }
                                      />
                                    </span>
                                    <span className="absolute right-7 top-3 text-gray-500 p-0.5 cursor-pointer rounded-full hover:bg-neutral-300">
                                      <IconCheck
                                        className="text-green-500"
                                        size={16}
                                        onClick={() => {
                                          handleUpdateDescription(
                                            file.id,
                                            desc,
                                            row.original.PONo
                                          );
                                          setDescriptionOpen(false);
                                        }}
                                      />
                                    </span>
                                  </div>
                                ) : (
                                  <div
                                    className="text-gray-600 dark:text-gray-300 truncate italic flex flex-row"
                                    onClick={() => {
                                      setDescriptionOpen(!descriptionOpen);
                                      setSelectFileId(file.id);
                                      handleSelectFile(file.id);
                                    }}
                                  >
                                    {file.remark
                                      ? file.remark
                                      : "Description here"}
                                    {"  "}
                                    <IconPencil
                                      className="ml-1 hover:cursor-pointer"
                                      size={14}
                                    />
                                  </div>
                                )}

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
                                onClick={async () => {
                                  await handleFileDelete(file.id);
                                  // await refreshPO(row.original.PONo);
                                }}
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

            {/* Popup form */}
            <FormET
              onRefresh={onRefreshFromDelivery as () => void}
              supplierMode={false}
              POno={row.original.PONo}
            />
          </div>
        </div>
      );
    },
  },
  {
    id: "deliveryStatus", // ตั้งชื่อ column เอง
    header: ({ column, table }) => (
      <div className="flex items-center ">
        Delivery Status
        <ColumnCheckboxFilter column={column} table={table} />
      </div>
    ),
    accessorFn: (row) => getDeliveryStatus(row.delivery ? row.delivery : null), // คืนค่าเป็น string: Not Progress, Progress, Pending, Receive, Error
    cell: ({ getValue }) => {
      const status = getValue() as string;
      return (
        <div className="w-full flex justify-center items-center">
          <Badge
            variant={"outline"}
            className={`min-w-[80px] text-center ${
              status == "Not Progress"
                ? "bg-accent text-black dark:text-white"
                : status == "Error"
                ? "bg-red-400 dark:bg-red-900 text-red-700 dark:text-amber-300"
                : status == "Waiting to Receive"
                ? "g-yellow-300bg-yellow-400 dark:bg-yellow-900 text-blue-700 dark:text-white"
                : status == "Progress"
                ? "bg-blue-400 dark:bg-blue-900 text-blue-700 dark:text-white"
                : "bg-green-400 dark:bg-green-900 text-green-700 dark:text-white"
            }`}
          >
            {status}
          </Badge>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue: string[]) => {
      if (!filterValue || filterValue.length === 0) return true;
      return filterValue.includes(row.getValue(columnId));
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
          <span className="dark:text-white font-semibold">
            {isCancel === 1
              ? "RequestCancel"
              : isCancel === 2
              ? "Cancel"
              : isConfirmed
              ? "Confirm"
              : row.original.ClosePO
              ? "Pending"
              : "Process.. "}
          </span>
        </Badge>
      );
    },

    // (optional) enableFacetedValues: true,
  },

  {
    // new Date(row.sendDate).toLocaleDateString("th-TH", {
    //         day: "2-digit",
    //         month: "2-digit",
    //         year: "numeric",
    //       })
    accessorKey: "sendDate", // <-- ต้องมี เพื่อ match custom column system
    header: ({ column }) => (
      <Button
        className="hover:cursor-pointer !p-0"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        POIssueDate
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
      // ถ้า ClosePO = false หรือไม่มี sendDate → ไม่ผ่าน filter
      if (!row.original.ClosePO || !row.original.sendDate) return false;
      const rowDate = new Date(row.getValue(columnId));
      if (isNaN(rowDate.getTime())) return false;
      console.log(rowDate);
      const from = filterValue.from;
      const to = filterValue.to ?? from; // กรณีเลือกวันเดียว

      return rowDate >= from && rowDate <= to;
    },
    meta: {
      label: "Lastest Approve Date", // ชื่อที่จะแสดงใน UI
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
      return (
        <>
          <div className="flex justify-center items-center">Confirm</div>
        </>
      );
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
          <div className="flex justify-center items-center">
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
                {row.original.Supreceive && (
                  <Badge className="bg-green-400 dark:bg-green-900 dark:text-white text-white">
                    Confirmed
                  </Badge>
                )}
              </>
            ) : (
              <Badge variant={"destructive"}>Not Available</Badge>
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
        Supplier Files
      </div>
    ),
    cell: ({ row }) => {
      const [isUploading, setIsUploading] = useState(false);
      const [desc, setDesc] = useState<string>(""); // ใช้ Remark เป็นค่าเริ่มต้น
      const [showFileList, setShowFileList] = useState(false);
      const [descriptionOpen, setDescriptionOpen] = useState(false);
      const [selectFileId, setSelectFileId] = useState<string>("");
      const POData = row.original.attachedFiles!.filter(
        (item) => item.uploadType == 1
      );
      // Handle file upload
      const handleSelectFile = (fileId: string) => {
        POData?.find((file: any) => {
          console.log(file, fileId);
          if (fileId == file.id && file.remark) {
            setDesc(file.remark);
          } else {
            setDesc(""); // ถ้าไม่มี remark ให้ล้างค่า description
          }
        });
      };
      const handleFileUpload = async (
        files: FileList,
        PONo: string,
        uploadType: number
      ) => {
        setIsUploading(true);
        await responseUpload?.(files, PONo, uploadType);
        setIsUploading(false);
      };
      // Handle file delete
      const handleFileDelete = async (fileId: string) => {
        setIsUploading(true);
        await deleteFiles?.(fileId);
        setIsUploading(false);
      };
      const handleUpdateDescription = async (
        fileId: string,
        description: string,
        PONo: string
      ) => {
        await updateDesc?.(fileId, description, PONo);
        setDesc(""); // ล้างค่า description หลังจากอัพเดต
      };

      const handleDownloadFile = async (
        fileId: string,
        filenameData: string
      ) => {
        try {
          const res = await DownloadFile(fileId);
          console.log(res);
          // ดึงชื่อไฟล์จาก header
          // const disposition = res.headers["content-disposition"] || "";
          // const filenameMatch = disposition.match(/filename="?(.+)"?/);
          // console.log(disposition, filenameMatch);
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
        } catch (error: any) {
          console.error(error);
          toast.error(error);
        }
      };

      return (
        <div className="flex justify-center items-center gap-2">
          {/* File Count Badge */}

          {/* Upload Button */}
          <Popover
            key={`${row.original.PONo}-type-2`} // ใช้ PONo เป็น key เพื่อแยก popover แต่ละรายการ
            modal={false}
            open={openPopoverPONo === `${row.original.PONo}-type-2`}
            onOpenChange={(open) => {
              if (open) {
                setOpenPopoverPONo?.(`${row.original.PONo}-type-2`);
              } else {
                setOpenPopoverPONo?.(null);
              }
            }}
          >
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-12 p-0 hover:cursor-pointer"
              >
                <Badge
                  variant="secondary"
                  className="text-xs cursor-pointer pointer-events-none"
                  onClick={() => {
                    if (openPopoverPONo !== row.original.PONo)
                      setOpenPopoverPONo?.(row.original.PONo);
                    else setOpenPopoverPONo?.(null);
                  }}
                >
                  <IconPaperclip size={12} className="mr-1" />
                  {POData!.length}
                </Badge>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              key={`${row.original.PONo}-type-2`}
              side="left"
              align="center"
              className="w-100 p-4"
            >
              <div className="space-y-4">
                <h4 className="font-medium text-sm">
                  Upload Files for Supplier: {row.original.PONo}
                </h4>

                {/* File Drop Zone */}
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center cursor-pointer hover:border-gray-400 transition-colors"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={async (e) => {
                    e.preventDefault();
                    const files = e.dataTransfer.files;
                    if (files.length > 0) {
                      await handleFileUpload(files, row.original.PONo, 1);
                      // await refreshPO(row.original.PONo); // Refresh PO after upload
                    }
                  }}
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.multiple = true;
                    input.accept =
                      ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt";
                    input.onchange = async (e) => {
                      const files = (e.target as HTMLInputElement).files;
                      if (files) {
                        await handleFileUpload(files, row.original.PONo, 1);
                        // await refreshPO(row.original.PONo); // Refresh PO after upload
                      }
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

                {/* Current Files List */}
                {POData!.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-medium text-gray-700">
                      Uploaded Files ({POData!.length})
                    </h5>
                    <div className="max-h-64 overflow-y-auto space-y-1">
                      {POData!.map((file: any) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-2 border shadow-sm rounded text-xs"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <FileIcon fileType={file.type} />
                            <div className="flex-1 min-w-0">
                              <div className="truncate font-medium">
                                {file.name}
                              </div>
                              {/* Desctiption */}
                              {descriptionOpen && selectFileId == file.id ? (
                                <div className="flex flex-row relative">
                                  <form
                                    onSubmit={(e) => {
                                      e.preventDefault(); // ป้องกัน reload หน้า
                                      handleUpdateDescription(
                                        file.id,
                                        desc,
                                        row.original.PONo
                                      );
                                    }}
                                  >
                                    <Input
                                      className="mt-1"
                                      placeholder="Enter file description"
                                      value={desc}
                                      onChange={(e) => setDesc(e.target.value)}
                                      // onKeyDown={(e) => {
                                      //   if (e.key === "Escape") {
                                      //     e.preventDefault();
                                      //     setDescriptionOpen(false); // ปิดถ้ากด ESC
                                      //   }
                                      // }}
                                    />
                                  </form>

                                  <span className="absolute right-1 top-3 text-gray-500 p-0.5 cursor-pointer rounded-full hover:bg-neutral-300">
                                    <IconX
                                      className="text-red-500"
                                      size={16}
                                      onClick={() =>
                                        setDescriptionOpen(!descriptionOpen)
                                      }
                                    />
                                  </span>
                                  <span className="absolute right-7 top-3 text-gray-500 p-0.5 cursor-pointer rounded-full hover:bg-neutral-300">
                                    <IconCheck
                                      className="text-green-500"
                                      size={16}
                                      onClick={() => {
                                        handleUpdateDescription(
                                          file.id,
                                          desc,
                                          row.original.PONo
                                        );
                                        setDescriptionOpen(false);
                                      }}
                                    />
                                  </span>
                                </div>
                              ) : (
                                <div
                                  className="text-gray-600 dark:text-gray-300 truncate italic flex flex-row"
                                  onClick={() => {
                                    setDescriptionOpen(!descriptionOpen);
                                    setSelectFileId(file.id);
                                    handleSelectFile(file.id);
                                  }}
                                >
                                  {file.remark
                                    ? file.remark
                                    : "Description here"}
                                  {"  "}
                                  <IconPencil
                                    className="ml-1 hover:cursor-pointer"
                                    size={14}
                                  />
                                </div>
                              )}

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
                              onClick={async () => {
                                await handleFileDelete(file.id);
                                // await refreshPO(row.original.PONo);
                              }}
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
  {
    id: "amountNoVat",
    accessorKey: "amountNoVat",
    header: () => <div className="">AmountNoVat</div>,
    cell: ({ row }) => {
      return (
        <div>
          <span>{row.original.amountNoVat}</span>
        </div>
      );
    },
  },
  {
    id: "amountTotal",
    accessorKey: "amountTotal",
    header: () => <div className="">AmountWithVat</div>,
    cell: ({ row }) => {
      return (
        <div>
          <span>{row.original.amountTotal}</span>
        </div>
      );
    },
  },
  {
    id: "totalVat",
    accessorKey: "totalVat",
    header: () => <div className="">TotalVat</div>,
    cell: ({ row }) => {
      return (
        <div>
          <span>{row.original.totalVat}</span>
        </div>
      );
    },
  },
  {
    id: "totalChange",
    accessorKey: "totalChange",
    header: () => <div className="">TotalChange</div>,
    cell: ({ row }) => {
      return (
        <div>
          <span>{row.original.totalChange}</span>
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
    id: "price",
    accessorKey: "price",
    header: () => <div className="">Price/Unit</div>,
    cell: ({ row }) => {
      return (
        <div>
          <span>{row.original.price}</span>
        </div>
      );
    },
  },
  {
    id: "qty",
    accessorKey: "chargeAmt",
    header: () => <div className="">Qty/Unit</div>,
    cell: ({ row }) => {
      return (
        <div>
          <span>
            {row.original.qty} {row.original.unit}
          </span>
        </div>
      );
    },
  },
  {
    id: "totalAmount",
    accessorKey: "totalAmount",
    header: () => <div className="">TotalAmount</div>,
    cell: ({ row }) => {
      return (
        <div>
          <span>{row.original.totalAmount}</span>
        </div>
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
