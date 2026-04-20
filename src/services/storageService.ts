import { User, Contact, AlertLog, AppSettings } from '../types';
import { DEFAULT_POLLING_INTERVAL } from '../utils/constants';

const STORAGE_KEYS = {
  USERS: 'shesafe_users',
  CONTACTS: 'shesafe_contacts',
  ALERT_LOGS: 'shesafe_alert_logs',
  SETTINGS: 'shesafe_settings',
  CURRENT_USER: 'shesafe_current_user',
  ADMIN_LOGGED_IN: 'shesafe_admin_logged_in'
};

export const storageService = {
  // User management
  getAllUsers(): User[] {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  getUserById(id: string): User | null {
    const users = this.getAllUsers();
    return users.find(u => u.id === id) || null;
  },

  getUserByUsername(username: string): User | null {
    const users = this.getAllUsers();
    return users.find(u => u.username === username) || null;
  },

  saveUser(user: User): void {
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index > -1) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  deleteUser(id: string): void {
    const users = this.getAllUsers().filter(u => u.id !== id);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.deleteUserContacts(id);
    this.deleteUserAlerts(id);
  },

  // Contact management
  getContacts(userId: string): Contact[] {
    const data = localStorage.getItem(STORAGE_KEYS.CONTACTS);
    const allContacts = data ? JSON.parse(data) : [];
    return allContacts.filter((c: Contact) => c.userId === userId);
  },

  saveContact(contact: Contact): void {
    const contacts = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTACTS) || '[]');
    const index = contacts.findIndex((c: Contact) => c.id === contact.id);
    if (index > -1) {
      contacts[index] = contact;
    } else {
      contacts.push(contact);
    }
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
  },

  deleteContact(id: string): void {
    const contacts = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTACTS) || '[]');
    const filtered = contacts.filter((c: Contact) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(filtered));
  },

  deleteUserContacts(userId: string): void {
    const contacts = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTACTS) || '[]');
    const filtered = contacts.filter((c: Contact) => c.userId !== userId);
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(filtered));
  },

  // Alert logs
  getAlertLogs(userId: string): AlertLog[] {
    const data = localStorage.getItem(STORAGE_KEYS.ALERT_LOGS);
    const allLogs = data ? JSON.parse(data) : [];
    return allLogs
      .filter((log: AlertLog) => log.userId === userId)
      .sort((a: AlertLog, b: AlertLog) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  addAlertLog(log: Omit<AlertLog, 'id' | 'timestamp'>): AlertLog {
    const alertLog: AlertLog = {
      ...log,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.ALERT_LOGS) || '[]');
    logs.push(alertLog);
    localStorage.setItem(STORAGE_KEYS.ALERT_LOGS, JSON.stringify(logs));
    return alertLog;
  },

  deleteUserAlerts(userId: string): void {
    const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.ALERT_LOGS) || '[]');
    const filtered = logs.filter((log: AlertLog) => log.userId !== userId);
    localStorage.setItem(STORAGE_KEYS.ALERT_LOGS, JSON.stringify(filtered));
  },

  clearAlertLogs(userId: string): void {
    this.deleteUserAlerts(userId);
  },

  getAllAlertLogs(): AlertLog[] {
    const data = localStorage.getItem(STORAGE_KEYS.ALERT_LOGS);
    return data ? JSON.parse(data) : [];
  },

  // Settings
  getSettings(): AppSettings {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data
      ? JSON.parse(data)
      : {
          fast2smsApiKey: '',
          espIpAddress: 'localhost:3000',
          pollingEnabled: true,
          pollingInterval: DEFAULT_POLLING_INTERVAL
        };
  },

  saveSettings(settings: AppSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  // User session
  getCurrentUser(): User | null {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  setAdminLoggedIn(loggedIn: boolean): void {
    if (loggedIn) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_LOGGED_IN, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_LOGGED_IN);
    }
  },

  isAdminLoggedIn(): boolean {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_LOGGED_IN) === 'true';
  },

  clearAll(): void {
    localStorage.clear();
  }
};
