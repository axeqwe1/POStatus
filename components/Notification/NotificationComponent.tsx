"use client";
import React, { useEffect, useState } from "react";
import createSignalRConnection from "@/lib/signalR/signalR-client";

export default function NotificationComponent() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    let connection: any;

    createSignalRConnection().then((conn) => {
      connection = conn;

      conn.on("ReceiveMessage", (user: string, message: string) => {
        console.log(`📨 ${user}: ${message}`);
        setMessage(`${user}: ${message}`);
      });
    });

    return () => {
      if (connection) connection.stop();
    };
  }, []);

  return <div className="p-4">📢 Latest: {message}</div>;
}
