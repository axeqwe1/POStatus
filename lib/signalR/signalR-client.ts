// lib/signalr-client.ts
import {
  HubConnectionBuilder,
  HubConnection,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";

const createSignalRConnection = async (): Promise<HubConnection> => {
  const SIGNALR_URL = process.env.NEXT_PUBLIC_SIGNALR_URL;
  if (!SIGNALR_URL) {
    throw new Error("NEXT_PUBLIC_SIGNALR_URL is not defined in .env");
  }
  const connection = new HubConnectionBuilder()
    .withUrl(SIGNALR_URL, {
      withCredentials: true,
    })
    .withAutomaticReconnect({
      nextRetryDelayInMilliseconds: (retryContext) => {
        console.warn(
          `🔁 Retry attempt #${retryContext.previousRetryCount + 1}`
        );
        return 2000; // 2 seconds between retries
      },
    })
    .configureLogging(LogLevel.Information)
    .build();

  // 🚨 ถ้า disconnect
  connection.onclose((error) => {
    console.warn("❌ SignalR disconnected", error);
  });

  // 🔁 ตอนเริ่ม reconnect
  connection.onreconnecting((error) => {
    console.warn("🟡 Reconnecting...", error?.message);
  });

  // ✅ เมื่อ reconnect สำเร็จ
  connection.onreconnected((connectionId) => {
    console.log("✅ Reconnected to SignalR", connectionId);
  });

  // 🟢 เริ่มการเชื่อมต่อ
  try {
    await connection.start();
    console.log("🟢 SignalR connected");
  } catch (err) {
    console.error("❌ SignalR failed to connect:", err);
  }

  return connection;
};

export default createSignalRConnection;
