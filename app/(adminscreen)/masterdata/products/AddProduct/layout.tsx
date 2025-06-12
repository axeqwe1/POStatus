import React from "react";

interface Props {
  children: React.ReactNode;
}
export default function layout({ children }: Props) {
  return <div className=" max-w-[1200px] mx-auto px-4 w-full">{children}</div>;
}
