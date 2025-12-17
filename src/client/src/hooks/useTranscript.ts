import { useEffect, useState, useRef, useCallback } from 'react';
import type { TranscriptMessage } from '../components/TranscriptViewer'; // Re-use the interface

export const useTranscript = () => {
  const [messages, setMessages] = useState<TranscriptMessage[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const [shouldReconnect, setShouldReconnect] = useState(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      return wsRef.current; // Already connected or connecting
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    // const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // const host = window.location.host; // This will include port if present
    const ws = new WebSocket('ws://localhost:3001/transcripts'); // Connect directly to backend
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (ws as any)._isCleanedUp = false;

    ws.onopen = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((ws as any)._isCleanedUp) return;
      console.log('WebSocket connected.');
      setShouldReconnect(false); // Reset reconnect flag on successful connection
    };

    ws.onmessage = (event) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((ws as any)._isCleanedUp) return;
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'transcript') {
          setMessages((prevMessages) => [...prevMessages, data as TranscriptMessage]);
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onclose = (event) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((ws as any)._isCleanedUp) return;
      console.log('WebSocket disconnected:', event.code, event.reason);
      if (!event.wasClean) {
        // Attempt to reconnect if not a clean close
        setShouldReconnect(true);
      }
    };

    ws.onerror = (error) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((ws as any)._isCleanedUp) return;
      console.error('WebSocket error:', error);
      ws.close(); // Close to trigger onclose and potential reconnect
    };

    wsRef.current = ws;
    return ws;
  }, []);

  useEffect(() => {
    const wsInstance = connect();

    return () => {
      if (wsInstance) {
        // Mark as cleaned up to suppress handlers
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (wsInstance as any)._isCleanedUp = true;

        wsInstance.onopen = null;
        wsInstance.onclose = null;
        wsInstance.onerror = null;
        wsInstance.onmessage = null;

        wsInstance.close(1000, 'Component unmounted');
        if (wsRef.current === wsInstance) {
          wsRef.current = null;
        }
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);

  useEffect(() => {
    if (shouldReconnect) {
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log('Attempting to reconnect WebSocket...');
        connect();
      }, 3000);
    }
  }, [shouldReconnect, connect]);

  // Function to clear messages if needed (e.g., when a new call starts)
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, clearMessages };
};