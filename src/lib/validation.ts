// Form validation and sanitization utilities

export interface ValidationError {
  field: string;
  message: string;
}

// Max lengths for sanitization (align with DB/UX)
const MAX_LENGTHS = {
  name: 200,
  email: 254,
  phone: 30,
  subject: 100,
  message: 2000,
  propertyAddress: 500,
  unitNumber: 50,
  propertySize: 20,
  message_booking: 2000,
} as const;

/** Trim and limit length. Replaces control chars. */
export function sanitizeString(value: string | undefined, maxLen: number): string {
  if (value == null || typeof value !== 'string') return '';
  const trimmed = value.replace(/\s+/g, ' ').trim();
  const noControl = trimmed.replace(/[\x00-\x1F\x7F]/g, '');
  return noControl.slice(0, maxLen);
}

/** Sanitize contact form payload (returns new object). */
export function sanitizeContactInput(body: Record<string, unknown>): {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
} {
  return {
    name: sanitizeString(String(body.name ?? ''), MAX_LENGTHS.name),
    email: sanitizeString(String(body.email ?? '').toLowerCase(), MAX_LENGTHS.email),
    phone: sanitizeString(String(body.phone ?? ''), MAX_LENGTHS.phone),
    subject: sanitizeString(String(body.subject ?? ''), MAX_LENGTHS.subject),
    message: sanitizeString(String(body.message ?? ''), MAX_LENGTHS.message),
  };
}

/** Sanitize booking form payload (returns new object). */
export function sanitizeBookingInput(body: Record<string, unknown>): {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  propertyAddress: string;
  propertyType?: string;
  propertySize?: string;
  budget?: string;
  timeline?: string;
  serviceTier?: string;
  selectedAddOns: string[];
  message?: string;
  preferredDate?: string;
  preferredTime?: string;
  packageType?: string;
  totalPrice?: string;
  preferredPartnerCode?: string;
} {
  const arr = body.selectedAddOns;
  const addOns = Array.isArray(arr)
    ? arr.filter((x): x is string => typeof x === 'string').slice(0, 20)
    : [];
  return {
    name: sanitizeString(String(body.name ?? ''), MAX_LENGTHS.name),
    email: sanitizeString(String(body.email ?? '').toLowerCase(), MAX_LENGTHS.email),
    phone: sanitizeString(String(body.phone ?? ''), MAX_LENGTHS.phone),
    serviceType: sanitizeString(String(body.serviceType ?? ''), 100),
    propertyAddress: sanitizeString(String(body.propertyAddress ?? ''), MAX_LENGTHS.propertyAddress),
    propertyType: body.propertyType != null ? sanitizeString(String(body.propertyType), 100) : undefined,
    propertySize: body.propertySize != null ? sanitizeString(String(body.propertySize), MAX_LENGTHS.propertySize) : undefined,
    budget: body.budget != null ? sanitizeString(String(body.budget), 50) : undefined,
    timeline: body.timeline != null ? sanitizeString(String(body.timeline), 50) : undefined,
    serviceTier: body.serviceTier != null ? sanitizeString(String(body.serviceTier), 100) : undefined,
    selectedAddOns: addOns,
    message: body.message != null ? sanitizeString(String(body.message), MAX_LENGTHS.message_booking) : undefined,
    preferredDate: body.preferredDate != null ? sanitizeString(String(body.preferredDate), 20) : undefined,
    preferredTime: body.preferredTime != null ? sanitizeString(String(body.preferredTime), 20) : undefined,
    packageType: body.packageType != null ? sanitizeString(String(body.packageType), 100) : undefined,
    totalPrice: body.totalPrice != null ? sanitizeString(String(body.totalPrice), 20) : undefined,
    preferredPartnerCode: body.preferredPartnerCode != null ? sanitizeString(String(body.preferredPartnerCode), 50) : undefined,
  };
}

/** Honeypot field name – if this is filled, treat as bot and do not store or email. */
export const HONEYPOT_FIELD = 'website_url';

export function validateEmail(email: string): string | null {
  if (!email.trim()) {
    return 'Email is required';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email format';
  }
  
  return null;
}

export function validatePhone(phone: string): string | null {
  if (!phone.trim()) {
    return null; // Phone is optional
  }
  
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  if (!phoneRegex.test(cleanPhone)) {
    return 'Invalid phone number format';
  }
  
  return null;
}

export function validateRequired(value: string, fieldName: string): string | null {
  if (!value.trim()) {
    return `${fieldName} is required`;
  }
  return null;
}

export function validateBookingForm(formData: {
  name: string;
  email: string;
  phone?: string;
  serviceType: string;
  propertyAddress: string;
  serviceTier?: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required fields
  const nameError = validateRequired(formData.name, 'Name');
  if (nameError) errors.push({ field: 'name', message: nameError });

  const emailError = validateEmail(formData.email);
  if (emailError) errors.push({ field: 'email', message: emailError });

  const serviceTypeError = validateRequired(formData.serviceType, 'Service Type');
  if (serviceTypeError) errors.push({ field: 'serviceType', message: serviceTypeError });

  const addressError = validateRequired(formData.propertyAddress, 'Property Address');
  if (addressError) errors.push({ field: 'propertyAddress', message: addressError });

  const serviceTierError = validateRequired(formData.serviceTier || '', 'Service Package');
  if (serviceTierError) errors.push({ field: 'serviceTier', message: serviceTierError });

  // Optional fields
  if (formData.phone) {
    const phoneError = validatePhone(formData.phone);
    if (phoneError) errors.push({ field: 'phone', message: phoneError });
  }

  return errors;
}

export function validateContactForm(formData: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required fields
  const nameError = validateRequired(formData.name, 'Name');
  if (nameError) errors.push({ field: 'name', message: nameError });
  if (formData.name.trim().length >= 1 && formData.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters.' });
  }
  if (formData.name.length > 200) {
    errors.push({ field: 'name', message: 'Name is too long.' });
  }

  const emailError = validateEmail(formData.email);
  if (emailError) errors.push({ field: 'email', message: emailError });

  const subjectError = validateRequired(formData.subject, 'Subject');
  if (subjectError) errors.push({ field: 'subject', message: subjectError });

  const messageError = validateRequired(formData.message, 'Message');
  if (messageError) errors.push({ field: 'message', message: messageError });

  // Message length validation
  if (formData.message.trim().length < 10) {
    errors.push({ field: 'message', message: 'Message must be at least 10 characters.' });
  }
  if (formData.message.length > 2000) {
    errors.push({ field: 'message', message: 'Message is too long. Maximum 2000 characters allowed.' });
  }

  // Optional fields
  if (formData.phone) {
    const phoneError = validatePhone(formData.phone);
    if (phoneError) errors.push({ field: 'phone', message: phoneError });
  }

  return errors;
}

export function formatValidationErrors(errors: ValidationError[]): string {
  return errors.map(error => `${error.field}: ${error.message}`).join('\n');
}
