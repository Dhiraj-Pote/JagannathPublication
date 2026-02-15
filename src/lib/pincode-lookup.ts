import type { PincodeDelivery } from './types';

// Mock pincode data matching the SQL seed in supabase/migrations/001_initial_schema.sql
// This will be replaced with actual Supabase queries once the database is connected
export const pincodeData: PincodeDelivery[] = [
  { pincode_start: '110001', pincode_end: '110099', delivery_days: '3 days', zone: 'fast' },
  { pincode_start: '400001', pincode_end: '400099', delivery_days: '3 days', zone: 'fast' },
  { pincode_start: '560001', pincode_end: '560099', delivery_days: '3 days', zone: 'fast' },
  { pincode_start: '700001', pincode_end: '700099', delivery_days: '3 days', zone: 'fast' },
  { pincode_start: '600001', pincode_end: '600099', delivery_days: '5-7 days', zone: 'standard' },
  { pincode_start: '500001', pincode_end: '500099', delivery_days: '5-7 days', zone: 'standard' },
  { pincode_start: '302001', pincode_end: '302099', delivery_days: '5-7 days', zone: 'standard' },
  { pincode_start: '380001', pincode_end: '380099', delivery_days: '5-7 days', zone: 'standard' },
];

export interface PincodeLookupResult {
  available: boolean;
  delivery_days?: string;
  zone?: string;
  message?: string;
}

/**
 * Looks up a pincode against the delivery zone data.
 * Returns delivery estimate if the pincode falls within a known range,
 * or an unavailable result otherwise.
 *
 * Validates: Requirements 4.1, 4.2, 4.3, 4.4
 */
export function lookupPincode(pincode: string): PincodeLookupResult {
  const pincodeNum = parseInt(pincode, 10);

  const match = pincodeData.find((entry) => {
    const start = parseInt(entry.pincode_start, 10);
    const end = parseInt(entry.pincode_end, 10);
    return pincodeNum >= start && pincodeNum <= end;
  });

  if (!match) {
    return {
      available: false,
      message: 'Delivery not available for this pincode',
    };
  }

  return {
    available: true,
    delivery_days: match.delivery_days,
    zone: match.zone,
  };
}
