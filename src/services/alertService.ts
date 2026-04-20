import { AlertResult, AlertLog } from '../types';
import { locationService } from './locationService';
import { smsService } from './smsService';
import { storageService } from './storageService';
import { ALERT_MESSAGE_FORMAT, ERROR_MESSAGES } from '../utils/constants';

export const alertService = {
  async triggerAlert(userId: string): Promise<AlertResult> {
    // Step 1: Get GPS location
    const location = await locationService.getCurrentLocation();

    // Step 2: Build Google Maps link
    const mapsLink = locationService.getMapsLink(location.latitude, location.longitude);

    // Step 3: Get user name for personalized message
    const user = storageService.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Step 4: Get settings and contacts
    const settings = storageService.getSettings();
    const contacts = storageService.getContacts(userId);

    if (!settings.fast2smsApiKey) {
      throw new Error(ERROR_MESSAGES.NO_API_KEY);
    }

    if (contacts.length === 0) {
      throw new Error(ERROR_MESSAGES.NO_CONTACTS);
    }

    // Step 5: Build SMS message
    const message = ALERT_MESSAGE_FORMAT(user.name, mapsLink);

    // Step 6: Send to all contacts
    const results = await Promise.allSettled(
      contacts.map((contact) => smsService.sendSMS(contact.phone, message, settings.fast2smsApiKey))
    );

    // Step 7: Count successes and failures
    const succeeded = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    // Step 8: Log the alert
    storageService.addAlertLog({
      userId,
      userName: user.name,
      latitude: location.latitude,
      longitude: location.longitude,
      mapsLink,
      contactsNotified: succeeded,
      status: failed === 0 ? 'success' : succeeded > 0 ? 'partial' : 'failed'
    });

    return {
      succeeded,
      failed,
      mapsLink,
      latitude: location.latitude,
      longitude: location.longitude
    };
  },

  getAlertHistory(userId: string): AlertLog[] {
    return storageService.getAlertLogs(userId);
  },

  clearAlertHistory(userId: string): void {
    storageService.clearAlertLogs(userId);
  },

  getLastAlert(userId: string): AlertLog | null {
    const logs = this.getAlertHistory(userId);
    return logs.length > 0 ? logs[0] : null;
  }
};
