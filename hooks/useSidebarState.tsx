import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export function useSidebarState() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const sidebarState = Cookies.get("sidebar_state");
    setIsCollapsed(sidebarState === "collapsed");
  }, []);

  return isCollapsed;
}
