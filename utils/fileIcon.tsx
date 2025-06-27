import {
  IconFileDescriptionFilled,
  IconFileTypePdf,
  IconFileTypePng,
  IconFileTypeTxt,
  IconFileTypeXls,
  IconTxt,
} from "@tabler/icons-react";

// File Icon Component
export const FileIcon = ({ fileType }: { fileType: string }) => {
  if (fileType.includes("pdf"))
    return <IconFileTypePdf size={16} className="text-red-500" />;
  if (fileType.includes("doc"))
    return <IconFileTypeTxt size={16} className="text-blue-500" />;
  if (fileType.includes("xls") || fileType.includes("sheet"))
    return <IconFileTypeXls size={16} className="text-green-500" />;
  if (fileType.includes("image"))
    return <IconFileTypePng size={16} className="text-purple-500" />;
  return <IconFileDescriptionFilled size={16} className="text-gray-500" />;
};
