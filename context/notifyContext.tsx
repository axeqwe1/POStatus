"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./authContext";
import { GetNotifyCount } from "@/lib/api/notify";
import createSignalRConnection from "@/lib/signalR/signalR-client";
import { toast } from "sonner";
import { createPortal } from "react-dom";
import { CustomPortalToast } from "@/components/Portal/CustomPortalToast";
import NotificationToastPortal from "@/components/Portal/NotificationToastPortal";
import { AnimatePresence, motion } from "motion/react";
interface NotifyContextProps {
  clear: () => void;
  countNotify: number;
  activeNotify: () => void;
}

const NotifyContext = createContext<NotifyContextProps | undefined>(undefined);

interface NotifyProviderProps {
  children: React.ReactNode;
}
export const NotifyProvider: React.FC<NotifyProviderProps> = ({ children }) => {
  const [countNotify, setCountNotify] = useState(0);
  const [toast, setToast] = useState<null | { user: string; message: string }>(
    null
  );
  const { user } = useAuth();

  const fetchAllNotifications = async (userId: string) => {
    try {
      const res = await GetNotifyCount(userId);
      if (res.status === 200) {
        const data = res.data;
        console.log("Fetched notifications:", data);

        setCountNotify(data.count);
      } else {
        console.error("Failed to fetch notifications:", res.statusText);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const clear = () => {
    setCountNotify(0);
  };

  const onClose = () => {
    setToast(null);
  };
  useEffect(() => {
    if (user && user.id) {
      fetchAllNotifications(user.id);
    }
  }, [user]);

  useEffect(() => {
    let connection: any;

    createSignalRConnection().then((conn) => {
      connection = conn;

      conn.on("ReceiveMessage", (user: string, message: string) => {
        setCountNotify((prevCount) => prevCount + 1);
        console.log(`📨 ${user}: ${message}`);
        setToast({ user, message });

        // <CustomPortalToast>

        // </CustomPortalToast>;
      });
    });

    return () => {
      if (connection) connection.stop();
    };
  }, [user]);
  const activeNotify = () => {
    if (user && user.id) {
      fetchAllNotifications(user.id);
    }
  };

  return (
    <NotifyContext.Provider value={{ clear, countNotify, activeNotify }}>
      {children}
      <AnimatePresence>
        {toast && (
          <NotificationToastPortal
            key={toast.user + toast.message}
            user={toast?.user!}
            message={toast?.message!}
            onClose={onClose}
          />
        )}
      </AnimatePresence>
    </NotifyContext.Provider>
  );
};

export const useNotify = () => {
  const context = useContext(NotifyContext);
  if (!context) {
    throw new Error("useNotify must be used within a NotifyProvider");
  }
  return context;
};
