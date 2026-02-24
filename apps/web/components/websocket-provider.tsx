"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp?: string;
}

type MessageHandler = (message: WebSocketMessage) => void;

interface WebSocketContextType {
  isConnected: boolean;
  subscribe: (handler: MessageHandler) => () => void;
  send: (data: any) => void;
}

// Dashboard WebSocket Context
const DashboardWebSocketContext = createContext<WebSocketContextType | null>(null);
// Donations WebSocket Context  
const DonationsWebSocketContext = createContext<WebSocketContextType | null>(null);

interface WebSocketProviderProps {
  children: React.ReactNode;
}

function createWebSocketProvider(url: string, name: string) {
  const Context = createContext<WebSocketContextType | null>(null);
  
  function Provider({ children }: { children: React.ReactNode }) {
    const [isConnected, setIsConnected] = useState(false);
    const ws = useRef<WebSocket | null>(null);
    const reconnectTimer = useRef<NodeJS.Timeout | null>(null);
    const handlers = useRef<Set<MessageHandler>>(new Set());
    const reconnectAttempts = useRef(0);
    const MAX_RECONNECT_ATTEMPTS = 5;
    const BASE_RECONNECT_INTERVAL = 5000;

    const connect = useCallback(() => {
      if (ws.current?.readyState === WebSocket.OPEN || ws.current?.readyState === WebSocket.CONNECTING) {
        return;
      }

      try {
        console.log(`[${name}] Connecting to ${url}...`);
        ws.current = new WebSocket(url);

        ws.current.onopen = () => {
          console.log(`[${name}] Connected`);
          setIsConnected(true);
          reconnectAttempts.current = 0;
        };

        ws.current.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            handlers.current.forEach((handler) => {
              try {
                handler(message);
              } catch (e) {
                console.error(`[${name}] Handler error:`, e);
              }
            });
          } catch (e) {
            console.error(`[${name}] Parse error:`, e);
          }
        };

        ws.current.onclose = (event) => {
          console.log(`[${name}] Disconnected (code: ${event.code})`);
          setIsConnected(false);
          ws.current = null;

          if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
            const delay = Math.min(
              BASE_RECONNECT_INTERVAL * Math.pow(2, reconnectAttempts.current),
              30000
            );
            console.log(`[${name}] Reconnecting in ${delay}ms (attempt ${reconnectAttempts.current + 1})`);
            
            reconnectTimer.current = setTimeout(() => {
              reconnectAttempts.current++;
              connect();
            }, delay);
          }
        };

        ws.current.onerror = (error) => {
          console.error(`[${name}] Error:`, error);
        };
      } catch (error) {
        console.error(`[${name}] Connection error:`, error);
      }
    }, []);

    const disconnect = useCallback(() => {
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
      }
      reconnectAttempts.current = MAX_RECONNECT_ATTEMPTS;
      ws.current?.close();
      ws.current = null;
    }, []);

    const subscribe = useCallback((handler: MessageHandler) => {
      handlers.current.add(handler);
      return () => {
        handlers.current.delete(handler);
      };
    }, []);

    const send = useCallback((data: any) => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(data));
      } else {
        console.warn(`[${name}] Not connected, cannot send`);
      }
    }, []);

    useEffect(() => {
      connect();
      return () => disconnect();
    }, [connect, disconnect]);

    return (
      <Context.Provider value={{ isConnected, subscribe, send }}>
        {children}
      </Context.Provider>
    );
  }

  function useWebSocket() {
    const context = useContext(Context);
    if (!context) {
      throw new Error(`use${name} must be used within ${name}Provider`);
    }
    return context;
  }

  return { Provider, useWebSocket, Context };
}

// Create dashboard provider
const { 
  Provider: DashboardProvider, 
  useWebSocket: useDashboardWebSocket,
  Context: DashboardContext
} = createWebSocketProvider("ws://localhost:8000/ws/dashboard/", "DashboardWS");

// Create donations provider
const { 
  Provider: DonationsProvider, 
  useWebSocket: useDonationsWebSocket,
  Context: DonationsContext
} = createWebSocketProvider("ws://localhost:8000/ws/donations/", "DonationsWS");

// Combined provider
export function WebSocketProvider({ children }: WebSocketProviderProps) {
  return (
    <DashboardProvider>
      <DonationsProvider>
        {children}
      </DonationsProvider>
    </DashboardProvider>
  );
}

// Hook for dashboard stats
export function useDashboardStats() {
  const [liveStats, setLiveStats] = useState({
    totalUsers: 0,
    totalDonations: 0,
    activeUsers: 0,
    recentDonations: [],
  });
  const { subscribe, isConnected } = useDashboardWebSocket();

  useEffect(() => {
    const unsubscribe = subscribe((message) => {
      if (message.type === "stats_update") {
        setLiveStats((prev) => ({
          ...prev,
          ...message.data,
        }));
      }
    });
    return unsubscribe;
  }, [subscribe]);

  return { isConnected, liveStats };
}

// Hook for donation notifications
export function useDonationNotifications(onNewDonation?: (donation: any) => void) {
  const { subscribe, isConnected } = useDonationsWebSocket();

  useEffect(() => {
    const unsubscribe = subscribe((message) => {
      if (message.type === "new_donation") {
        onNewDonation?.(message.data);
      }
    });
    return unsubscribe;
  }, [subscribe, onNewDonation]);

  return { isConnected };
}
