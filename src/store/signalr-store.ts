import { create } from 'zustand';
import { HubConnection } from '@microsoft/signalr';
import { SignalRConnectionFactory } from '@/lib/signalr';
import { sanitizeLogMessage } from '@/lib/utils';

export type ConnectionStatus = 'connected' | 'reconnecting' | 'disconnected';

interface HubRegistration {
  key: string;
  connection: HubConnection;
}

interface SignalRState {
  hubs: HubRegistration[];
  connectionStatus: ConnectionStatus;
  isConnected: boolean;

  registerHub: (key: string, connection: HubConnection) => void;
  unregisterHub: (key: string) => void;
  initialize: (hubs: HubRegistration[]) => Promise<void>;
  cleanup: () => Promise<void>;
  reconnect: () => Promise<void>;
}

export const useSignalRStore = create<SignalRState>((set, get) => ({
  hubs: [],
  connectionStatus: 'disconnected',
  isConnected: false,

  registerHub: (key, connection) => {
    set((state) => ({
      hubs: [...state.hubs.filter((h) => h.key !== key), { key, connection }]
    }));
  },

  unregisterHub: (key) => {
    const hub = get().hubs.find((h) => h.key === key);
    if (hub) {
      SignalRConnectionFactory.stopConnection(hub.connection).catch(() => {});
    }
    set((state) => ({
      hubs: state.hubs.filter((h) => h.key !== key)
    }));
  },

  initialize: async (hubs: HubRegistration[]) => {
    const { cleanup } = get();
    if (get().hubs.length > 0) {
      await cleanup();
    }

    try {
      const setStatus = (status: ConnectionStatus) => {
        set({ connectionStatus: status, isConnected: status === 'connected' });
      };

      set({ hubs });

      await Promise.all(
        hubs.map(async (hub) => {
          hub.connection.onclose((error) => {
            if (error)
              console.error(
                `[SignalR] ${hub.key} closed:`,
                error instanceof Error
                  ? sanitizeLogMessage(error.message)
                  : error
              );
            setStatus('disconnected');
          });
          hub.connection.onreconnecting(() => setStatus('reconnecting'));
          hub.connection.onreconnected(() => setStatus('connected'));
          await SignalRConnectionFactory.startConnection(hub.connection);
        })
      );

      setStatus('connected');
    } catch (error) {
      console.error(
        '[SignalR] Failed to initialize connections:',
        error instanceof Error ? sanitizeLogMessage(error.message) : error
      );
      await get().cleanup();
    }
  },

  cleanup: async () => {
    const hubs = get().hubs;
    set({ hubs: [], connectionStatus: 'disconnected', isConnected: false });

    await Promise.all(
      hubs.map(async (hub) => {
        try {
          await SignalRConnectionFactory.stopConnection(hub.connection);
        } catch (error) {
          console.error(
            '[SignalR] Error stopping connection:',
            error instanceof Error ? sanitizeLogMessage(error.message) : error
          );
        }
      })
    );
  },

  reconnect: async () => {
    const { hubs, initialize } = get();
    if (hubs.length > 0) {
      await initialize(hubs);
    }
  }
}));
