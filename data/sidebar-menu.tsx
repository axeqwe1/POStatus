import { SidebarData, SidebarItem } from "@/types/sidebar";
import { BookAIcon, Bot, Settings2, SquareActivityIcon } from "lucide-react";

// export const sidebarData: SidebarData = [
//   {
//     label: "Master Data",
//     items: [
//       {
//         title: "Product Management",
//         url: "/product",
//         icon: SquareActivityIcon,
//         items: [
//           { title: "All Products", url: "/product/all" },
//           { title: "Add Product", url: "/product/add" },
//         ],
//       },
//       {
//         title: "Category Management",
//         url: "/category",
//         icon: BookAIcon,
//       },
//     ],
//   },
//   {
//     label: "AI & Bot",
//     items: [
//       {
//         title: "Chatbot",
//         url: "/bot",
//         icon: Bot,
//       },
//     ],
//   },
//   {
//     label: "Settings",
//     items: [
//       {
//         title: "System Settings",
//         url: "/settings",
//         icon: Settings2,
//       },
//     ],
//   },
// ];

export const masterDataSidebar: SidebarItem[] = [
  {
    title: "Product Management",
    url: "/products",
    icon: SquareActivityIcon,
    items: [
      { title: "All Products", url: "/products/All" },
      { title: "Add Product", url: "/products/AddProduct" },
    ],
  },
  {
    title: "System Settings",
    url: "/settings",
    icon: Settings2,
  },
];
