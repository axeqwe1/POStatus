import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabItem {
  label: string;
  value: string;
  content: React.JSX.Element | (() => React.JSX.Element);
}

interface TabListProps {
  tabList: TabItem[];
  currentTab?: string; // optional, for controlled component
}

export default function CustomTabs({ tabList, currentTab }: TabListProps) {
  // ถ้า currentTab ไม่ถูกส่งมา ให้ default เป็น tab แรก
  const defaultValue =
    currentTab || (tabList.length > 0 ? tabList[0].value : "");

  return (
    <Tabs defaultValue={defaultValue} className="">
      <TabsList>
        {tabList.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabList.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {typeof tab.content === "function" ? tab.content() : tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}

// <CustomTabs
//   tabList={[
//     {
//       label: "Account",
//       value: "account",
//       content: <div>Make changes to your account here.</div>,
//     },
//     {
//       label: "Password",
//       value: "password",
//       content: <div>Change your password here.</div>,
//     },
//     {
//       label: "Profile",
//       value: "profile",
//       content: <div>Profile setting here.</div>,
//     },
//   ]}
// />;
