import { LocationData } from '../types';
import { ERROR_MESSAGES } from '../utils/constants';

export const locationService = {
  async getCurrentLocation(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error(ERROR_MESSAGES.NO_GPS));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy
          }),
        (err) => {
          if (err.code === 1) {
            reject(new Error(ERROR_MESSAGES.GPS_PERMISSION_DENIED));
          } else if (err.code === 2) {
            reject(new Error(ERROR_MESSAGES.GPS_UNAVAILABLE));
          } else if (err.code === 3) {
            reject(new Error(ERROR_MESSAGES.GPS_TIMEOUT));
          } else {
            reject(new Error('Failed to get location'));
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  },

  getMapsLink(latitude: number, longitude: number): string {
    return `https://maps.google.com/?q=${latitude},${longitude}`;
  }
};
