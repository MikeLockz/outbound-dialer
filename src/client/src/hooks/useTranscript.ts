import { useEffect, useState, useRef, useCallback } from 'react';
import type { TranscriptMessage } from '../components/TranscriptViewer'; // Re-use the interface

export const useTranscript = () => {
  const [messages, setMessages] = useState<TranscriptMessage[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const [shouldReconnect, setShouldReconnect] = useState(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      return; // Already connected or connecting
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    // const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // const host = window.location.host; // This will include port if present
    const ws = new WebSocket('ws://localhost:3001/transcripts'); // Connect directly to backend

    ws.onopen = () => {
      console.log('WebSocket connected.');
      setShouldReconnect(false); // Reset reconnect flag on successful connection
    };

    ws.onmessage = (event) => {
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
      console.log('WebSocket disconnected:', event.code, event.reason);
      if (!event.wasClean) {
        // Attempt to reconnect if not a clean close
        setShouldReconnect(true);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      ws.close(); // Close to trigger onclose and potential reconnect
    };

    wsRef.current = ws;
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounted');
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