import { SidebarData, SidebarItem } from "@/types/sidebar";
import {
  IconBasketCog,
  IconBox,
  IconBrandProducthunt,
  IconBuilding,
  IconCategory,
  IconDeviceTabletCancel,
  IconReceipt,
  IconShirt,
  IconShirtFilled,
  IconTower,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";
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
    url: "/masterdata/products",
    icon: IconBrandProducthunt,
    items: [
      { title: "All Products", url: "/masterdata/products/All" },
      { title: "Add Product", url: "/masterdata/products/AddProduct" },
    ],
  },
  {
    title: "Variant Management",
    url: "/masterdata/variants",
    icon: IconShirt,
    items: [
      { title: "Size", url: "/masterdata/variants/size" },
      { title: "Color", url: "/masterdata/variants/color" },
      { title: "Unit", url: "/masterdata/variants/unit" },
    ],
  },
  {
    title: "Category Management",
    url: "/masterdata/category",
    icon: IconCategory,
    // items: [
    //   { title: "Size", url: "variants/size" },
    //   { title: "Color", url: "variants/color" },
    //   { title: "Unit", url: "variants/unit" },
    // ],
  },
];

// export const stockDataSideBar: SidebarItem[] = [
//   {
//     title: "Stock Management",
//     url: "/stock",
//     icon: IconBox,
//     items: [
//       { title: "Stock", url: "/stock/stock" },
//       { title: "Stock Take", url: "/stock/stockTake" },
//     ],
//   },
// ];
// export const organizeDataSideBar: SidebarItem[] = [
//   {
//     title: "Organization Management",
//     url: "/orgranization",
//     icon: IconBuilding,
//     items: [
//       { title: "Department", url: "/orgranization/department" },
//       { title: "Company", url: "/orgranization/company" },
//     ],
//   },
// ];
// export const userDataSideBar: SidebarItem[] = [
//   {
//     title: "User Management",
//     url: "/users",
//     icon: IconUser,
//     items: [
//       { title: "User", url: "/users/user" },
//       { title: "Role", url: "/users/role" },
//       { title: "Supplier", url: "/users/supplier" },
//     ],
//   },
// ];

export const purchasingOfficerSideBar: SidebarItem[] = [
  {
    title: "View PO Approve List",
    url: "/purchaseOffice/ViewPOApproveList",
    icon: IconReceipt,
  },
  {
    title: "Request Cancel List",
    url: "/purchaseOffice/RequestCancelList",
    icon: IconDeviceTabletCancel,
  },
];

export const UserManagement: SidebarItem[] = [
  {
    title: "User Management",
    url: "/users",
    icon: IconUsers,
  },
];
