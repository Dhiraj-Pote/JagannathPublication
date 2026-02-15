import { describe, it, expect } from 'vitest';
import { lookupPincode, pincodeData } from '@/lib/pincode-lookup';

describe('lookupPincode', () => {
  describe('fast delivery zones', () => {
    it('returns fast delivery for Delhi pincode 110001 (start of range)', () => {
      const result = lookupPincode('110001');
      expect(result.available).toBe(true);
      expect(result.delivery_days).toBe('3 days');
      expect(result.zone).toBe('fast');
    });

    it('returns fast delivery for Delhi pincode 110050 (middle of range)', () => {
      const result = lookupPincode('110050');
      expect(result.available).toBe(true);
      expect(result.delivery_days).toBe('3 days');
      expect(result.zone).toBe('fast');
    });

    it('returns fast delivery for Delhi pincode 110099 (end of range)', () => {
      const result = lookupPincode('110099');
      expect(result.available).toBe(true);
      expect(result.delivery_days).toBe('3 days');
      expect(result.zone).toBe('fast');
    });

    it('returns fast delivery for Mumbai pincode 400001', () => {
      const result = lookupPincode('400001');
      expect(result.available).toBe(true);
      expect(result.delivery_days).toBe('3 days');
      expect(result.zone).toBe('fast');
    });

    it('returns fast delivery for Bangalore pincode 560050', () => {
      const result = lookupPincode('560050');
      expect(result.available).toBe(true);
      expect(result.delivery_days).toBe('3 days');
      expect(result.zone).toBe('fast');
    });

    it('returns fast delivery for Kolkata pincode 700001', () => {
      const result = lookupPincode('700001');
      expect(result.available).toBe(true);
      expect(result.delivery_days).toBe('3 days');
      expect(result.zone).toBe('fast');
    });
  });

  describe('standard delivery zones', () => {
    it('returns standard delivery for Chennai pincode 600001', () => {
      const result = lookupPincode('600001');
      expect(result.available).toBe(true);
      expect(result.delivery_days).toBe('5-7 days');
      expect(result.zone).toBe('standard');
    });

    it('returns standard delivery for Hyderabad pincode 500050', () => {
      const result = lookupPincode('500050');
      expect(result.available).toBe(true);
      expect(result.delivery_days).toBe('5-7 days');
      expect(result.zone).toBe('standard');
    });

    it('returns standard delivery for Jaipur pincode 302001', () => {
      const result = lookupPincode('302001');
      expect(result.available).toBe(true);
      expect(result.delivery_days).toBe('5-7 days');
      expect(result.zone).toBe('standard');
    });

    it('returns standard delivery for Ahmedabad pincode 380099', () => {
      const result = lookupPincode('380099');
      expect(result.available).toBe(true);
      expect(result.delivery_days).toBe('5-7 days');
      expect(result.zone).toBe('standard');
    });
  });

  describe('unavailable pincodes', () => {
    it('returns unavailable for pincode outside all ranges', () => {
      const result = lookupPincode('999999');
      expect(result.available).toBe(false);
      expect(result.message).toBe('Delivery not available for this pincode');
      expect(result.delivery_days).toBeUndefined();
      expect(result.zone).toBeUndefined();
    });

    it('returns unavailable for pincode just below a fast range', () => {
      const result = lookupPincode('110000');
      expect(result.available).toBe(false);
      expect(result.message).toBe('Delivery not available for this pincode');
    });

    it('returns unavailable for pincode just above a fast range', () => {
      const result = lookupPincode('110100');
      expect(result.available).toBe(false);
      expect(result.message).toBe('Delivery not available for this pincode');
    });

    it('returns unavailable for pincode between ranges', () => {
      const result = lookupPincode('200001');
      expect(result.available).toBe(false);
      expect(result.message).toBe('Delivery not available for this pincode');
    });
  });

  describe('mock data integrity', () => {
    it('has 8 pincode delivery entries matching the SQL seed', () => {
      expect(pincodeData).toHaveLength(8);
    });

    it('has 4 fast zones and 4 standard zones', () => {
      const fastZones = pincodeData.filter((d) => d.zone === 'fast');
      const standardZones = pincodeData.filter((d) => d.zone === 'standard');
      expect(fastZones).toHaveLength(4);
      expect(standardZones).toHaveLength(4);
    });

    it('fast zones have "3 days" delivery', () => {
      const fastZones = pincodeData.filter((d) => d.zone === 'fast');
      fastZones.forEach((zone) => {
        expect(zone.delivery_days).toBe('3 days');
      });
    });

    it('standard zones have "5-7 days" delivery', () => {
      const standardZones = pincodeData.filter((d) => d.zone === 'standard');
      standardZones.forEach((zone) => {
        expect(zone.delivery_days).toBe('5-7 days');
      });
    });
  });
});
