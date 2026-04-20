import { INDIAN_PHONE_REGEX } from './constants';

export function validateIndianPhone(phone: string): boolean {
  const cleaned = cleanPhone(phone);
  return INDIAN_PHONE_REGEX.test(cleaned);
}

export function cleanPhone(phone: string): string {
  // Remove spaces, dashes, brackets
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Remove +91 or 91 prefix if present
  if (cleaned.startsWith('+91')) {
    cleaned = cleaned.slice(3);
  } else if (cleaned.startsWith('91') && cleaned.length === 12) {
    cleaned = cleaned.slice(2);
  }
  
  return cleaned;
}

export function formatDisplayPhone(phone: string): string {
  const cleaned = cleanPhone(phone);
  if (cleaned.length !== 10) {
    return phone;
  }
  // Format: +91 98765 43210
  return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
}

export function formatPhoneForSMS(phone: string): string {
  // Return clean 10-digit number without +91 for SMS API
  return cleanPhone(phone);
}
