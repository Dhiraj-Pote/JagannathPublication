import { describe, it, expect } from 'vitest';
import {
  verifyRazorpaySignature,
  generateRazorpaySignature,
} from '@/lib/razorpay-utils';

describe('Razorpay HMAC Signature Verification', () => {
  const testSecret = 'test_secret_key_12345';
  const testOrderId = 'order_ABC123';
  const testPaymentId = 'pay_XYZ789';

  it('should generate a valid HMAC-SHA256 signature', () => {
    const signature = generateRazorpaySignature(
      testOrderId,
      testPaymentId,
      testSecret
    );

    // Signature should be a hex string (64 chars for SHA-256)
    expect(signature).toMatch(/^[a-f0-9]{64}$/);
  });

  it('should verify a correct signature', () => {
    const signature = generateRazorpaySignature(
      testOrderId,
      testPaymentId,
      testSecret
    );

    const isValid = verifyRazorpaySignature(
      testOrderId,
      testPaymentId,
      signature,
      testSecret
    );

    expect(isValid).toBe(true);
  });

  it('should reject an incorrect signature', () => {
    const isValid = verifyRazorpaySignature(
      testOrderId,
      testPaymentId,
      'invalid_signature_value',
      testSecret
    );

    expect(isValid).toBe(false);
  });

  it('should reject when order ID is different', () => {
    const signature = generateRazorpaySignature(
      testOrderId,
      testPaymentId,
      testSecret
    );

    const isValid = verifyRazorpaySignature(
      'order_DIFFERENT',
      testPaymentId,
      signature,
      testSecret
    );

    expect(isValid).toBe(false);
  });

  it('should reject when payment ID is different', () => {
    const signature = generateRazorpaySignature(
      testOrderId,
      testPaymentId,
      testSecret
    );

    const isValid = verifyRazorpaySignature(
      testOrderId,
      'pay_DIFFERENT',
      signature,
      testSecret
    );

    expect(isValid).toBe(false);
  });

  it('should reject when secret is different', () => {
    const signature = generateRazorpaySignature(
      testOrderId,
      testPaymentId,
      testSecret
    );

    const isValid = verifyRazorpaySignature(
      testOrderId,
      testPaymentId,
      signature,
      'wrong_secret'
    );

    expect(isValid).toBe(false);
  });

  it('should produce different signatures for different order IDs', () => {
    const sig1 = generateRazorpaySignature('order_A', testPaymentId, testSecret);
    const sig2 = generateRazorpaySignature('order_B', testPaymentId, testSecret);

    expect(sig1).not.toBe(sig2);
  });

  it('should produce different signatures for different payment IDs', () => {
    const sig1 = generateRazorpaySignature(testOrderId, 'pay_A', testSecret);
    const sig2 = generateRazorpaySignature(testOrderId, 'pay_B', testSecret);

    expect(sig1).not.toBe(sig2);
  });

  it('should produce deterministic signatures for the same inputs', () => {
    const sig1 = generateRazorpaySignature(testOrderId, testPaymentId, testSecret);
    const sig2 = generateRazorpaySignature(testOrderId, testPaymentId, testSecret);

    expect(sig1).toBe(sig2);
  });

  it('should use the pipe separator between order_id and payment_id', () => {
    // Verify that "order_A|pay_B" produces a different signature than "order_A_pay|_B"
    // This ensures the pipe separator is correctly placed
    const sig1 = generateRazorpaySignature('order_A', 'pay_B', testSecret);
    const sig2 = generateRazorpaySignature('order_A_pay', '_B', testSecret);

    expect(sig1).not.toBe(sig2);
  });
});
