export interface User {
  id: string;
  username: string;
  passwordHash: string;
  name: string;
  phone: string;
  createdAt: string;
}

export interface Contact {
  id: string;
  userId: string;
  name: string;
  phone: string;
}

export interface AlertLog {
  id: string;
  userId: string;
  userName: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  mapsLink: string;
  contactsNotified: number;
  status: 'success' | 'partial' | 'failed';
}

export interface AppSettings {
  fast2smsApiKey: string;
  espIpAddress: string;
  pollingEnabled: boolean;
  pollingInterval: number;
}

export interface AlertResult {
  succeeded: number;
  failed: number;
  mapsLink: string;
  latitude: number;
  longitude: number;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface SMS2Response {
  return: boolean;
  request_id?: string;
  message?: string[];
}

export interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: (username: string, password: string, isAdmin: boolean) => boolean;
  register: (name: string, username: string, phone: string, password: string) => boolean | string;
  logout: () => void;
}

export interface AlertContextType {
  isTriggering: boolean;
  lastAlert: AlertLog | null;
  triggerAlert: () => Promise<void>;
  getAlertHistory: () => AlertLog[];
  clearAlertHistory: () => void;
  error: string | null;
}
