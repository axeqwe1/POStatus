import { Product, User } from "@/types/datatype";

export const users: User[] = [
  { id: "1", name: "John Doe", email: "john1@email.com" },
  { id: "2", name: "Jane Smith", email: "jane2@email.com" },
  { id: "3", name: "Alice Johnson", email: "alice3@email.com" },
  { id: "4", name: "Bob Brown", email: "bob4@email.com" },
  { id: "5", name: "Charlie Lee", email: "charlie5@email.com" },
  { id: "6", name: "Diana Prince", email: "diana6@email.com" },
  { id: "7", name: "Ethan Clark", email: "ethan7@email.com" },
  { id: "8", name: "Fiona Green", email: "fiona8@email.com" },
  { id: "9", name: "George Harris", email: "george9@email.com" },
  { id: "10", name: "Helen King", email: "helen10@email.com" },
  { id: "11", name: "Ivan Lee", email: "ivan11@email.com" },
  { id: "12", name: "Julia Miller", email: "julia12@email.com" },
  { id: "13", name: "Kevin Nelson", email: "kevin13@email.com" },
  { id: "14", name: "Linda Owens", email: "linda14@email.com" },
  { id: "15", name: "Mike Parker", email: "mike15@email.com" },
  { id: "16", name: "Nina Quinn", email: "nina16@email.com" },
  { id: "17", name: "Oscar Reed", email: "oscar17@email.com" },
  { id: "18", name: "Paula Scott", email: "paula18@email.com" },
  { id: "19", name: "Quentin Turner", email: "quentin19@email.com" },
  { id: "20", name: "Rachel Underwood", email: "rachel20@email.com" },
  { id: "21", name: "Steve Vaughn", email: "steve21@email.com" },
  { id: "22", name: "Tina White", email: "tina22@email.com" },
  { id: "23", name: "Uma Xu", email: "uma23@email.com" },
  { id: "24", name: "Victor Young", email: "victor24@email.com" },
  { id: "25", name: "Wendy Zhang", email: "wendy25@email.com" },
];

export const tShirt: Product = {
  id: "prod-001",
  name: "เสื้อ Polo เนื้อผ้านุ่ม",
  description: "เสื้อโปโลคุณภาพสูง เนื้อผ้าคอตตอน 100%",
  price: 599,
  category: "เสื้อผ้า",
  variants: [
    {
      id: "var-001",
      size: "S",
      color: "ขาว",
      unit: 10,
      sku: "POLO-WHITE-S",
    },
    {
      id: "var-002",
      size: "M",
      color: "ดำ",
      unit: 15,
      sku: "POLO-BLACK-M",
    },
    {
      id: "var-003",
      size: "M",
      color: "แดง",
      unit: 15,
      sku: "POLO-BLACK-M",
    },
  ],
};

export const ListProduct: Product[] = [
  tShirt,
  {
    id: "prod-002",
    name: "กางเกงยีนส์ Slim Fit",
    description: "กางเกงยีนส์ทรงสลิมฟิต เนื้อผ้ายืดหยุ่น",
    price: 899,
    category: "กางเกง",
    variants: [
      {
        id: "var-003",
        size: "30",
        color: "น้ำเงิน",
        unit: 20,
        sku: "JEANS-BLUE-30",
      },
      {
        id: "var-004",
        size: "32",
        color: "ดำ",
        unit: 25,
        sku: "JEANS-BLACK-32",
      },
    ],
  },
  {
    id: "prod-003",
    name: "รองเท้าผ้าใบ Nike Air Max",
    description: "รองเท้าผ้าใบ Nike Air Max รุ่นใหม่ล่าสุด",
    price: 4999,
    category: "รองเท้า",
    variants: [
      {
        id: "var-005",
        size: "40",
        color: "ขาว/ดำ",
        unit: 30,
        sku: "NIKE-AIRMAX-WHITE-BLACK-40",
      },
      {
        id: "var-006",
        size: "42",
        color: "แดง/ดำ",
        unit: 18,
        sku: "NIKE-AIRMAX-RED-BLACK-42",
      },
    ],
  },
];
