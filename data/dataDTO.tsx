import { PO_Status, PoData } from "@/types/datatype";

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  username: string;
  supplierId?: string; // optional, ถ้าเป็นผู้ใช้ที่เป็น supplier
  supplierName?: string;
  role: string; // เช่น 'admin', 'user', 'supplier'
}

export interface poResponse {
  poInfo: PoData[];
  receiveInfo: PO_Status[];
}

export interface UpdateDeliveryRequest {
  POno: string;
  ETC: Date | null;
  ETD: Date | null;
  ETA: Date | null;
  ETAFinal: Date | null;
  CreateBy: string | null;
  Remark: string | null;
}

export interface ReceiveDeliveryRequest {
  PO_DeliveryID: number;
  POno: string;
  CreateBy: string;
}
