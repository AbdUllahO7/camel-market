/**
 * دوال مساعدة لتنسيق الأسعار والتواريخ والأرقام
 */

export const formatPrice = (amount: number, currency = 'د.ك'): string => {
  return `${new Intl.NumberFormat('ar-KW').format(amount)} ${currency}`;
};

export const formatDate = (dateString: string): string => {
  try {
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
};

export const formatPhoneNumber = (phone: string, countryCode = '+965'): string => {
  if (phone.startsWith('+')) return phone;
  return `${countryCode} ${phone}`;
};
