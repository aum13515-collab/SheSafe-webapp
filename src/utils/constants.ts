export const INDIAN_PHONE_REGEX = /^[6-9]\d{9}$/;

export const DEFAULT_POLLING_INTERVAL = 2000;
export const DEFAULT_ESP_RETRY_INTERVAL = 5000;
export const SOS_HOLD_DURATION = 2000;
export const GPS_TIMEOUT = 10000;

export const ALERT_MESSAGE_FORMAT = (userName: string, mapsLink: string) =>
  `SHESAFE EMERGENCY ALERT! ${userName} needs immediate help! Live location: ${mapsLink} Please call or reach her immediately. This is an automated SOS alert.`;

export const API_ENDPOINTS = {
  FAST2SMS: 'https://www.fast2sms.com/dev/bulkV2',
  ESP_STATUS: '/status',
  ESP_ALERT: '/alert',
  ESP_RESET: '/reset'
};

export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

export const ERROR_MESSAGES = {
  INVALID_PHONE: 'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8 or 9',
  NO_GPS: 'GPS not supported on this device',
  GPS_PERMISSION_DENIED: 'Location permission denied. Please allow location access.',
  GPS_UNAVAILABLE: 'GPS unavailable. Move to open area.',
  GPS_TIMEOUT: 'Location timeout. Try again.',
  NO_CONTACTS: 'No emergency contacts saved. Add contacts first.',
  NO_API_KEY: 'Fast2SMS API key not configured. Go to Settings.',
  USERNAME_TAKEN: 'Username already taken',
  PASSWORD_MISMATCH: 'Passwords do not match'
};

export const SUCCESS_MESSAGES = {
  ALERT_SENT: 'Alert sent successfully',
  SMS_TEST_SENT: 'Test SMS sent',
  CONTACT_ADDED: 'Contact added successfully',
  CONTACT_REMOVED: 'Contact removed',
  SETTINGS_SAVED: 'Settings saved',
  PROFILE_UPDATED: 'Profile updated'
};
