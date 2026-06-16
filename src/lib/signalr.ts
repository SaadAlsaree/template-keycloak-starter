import * as signalR from '@microsoft/signalr';
import { HubConnection, HubConnectionState } from '@microsoft/signalr';
import { sanitizeLogMessage } from '@/lib/utils';

export type ConnectionStatus =
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'reconnecting';

export interface SignalRConnectionConfig {
  hubPath: string;
  hubUrl?: string;
  onReconnecting?: (error?: Error) => void;
  onReconnected?: (connectionId?: string) => void;
  onClose?: (error?: Error) => void;
}

async function fetchHubAccessToken(): Promise<string> {
  const res = await fetch('/api/auth/hub-token');
  if (!res.ok) {
    throw new Error('Failed to get hub token');
  }
  const data = await res.json();
  return data.accessToken as string;
}

function getHubBaseUrl(hubUrl?: string): string {
  return hubUrl || process.env.NEXT_PUBLIC_HUB_URL || '';
}

class StrictModeFilteredLogger implements signalR.ILogger {
  log(logLevel: signalR.LogLevel, message: string): void {
    const sanitizedMessage = sanitizeLogMessage(message);

    if (
      sanitizedMessage.includes('stopped during negotiation') ||
      sanitizedMessage.includes('stop() was called') ||
      (sanitizedMessage.includes('Failed to start the connection') &&
        (sanitizedMessage.includes('negotiation') ||
          sanitizedMessage.includes('stop()')))
    ) {
      return;
    }

    if (
      logLevel === signalR.LogLevel.Error ||
      logLevel === signalR.LogLevel.Critical
    ) {
      console.error(sanitizedMessage);
    } else if (logLevel === signalR.LogLevel.Warning) {
      console.warn(sanitizedMessage);
    }
  }
}

export class SignalRConnectionFactory {
  private static readonly DEFAULT_TIMEOUT = 30000;
  private static readonly customLogger = new StrictModeFilteredLogger();

  static createHubConnection(
    config: SignalRConnectionConfig
  ): HubConnection {
    const baseUrl = getHubBaseUrl(config.hubUrl);

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${baseUrl}${config.hubPath}`, {
        accessTokenFactory: fetchHubAccessToken,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          if (retryContext.previousRetryCount === 0) {
            return 0;
          }
          return Math.min(
            1000 * Math.pow(2, retryContext.previousRetryCount),
            30000
          );
        }
      })
      .configureLogging(this.customLogger)
      .withServerTimeout(this.DEFAULT_TIMEOUT)
      .withKeepAliveInterval(15000)
      .build();

    if (config.onReconnecting) {
      connection.onreconnecting(config.onReconnecting);
    }
    if (config.onReconnected) {
      connection.onreconnected(config.onReconnected);
    }
    if (config.onClose) {
      connection.onclose(config.onClose);
    }

    return connection;
  }

  static async startConnection(connection: HubConnection): Promise<void> {
    try {
      if (connection.state === HubConnectionState.Connected) {
        return;
      }
      await connection.start();
    } catch (error: any) {
      const errorMessage = error?.message || '';
      if (
        errorMessage.includes('stop() was called') ||
        errorMessage.includes('stopped during negotiation')
      ) {
        return;
      }
      throw error;
    }
  }

  static async stopConnection(connection: HubConnection): Promise<void> {
    try {
      if (connection.state === HubConnectionState.Disconnected) {
        return;
      }
      await connection.stop();
    } catch (error) {
      // ignore stop errors
    }
  }

  static getConnectionStatus(
    connection: HubConnection | null
  ): ConnectionStatus {
    if (!connection) return 'disconnected';
    switch (connection.state) {
      case HubConnectionState.Connecting:
        return 'connecting';
      case HubConnectionState.Connected:
        return 'connected';
      case HubConnectionState.Disconnected:
        return 'disconnected';
      case HubConnectionState.Reconnecting:
        return 'reconnecting';
      default:
        return 'disconnected';
    }
  }

  static isConnectionHealthy(connection: HubConnection | null): boolean {
    return connection?.state === HubConnectionState.Connected;
  }
}
