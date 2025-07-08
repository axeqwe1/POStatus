"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
interface NotificationToastProp {
  user: string | null;
  message: string | null;
  onClose: () => void;
}

export default function NotificationToastPortal({
  user,
  message,
  onClose,
}: NotificationToastProp) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => onClose?.(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -40, opacity: 0 }}
      transition={{ duration: 0.25 }}
      className={`${
        user === "Info" ? "bg-blue-500" : "bg-red-500"
      } fixed top-10 right-5 text-white p-3 z-[9999] shadow-2xl`}
    >
      🔥 {user} : {message}!
    </motion.div>,
    document.getElementById("portal-root")!
  );
}
