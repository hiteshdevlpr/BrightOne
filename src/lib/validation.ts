// Form validation utilities

export interface ValidationError {
  field: string;
  message: string;
}

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

  const emailError = validateEmail(formData.email);
  if (emailError) errors.push({ field: 'email', message: emailError });

  const subjectError = validateRequired(formData.subject, 'Subject');
  if (subjectError) errors.push({ field: 'subject', message: subjectError });

  const messageError = validateRequired(formData.message, 'Message');
  if (messageError) errors.push({ field: 'message', message: messageError });

  // Message length validation
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
