import { storageService } from './storageService';
import { alertService } from './alertService';

interface ESPStatus {
  pressed: boolean;
  lastPressed?: string;
}

let pollingIntervalId: NodeJS.Timeout | null = null;
let connectionRetryId: NodeJS.Timeout | null = null;
let isConnected = false;

const getESPStatusUrl = (): string => {
  const settings = storageService.getSettings();
  const baseUrl = settings.espIpAddress.startsWith('http')
    ? settings.espIpAddress
    : `http://${settings.espIpAddress}`;
  return `${baseUrl}/status`;
};

const getESPResetUrl = (): string => {
  const settings = storageService.getSettings();
  const baseUrl = settings.espIpAddress.startsWith('http')
    ? settings.espIpAddress
    : `http://${settings.espIpAddress}`;
  return `${baseUrl}/reset`;
};

const checkConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(getESPStatusUrl(), {
      method: 'GET',
      mode: 'cors'
    });
    isConnected = response.ok;
    return isConnected;
  } catch (error) {
    isConnected = false;
    return false;
  }
};

const pollESPStatus = async (userId: string): Promise<void> => {
  try {
    const response = await fetch(getESPStatusUrl(), {
      method: 'GET',
      mode: 'cors'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch ESP status');
    }

    const status: ESPStatus = await response.json();

    if (status.pressed) {
      // Trigger alert
      try {
        await alertService.triggerAlert(userId);
      } catch (error) {
        console.error('Alert trigger error:', error);
      }

      // Reset the button flag
      try {
        await fetch(getESPResetUrl(), { method: 'GET', mode: 'cors' });
      } catch (err) {
        console.error('Reset error:', err);
      }
    }

    isConnected = true;
  } catch (error) {
    isConnected = false;
    console.error('ESP polling error:', error);
  }
};

export const espPollingService = {
  startPolling(userId: string): void {
    if (pollingIntervalId) {
      console.warn('Polling already started');
      return;
    }

    const settings = storageService.getSettings();
    if (!settings.pollingEnabled) {
      return;
    }

    pollingIntervalId = setInterval(() => {
      pollESPStatus(userId);
    }, settings.pollingInterval);
  },

  stopPolling(): void {
    if (pollingIntervalId) {
      clearInterval(pollingIntervalId);
      pollingIntervalId = null;
    }
  },

  isPolling(): boolean {
    return pollingIntervalId !== null;
  },

  async checkESPConnection(): Promise<boolean> {
    return checkConnection();
  },

  isConnected(): boolean {
    return isConnected;
  },

  startConnectionRetry(userId: string, retryInterval: number = 5000): void {
    if (connectionRetryId) {
      return;
    }

    connectionRetryId = setInterval(async () => {
      if (!isConnected) {
        const connected = await checkConnection();
        if (connected) {
          this.startPolling(userId);
        }
      }
    }, retryInterval);
  },

  stopConnectionRetry(): void {
    if (connectionRetryId) {
      clearInterval(connectionRetryId);
      connectionRetryId = null;
    }
  }
};
