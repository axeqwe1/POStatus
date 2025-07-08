"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./authContext";
import { GetNotify } from "@/lib/api/notify";
import createSignalRConnection from "@/lib/signalR/signalR-client";
import { toast } from "sonner";

interface NotifyContextProps {
  clear: () => void;
  countNotify: number;
}

const NotifyContext = createContext<NotifyContextProps | undefined>(undefined);

interface NotifyProviderProps {
  children: React.ReactNode;
}
export const NotifyProvider: React.FC<NotifyProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<string[]>([]);
  const [countNotify, setCountNotify] = useState(0);
  const { user } = useAuth();
  const clear = () => {
    setNotifications([]);
    setCountNotify(0);
  };

  useEffect(() => {
    const fetchAllNotifications = async (userId: string) => {
      try {
        const res = await GetNotify(userId);
        if (res.status === 200) {
          const data = res.data;
          setNotifications(data);
          setCountNotify(data.length);
        } else {
          console.error("Failed to fetch notifications:", res.statusText);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
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
      });
    });

    return () => {
      if (connection) connection.stop();
    };
  }, []);
  return (
    <NotifyContext.Provider value={{ clear, countNotify }}>
      {children}
    </NotifyContext.Provider>
  );
};

const useNotify = () => {
  const context = useContext(NotifyContext);
  if (!context) {
    throw new Error("useNotify must be used within a NotifyProvider");
  }
};
