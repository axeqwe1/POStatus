import {
  IconFileDescriptionFilled,
  IconFileTypeDocx,
  IconFileTypePdf,
  IconFileTypePng,
  IconFileTypeTxt,
  IconFileTypeXls,
  IconTxt,
} from "@tabler/icons-react";

// File Icon Component
export const FileIcon = ({ fileType }: { fileType: string }) => {
  console.log("FileIcon fileType:", fileType);
  if (fileType.includes("pdf"))
    return <IconFileTypePdf size={16} className="text-red-500" />;
  if (fileType.includes("text"))
    return <IconFileTypeTxt size={16} className="text-neutral-500" />;
  if (
    fileType.includes("xls") ||
    fileType.includes("sheet") ||
    fileType.includes("excel") ||
    fileType.includes("xlsx") ||
    fileType.includes("spreadsheet") ||
    fileType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || // xlsx
    fileType === "application/vnd.ms-excel" // xls
  )
    return <IconFileTypeXls size={16} className="text-green-500" />;
  if (fileType.includes("image"))
    return <IconFileTypePng size={16} className="text-purple-500" />;
  if (fileType.includes("word"))
    return <IconFileTypeDocx size={16} className="text-blue-500" />;
  return <IconFileDescriptionFilled size={16} className="text-gray-500" />;
};
