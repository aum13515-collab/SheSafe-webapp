import { SMS2Response } from '../types';
import { API_ENDPOINTS } from '../utils/constants';
import { formatPhoneForSMS } from '../utils/phoneUtils';

export const smsService = {
  async sendSMS(
    phoneNumber: string,
    message: string,
    apiKey: string
  ): Promise<SMS2Response> {
    if (!apiKey) {
      throw new Error('Fast2SMS API key is not set');
    }

    const cleanedPhone = formatPhoneForSMS(phoneNumber);

    try {
      const response = await fetch(API_ENDPOINTS.FAST2SMS, {
        method: 'POST',
        headers: {
          'authorization': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          route: 'q',
          message: message,
          language: 'english',
          flash: 0,
          numbers: cleanedPhone
        })
      });

      if (!response.ok) {
        throw new Error(`SMS API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(`Failed to send SMS: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  async sendTestSMS(phoneNumber: string, apiKey: string): Promise<SMS2Response> {
    const message = 'SheSafe Test SMS - Your alert system is working correctly!';
    return this.sendSMS(phoneNumber, message, apiKey);
  }
};
