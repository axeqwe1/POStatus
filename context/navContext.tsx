"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";
interface navContextProps {
  pathname: string;
  setPathName: (path: string) => void;
  breadcrump: string[];
}

const NavContext = createContext<navContextProps | undefined>(undefined);

interface navProviderProps {
  children: ReactNode;
}

const NavProvider = ({ children }: navProviderProps) => {
  const [pathname, setPathName] = useState<string>("");
  const [breadcrump, setBreadcrump] = useState<string[]>([]);
  const currentPathname = usePathname();
  // useMemo เพื่อเป็นการ memorize value ที่มีการคำนวนหนัก ป้องกันคำนวณซ้ำตอน re-render ใหม่  คำนวนใหม่เฉพาะที่ค่า dependency ที่กำหนดมีการเปลี่ยนแปลง
  // ใช้ useMemo เพื่อจดจำค่าที่ได้จากการคำนวณหนัก ไม่ให้คำนวณใหม่ทุกครั้งที่ component re-render
  // จะคำนวณใหม่ก็ต่อเมื่อค่าใน dependency array เปลี่ยนแปลงเท่านั้น
  const filterBreadcrump = useMemo(() => {
    const removeUnderscore = pathname.replaceAll("_", " "); // แทนที่ _ ด้วย space
    const Pathsplit = removeUnderscore.split("/").filter(Boolean); // ["product","example"]
    return Pathsplit;
  }, [pathname]);

  useEffect(() => {
    setBreadcrump(filterBreadcrump);
  }, [filterBreadcrump]);

  useEffect(() => {
    setPathName(currentPathname);
    console.log(currentPathname);
  }, []);
  //   useEffect(() => {
  //     const Pathsplit = pathname.split("/").filter(Boolean);
  //     setBreadcrump(Pathsplit);
  //   }, [pathname]);

  return (
    <NavContext.Provider value={{ pathname, setPathName, breadcrump }}>
      {children}
    </NavContext.Provider>
  );
};

export const useNav = () => {
  const context = useContext(NavContext);
  if (!context) {
    throw new Error("useNav must be used within a NavProvider");
  }
  return context;
};

export default NavProvider;
