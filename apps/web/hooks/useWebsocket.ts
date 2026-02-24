"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

interface UseWebSocketOptions {
  url: string;
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  reconnect?: boolean;
  reconnectInterval?: number;
}

export function useWebSocket({
  url,
  onMessage,
  onConnect,
  onDisconnect,
  onError,
  reconnect = true,
  reconnectInterval = 3000,
}: UseWebSocketOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    try {
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        setIsConnected(true);
        onConnect?.();
      };

      ws.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);
          onMessage?.(message);
        } catch (e) {
          console.error("WebSocket message parse error:", e);
        }
      };

      ws.current.onclose = () => {
        setIsConnected(false);
        onDisconnect?.();
        
        if (reconnect) {
          reconnectTimer.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        onError?.(error);
      };
    } catch (error) {
      console.error("WebSocket connection error:", error);
    }
  }, [url, onMessage, onConnect, onDisconnect, onError, reconnect, reconnectInterval]);

  const disconnect = useCallback(() => {
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
    }
    ws.current?.close();
  }, []);

  const send = useCallback((data: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    }
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    isConnected,
    lastMessage,
    send,
    connect,
    disconnect,
  };
}

// Hook for dashboard real-time updates
export function useDashboardRealtime() {
  const [liveStats, setLiveStats] = useState({
    totalUsers: 0,
    totalDonations: 0,
    activeUsers: 0,
    recentDonations: [],
  });

  const { isConnected, lastMessage } = useWebSocket({
    url: "ws://localhost:8000/ws/dashboard/",
    onMessage: (message) => {
      if (message.type === "stats_update") {
        setLiveStats((prev) => ({
          ...prev,
          ...message.data,
        }));
      }
    },
  });

  return {
    isConnected,
    liveStats,
    lastMessage,
  };
}

// Hook for donation notifications
export function useDonationNotifications(onNewDonation?: (donation: any) => void) {
  const { isConnected, lastMessage } = useWebSocket({
    url: "ws://localhost:8000/ws/donations/",
    onMessage: (message) => {
      if (message.type === "new_donation") {
        onNewDonation?.(message.data);
      }
    },
  });

  return {
    isConnected,
    lastMessage,
  };
}
