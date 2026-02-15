import { describe, it, expect } from 'vitest';
import {
  validatePhoneNumber,
  validatePincode,
  validateCheckoutForm,
} from '@/lib/validators';

describe('validatePhoneNumber', () => {
  it('accepts a valid 10-digit phone number', () => {
    const result = validatePhoneNumber('9876543210');
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('accepts all zeros as a 10-digit number', () => {
    const result = validatePhoneNumber('0000000000');
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('rejects a phone number with fewer than 10 digits', () => {
    const result = validatePhoneNumber('12345');
    expect(result.valid).toBe(false);
    expect(result.errors.phone).toBeDefined();
  });

  it('rejects a phone number with more than 10 digits', () => {
    const result = validatePhoneNumber('12345678901');
    expect(result.valid).toBe(false);
    expect(result.errors.phone).toBeDefined();
  });

  it('rejects a phone number with non-digit characters', () => {
    const result = validatePhoneNumber('98765abcde');
    expect(result.valid).toBe(false);
    expect(result.errors.phone).toBeDefined();
  });

  it('rejects an empty string', () => {
    const result = validatePhoneNumber('');
    expect(result.valid).toBe(false);
    expect(result.errors.phone).toBeDefined();
  });

  it('rejects a phone number with spaces', () => {
    const result = validatePhoneNumber('987 654 321');
    expect(result.valid).toBe(false);
    expect(result.errors.phone).toBeDefined();
  });
});

describe('validatePincode', () => {
  it('accepts a valid 6-digit pincode', () => {
    const result = validatePincode('110001');
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('accepts all zeros as a 6-digit pincode', () => {
    const result = validatePincode('000000');
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('rejects a pincode with fewer than 6 digits', () => {
    const result = validatePincode('1234');
    expect(result.valid).toBe(false);
    expect(result.errors.pincode).toBeDefined();
  });

  it('rejects a pincode with more than 6 digits', () => {
    const result = validatePincode('1234567');
    expect(result.valid).toBe(false);
    expect(result.errors.pincode).toBeDefined();
  });

  it('rejects a pincode with non-digit characters', () => {
    const result = validatePincode('12ab56');
    expect(result.valid).toBe(false);
    expect(result.errors.pincode).toBeDefined();
  });

  it('rejects an empty string', () => {
    const result = validatePincode('');
    expect(result.valid).toBe(false);
    expect(result.errors.pincode).toBeDefined();
  });
});

describe('validateCheckoutForm', () => {
  it('accepts a fully valid form', () => {
    const result = validateCheckoutForm({
      name: 'John Doe',
      address: '123 Main Street',
      pincode: '110001',
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('rejects when name is empty', () => {
    const result = validateCheckoutForm({
      name: '',
      address: '123 Main Street',
      pincode: '110001',
    });
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeDefined();
    expect(result.errors.address).toBeUndefined();
    expect(result.errors.pincode).toBeUndefined();
  });

  it('rejects when name is only whitespace', () => {
    const result = validateCheckoutForm({
      name: '   ',
      address: '123 Main Street',
      pincode: '110001',
    });
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeDefined();
  });

  it('rejects when address is empty', () => {
    const result = validateCheckoutForm({
      name: 'John Doe',
      address: '',
      pincode: '110001',
    });
    expect(result.valid).toBe(false);
    expect(result.errors.address).toBeDefined();
  });

  it('rejects when pincode is empty', () => {
    const result = validateCheckoutForm({
      name: 'John Doe',
      address: '123 Main Street',
      pincode: '',
    });
    expect(result.valid).toBe(false);
    expect(result.errors.pincode).toBeDefined();
  });

  it('rejects when pincode is invalid format', () => {
    const result = validateCheckoutForm({
      name: 'John Doe',
      address: '123 Main Street',
      pincode: '123',
    });
    expect(result.valid).toBe(false);
    expect(result.errors.pincode).toBeDefined();
  });

  it('returns errors for all invalid fields at once', () => {
    const result = validateCheckoutForm({
      name: '',
      address: '',
      pincode: 'abc',
    });
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeDefined();
    expect(result.errors.address).toBeDefined();
    expect(result.errors.pincode).toBeDefined();
  });
});
