import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

// 🔗 WEBSOCKET HOOK FOR GALATEA EMPIRE
// Real-time communication with backend across all pillars

export function useSocket() {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    const socketUrl = process.env.NODE_ENV === 'production' 
      ? window.location.origin 
      : 'http://localhost:8080';

    socketRef.current = io(socketUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000
    });

    const socket = socketRef.current;

    // Connection event handlers
    socket.on('connect', () => {
      console.log('🔗 Socket connected:', socket.id);
      setConnected(true);
      setError(null);
      setReconnectAttempts(0);
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
      setConnected(false);
      
      if (reason === 'io server disconnect') {
        // Server disconnected, manual reconnection needed
        socket.connect();
      }
    });

    socket.on('connect_error', (error) => {
      console.error('🚫 Socket connection error:', error);
      setError(error.message);
      setReconnectAttempts(prev => prev + 1);
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
      setConnected(true);
      setError(null);
    });

    socket.on('reconnect_error', (error) => {
      console.error('🔄 Socket reconnection failed:', error);
      setError(error.message);
    });

    socket.on('reconnect_failed', () => {
      console.error('💥 Socket reconnection failed permanently');
      setError('Unable to reconnect to server');
    });

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('connect_error');
        socket.off('reconnect');
        socket.off('reconnect_error');
        socket.off('reconnect_failed');
        socket.disconnect();
      }
    };
  }, []);

  // Emit function with error handling
  const emit = (event, data) => {
    if (socketRef.current && connected) {
      socketRef.current.emit(event, data);
      return true;
    } else {
      console.warn('🚫 Cannot emit - socket not connected');
      return false;
    }
  };

  // Subscribe to events
  const on = (event, handler) => {
    if (socketRef.current) {
      socketRef.current.on(event, handler);
    }
  };

  // Unsubscribe from events
  const off = (event, handler) => {
    if (socketRef.current) {
      socketRef.current.off(event, handler);
    }
  };

  return {
    socket: socketRef.current,
    connected,
    error,
    reconnectAttempts,
    emit,
    on,
    off
  };
}

// 🎭 SOUL-SPECIFIC SOCKET HOOK
export function useSoulSocket(soulName, userId) {
  const { socket, connected, emit, on, off } = useSocket();
  const [isInRoom, setIsInRoom] = useState(false);

  useEffect(() => {
    if (socket && connected && soulName && userId) {
      // Join soul-specific room
      const roomData = { soul: soulName, userId };
      emit('join_chat', roomData);
      setIsInRoom(true);

      return () => {
        emit('leave_chat', roomData);
        setIsInRoom(false);
      };
    }
  }, [socket, connected, soulName, userId, emit]);

  return {
    socket,
    connected,
    isInRoom,
    emit,
    on,
    off
  };
}

// 🎛️ WATCHTOWER SOCKET HOOK (Admin)
export function useWatchtowerSocket(isAdmin = false) {
  const { socket, connected, emit, on, off } = useSocket();
  const [watchtowerConnected, setWatchtowerConnected] = useState(false);

  useEffect(() => {
    if (socket && connected && isAdmin) {
      // Join watchtower monitoring
      emit('join_watchtower', { isAdmin: true });
      setWatchtowerConnected(true);

      return () => {
        emit('leave_watchtower', {});
        setWatchtowerConnected(false);
      };
    }
  }, [socket, connected, isAdmin, emit]);

  return {
    socket,
    connected,
    watchtowerConnected,
    emit,
    on,
    off
  };
}

export default useSocket;