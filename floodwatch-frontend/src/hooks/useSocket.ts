import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Reading } from '../types';
import { notifyFloodRisk } from '../utils/notifications';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const useSocket = (onNewReading: (reading: Reading) => void) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, { transports: ['websocket'] });

    socketRef.current.on('connect', () => {
      console.log('Socket connected:', socketRef.current?.id);
    });

    socketRef.current.on('new_reading', (reading: Reading) => {
      onNewReading(reading);
      notifyFloodRisk(reading.floodRisk, reading.location);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [onNewReading]);

  return socketRef.current;
};
