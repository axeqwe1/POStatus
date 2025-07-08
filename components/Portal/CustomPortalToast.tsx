"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface Props {
  children: React.ReactNode;
  selector?: string; // DOM target (default: #portal-root)
}

export function CustomPortalToast({
  children,
  selector = "#portal-root",
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setContainer(document.querySelector(selector) as HTMLElement | null);
    setMounted(true);
  }, [selector]);

  if (!mounted || !container) return null;

  return createPortal(children, container);
}
