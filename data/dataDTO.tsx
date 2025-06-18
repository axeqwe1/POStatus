interface UserDTO {
  id: string;
  name: string;
  email: string;
  username: string;
  supplierId?: string; // optional, ถ้าเป็นผู้ใช้ที่เป็น supplier
  role: string; // เช่น 'admin', 'user', 'supplier'
}
