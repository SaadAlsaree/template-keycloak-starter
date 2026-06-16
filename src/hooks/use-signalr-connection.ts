'use client';

import { useState, useEffect } from 'react';
import { useSignalRStore } from '@/store/signalr-store';
import { useSession } from 'next-auth/react';

export function useSignalRConnection() {
  const { status } = useSession();
  const { connectionStatus, isConnected, reconnect } = useSignalRStore();
  const [lastError, setLastError] = useState<Error | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  useEffect(() => {
    if (connectionStatus === 'connected') {
      setLastError(null);
      setReconnectAttempts(0);
    } else if (connectionStatus === 'reconnecting') {
      setReconnectAttempts((prev) => prev + 1);
    }
  }, [connectionStatus]);

  const manualReconnect = async () => {
    try {
      setReconnectAttempts((prev) => prev + 1);
      if (status !== 'authenticated') {
        throw new Error('Not authenticated');
      }
      await reconnect();
    } catch (error) {
      setLastError(error as Error);
    }
  };

  const statusText = {
    connecting: 'Connecting...',
    connected: 'Connected',
    disconnected: 'Disconnected',
    reconnecting: `Reconnecting... (${reconnectAttempts})`
  } as const;

  const statusColor = {
    connecting: 'text-yellow-600',
    connected: 'text-green-600',
    disconnected: 'text-red-600',
    reconnecting: 'text-yellow-600'
  } as const;

  const statusIcon = {
    connecting: '●',
    connected: '●',
    disconnected: '●',
    reconnecting: '●'
  } as const;

  return {
    status: connectionStatus,
    statusText: statusText[connectionStatus],
    statusColor: statusColor[connectionStatus],
    statusIcon: statusIcon[connectionStatus],
    isConnected,
    isDisconnected: connectionStatus === 'disconnected',
    isReconnecting: connectionStatus === 'reconnecting',
    lastError,
    reconnectAttempts,
    reconnect: manualReconnect
  };
}
