import crypto from 'crypto';

/**
 * Verifies a Razorpay payment signature using HMAC-SHA256.
 *
 * The expected signature is computed as:
 *   HMAC-SHA256(razorpay_order_id + "|" + razorpay_payment_id, secret)
 *
 * @param razorpayOrderId - The Razorpay order ID
 * @param razorpayPaymentId - The Razorpay payment ID
 * @param razorpaySignature - The signature provided by Razorpay
 * @param secret - The Razorpay key secret
 * @returns true if the signature is valid, false otherwise
 */
export function verifyRazorpaySignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
  secret: string
): boolean {
  const expectedSignature = generateRazorpaySignature(
    razorpayOrderId,
    razorpayPaymentId,
    secret
  );
  return expectedSignature === razorpaySignature;
}

/**
 * Generates a Razorpay payment signature using HMAC-SHA256.
 *
 * @param razorpayOrderId - The Razorpay order ID
 * @param razorpayPaymentId - The Razorpay payment ID
 * @param secret - The Razorpay key secret
 * @returns The HMAC-SHA256 hex digest
 */
export function generateRazorpaySignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  secret: string
): string {
  return crypto
    .createHmac('sha256', secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');
}
