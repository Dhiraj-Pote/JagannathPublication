import type { CheckoutFormData } from './types';

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

/**
 * Validates a phone number: must be exactly 10 decimal digits.
 * Validates: Requirements 2.7
 */
export function validatePhoneNumber(phone: string): ValidationResult {
  const errors: Record<string, string> = {};

  if (!/^\d{10}$/.test(phone)) {
    errors.phone = 'Phone number must be exactly 10 digits';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates a pincode: must be exactly 6 decimal digits.
 * Validates: Requirements 4.5
 */
export function validatePincode(pincode: string): ValidationResult {
  const errors: Record<string, string> = {};

  if (!/^\d{6}$/.test(pincode)) {
    errors.pincode = 'Pincode must be exactly 6 digits';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates the checkout form: all fields must be non-empty, and pincode must be valid.
 * Validates: Requirements 6.5
 */
export function validateCheckoutForm(data: CheckoutFormData): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Name is required';
  }

  if (!data.address || data.address.trim().length === 0) {
    errors.address = 'Address is required';
  }

  if (!data.pincode || data.pincode.trim().length === 0) {
    errors.pincode = 'Pincode is required';
  } else {
    const pincodeResult = validatePincode(data.pincode);
    if (!pincodeResult.valid) {
      errors.pincode = pincodeResult.errors.pincode;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
